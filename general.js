const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// ==============================================================================
// Task 10: Get the list of books available in the shop using Async-Await
// ==============================================================================
public_users.get('/', async function (req, res) {
  try {
    // Wrapping database fetch in a promise to simulate an asynchronous API request
    const getBooks = () => {
      return new Promise((resolve) => {
        resolve(books);
      });
    };
    
    const allBooks = await getBooks();
    return res.status(200).json({ books: allBooks });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});

// ==============================================================================
// Task 11: Get book details based on ISBN using Promises
// ==============================================================================
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject({ status: 404, message: "Book not found" });
    }
  });

  getBookByISBN
    .then((book) => {
      return res.status(200).json(book);
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});
  
// ==============================================================================
// Task 12: Get book details based on author using Promises
// ==============================================================================
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  
  const getBooksByAuthor = new Promise((resolve, reject) => {
    let filtered_books = [];
    Object.keys(books).forEach((key) => {
      if (books[key].author.toLowerCase() === author) {
        filtered_books.push({ isbn: key, author: books[key].author, title: books[key].title, reviews: books[key].reviews });
      }
    });
    
    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject({ status: 404, message: "No books found by this author" });
    }
  });

  getBooksByAuthor
    .then((bookList) => {
      return res.status(200).json({ booksbyauthor: bookList });
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// ==============================================================================
// Task 13: Get all books based on title using Promises
// ==============================================================================
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();

  const getBooksByTitle = new Promise((resolve, reject) => {
    let filtered_books = [];
    Object.keys(books).forEach((key) => {
      if (books[key].title.toLowerCase() === title) {
        filtered_books.push({ isbn: key, author: books[key].author, title: books[key].title, reviews: books[key].reviews });
      }
    });

    if (filtered_books.length > 0) {
      resolve(filtered_books);
    } else {
      reject({ status: 404, message: "No books found with this title" });
    }
  });

  getBooksByTitle
    .then((bookList) => {
      return res.status(200).json({ booksbytitle: bookList });
    })
    .catch((err) => {
      return res.status(err.status || 500).json({ message: err.message });
    });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json({ reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports = public_users;
