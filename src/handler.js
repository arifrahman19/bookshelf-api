const { nanoid } = require('nanoid')
const books = require('./books')

const addBooksHandler = (request, h) => {
  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload

  const id = nanoid(16)
  const insertedAt = new Date().toISOString()
  const updatedAt = insertedAt
  let finished
  if (pageCount === readPage) {
    finished = true
  } else {
    finished = false
  }

  const newBooks = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
  }

  if (name === '' || name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (newBooks.readPage > newBooks.pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  books.push(newBooks)

  const isSuccess = books.filter((book) => book.id === id).length > 0

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id
      }
    })
    response.code(201)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan'
  })
  response.code(500)
  return response
}

const getAllBooksHandler = (request, h) => {
  const params = request.query
  if (params.name) {
    const payload = []
    books.forEach((book) => {
      if (book.name.toLowerCase() === params.name.toLowerCase()) {
        payload.push(book)
      }
    })
    const response = {
      status: 'success',
      data: {
        books: payload
      }
    }
    return response
  }

  if (params.reading) {
    if (params.reading === 0) {
      const payload = books.filter((book) => book.reading === false)
      const response = {
        status: 'success',
        data: {
          books: payload
        }
      }
      return response
    } else if (params.reading === 1) {
      const payload = books.filter((book) => book.reading === true)
      const response = {
        status: 'success',
        data: {
          books: payload
        }
      }
      return response
    } else {
      const payload = books.map((book) => { return { id: book.id, name: book.name, publisher: book.publisher } })
      const response = {
        status: 'success',
        data: {
          books: payload
        }
      }
      return response
    }
  }

  if (params.finished) {
    if (params.finished === 0) {
      const payload = books.filter((book) => book.finished === false)
      const response = {
        status: 'success',
        data: {
          books: payload
        }
      }
      return response
    } else if (params.finished === 1) {
      const payload = books.filter((book) => book.finished === true)
      const response = {
        status: 'success',
        data: {
          books: payload
        }
      }
      return response
    } else {
      const payload = books.map((book) => { return { id: book.id, name: book.name, publisher: book.publisher } })
      const response = {
        status: 'success',
        data: {
          books: payload
        }
      }
      return response
    }
  }

  const payload = books.map((book) => { return { id: book.id, name: book.name, publisher: book.publisher } })
  const response = {
    status: 'success',
    data: {
      books: payload
    }
  }
  return response
}

const getBooksByIdHandler = (request, h) => {
  const { bookId } = request.params

  const book = books.filter((n) => n.id === bookId)[0]

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book: book
      }
    }
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan'
  })
  response.code(404)
  return response
}

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload
  const updatedAt = new Date().toISOString()

  const index = books.findIndex((book) => book.id === bookId)

  let finished
  if (pageCount === readPage) {
    finished = true
  } else {
    finished = false
  }

  if (name === '' || name === null || name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku'
    })
    response.code(400)
    return response
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
    })
    response.code(400)
    return response
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      finished,
      updatedAt
    }

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params

  const index = books.findIndex((book) => book.id === bookId)

  if (index !== -1) {
    books.splice(index, 1)
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus'
    })
    response.code(200)
    return response
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan'
  })
  response.code(404)
  return response
}

module.exports = { addBooksHandler, getAllBooksHandler, getBooksByIdHandler, editBookByIdHandler, deleteBookByIdHandler }
