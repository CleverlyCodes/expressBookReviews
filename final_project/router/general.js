const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  if (!req.query.username || !req.query.password) return res.send("username and password cannot be empty!"); 
  
  if (!isValid(req.query.username)) return res.send("Your username is already taken... try a different name");
  
  users.push({"username": req.query.username, "password": req.query.password});
  return res.send("User " + req.query.username + " has been created!");
});

let mockBookQuery = new Promise((resolve,reject) => {
  setTimeout(() => {
    resolve(books);
},2000)});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  mockBookQuery.then((data) => {
    return res.send(JSON.stringify(allBooks));
  }).error((err) => {
    return res.status(400).json({message: err.message});
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  booksArray = Object.entries(books);
  let filtered_books = await booksArray.filter((book) => req.query.isbn == book[0]);
  return res.send(JSON.stringify(filtered_books));
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  booksArray = Object.values(books);
  let filtered_books = await booksArray.filter((book) => req.query.author == book.author);
  return res.send(JSON.stringify(filtered_books));
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  booksArray = Object.values(books);
  let filtered_books = await booksArray.filter((book) => req.query.title == book.title);
  return res.send(JSON.stringify(filtered_books));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  booksArray = Object.entries(books);
  let filtered_books = booksArray.filter((book) => req.query.isbn == book[0]);
  return res.send(filtered_books[0][1].reviews);
  return res.send(JSON.stringify(filtered_books.reviews));
});

module.exports.general = public_users;
