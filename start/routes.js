'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Cantidadd = require("@adonisjs/lucid/src/Lucid/Model");
const Route = use('Route')


Route.get('register', 'Auth/RegisterController.showRegisterForm').middleware([
  'authenticated'
])
Route.post('register', 'Auth/RegisterController.register').as('register')
Route.get('register/confirm/:token', 'Auth/RegisterController.confirmEmail')
Route.get('login', 'Auth/LoginController.showLoginForm').middleware([
  'authenticated'
])
Route.post('login', 'Auth/LoginController.login').as('login')
Route.get('logout', 'Auth/AuthenticatedController.logout')
Route.get('password/reset', 'Auth/PasswordResetController.showLinkRequestForm')
Route.post('password/email', 'Auth/PasswordResetController.sendResetLinkEmail')
Route.get('password/reset/:token', 'Auth/PasswordResetController.showResetForm')
Route.post('password/reset', 'Auth/PasswordResetController.reset')

Route.get('/book', 'BookController.index')
Route.get('/book/create', 'BookController.create')
Route.get('/book/edit', 'BookController.edit')
Route.get('/book/show', 'BookController.show')
Route.post('/book', 'BookController.store')
Route.get('/book/:id/edit', 'BookController.edit')
Route.get('/book/:id', 'BookController.show')
Route.put('/book/:id', 'BookController.update')
Route.delete('/book/:id', 'BookController.destroy')
