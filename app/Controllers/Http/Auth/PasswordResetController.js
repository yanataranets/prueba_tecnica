'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('random-string')
const Mail = use('Mail')
const Hash = use('Hash')

class PasswordResetController {
  showLinkRequestForm ({ view }) {
    return view.render('auth.passwords.email')
  }

  async sendResetLinkEmail ({ request, session, response }) {
    // validate form inputs
    const validation = await validate(request.only('email'), {
      email: 'required|email'
    })

    if (validation.fails()) {
      session.withErrors(validation.messages()).flashAll()

      return response.redirect('back')
    }

    try {
      // get user
      const user = await User.findBy('email', request.input('email'))

      await PasswordReset.query().where('email', user.email).delete()

      const { token } = await PasswordReset.create({
        email: user.email,
        token: randomString({ length: 40 })
      })

      const mailData = {
        user: user.toJSON(),
        token
      }

      await Mail.send('auth.emails.password_reset', mailData, message => {
        message
          .to(user.email)
          .from('hello@adonisjs.com')
          .subject('Enlace de restablecimiento de contraseña')
      })

      session.flash({
        notification: {
          type: 'success',
          message: 'Se ha enviado un enlace para restablecer la contraseña a su dirección de correo electrónico.'
        }
      })

      return response.redirect('back')
    } catch (error) {
      session.flash({
        notification: {
          type: 'danger',
          message: 'Lo sentimos, no hay ningún usuario con esta dirección de correo electrónico.'
        }
      })

      return response.redirect('back')
    }
  }

  showResetForm ({ params, view }) {
    return view.render('auth.passwords.reset', { token: params.token })
  }

  async reset ({ request, session, response }) {
    // validate form inputs
    const validation = await validateAll(request.all(), {
      token: 'required',
      email: 'required',
      password: 'required|confirmed'
    })

    if (validation.fails()) {
      session
        .withErrors(validation.messages())
        .flashExcept(['password', 'password_confirmation'])

      return response.redirect('back')
    }

    try {
      // get user by the provider email
      const user = await User.findBy('email', request.input('email'))

      // check if password reet token exist for user
      const token = await PasswordReset.query()
        .where('email', user.email)
        .where('token', request.input('token'))
        .first()

      if (!token) {
        // display error message
        session.flash({
          notification: {
            type: 'danger',
            message: 'Este token de restablecimiento de contraseña no existe.'
          }
        })

        return response.redirect('back')
      }

      user.password = await Hash.make(request.input('password'))
      await user.save()

      // delete password reset token
      await PasswordReset.query().where('email', user.email).delete()

      // display success message
      session.flash({
        notification: {
          type: 'success',
          message: '¡Tu contraseña ha sido restablecida!'
        }
      })

      return response.redirect('/login')
    } catch (error) {
      // display error message
      session.flash({
        notification: {
          type: 'danger',
          message: 'Lo sentimos, no hay ningún usuario con esta dirección de correo electrónico.'
        }
      })

      return response.redirect('back')
    }
  }
}

module.exports = PasswordResetController
