'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BooksSchema extends Schema {
  up () {
    this.create('books', (table) => {
      table.increments()
      table.string('author').references('users.username')
      table.string('titulo')
      table.string('ano')
      table.string('descripcion')
      table.timestamps()    })
  }

  down () {
    this.drop('books')
  }
}

module.exports = BooksSchema
