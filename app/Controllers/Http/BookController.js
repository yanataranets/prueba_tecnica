'use strict'
const Book = use('App/Models/Book')
class BookController {
  async index({view}){
    const books = await Book.all();

    return view.render('book/index', {
      books: books.toJSON()
    })
  }
  async create({view}){
    return view.render('book/create');
  }

  async store({request, response, auth}){
    const book = new Book();

    book.author = auth.user.username;
    book.titulo = request.input('titulo');
    book.ano = request.input('ano');
    book.descripcion = request.input('descripcion');

    book.save();
    response.redirect('/book');
  }

  async edit({view, params}){
    const book = await Book.find(params.id)
    return view.render('book/edit', {
      book: book
    })
  }

  async update({request, params, response, auth}){
    const book = await Book.find(params.id);
    book.author = auth.user.username;
    book.titulo = request.input('titulo');
    book.ano = request.input('ano');
    book.descripcion = request.input('descripcion');

    book.save();
    response.redirect('/book');
  }


  async show({view, params}){
    const book = await Book.find(params.id)
    return view.render('book/show', {book: book});
  }


  async destroy({session, params, response}){
    const book = await Book.find(params.id)
    book.delete();
    session.flash({notification: "Eliminado"})
    response.redirect('/book')
  }
}

module.exports = BookController
