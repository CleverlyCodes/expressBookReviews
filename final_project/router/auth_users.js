const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username": "JayEm",
  "password": "supersecretpassword"
},
{
  "username": "Paola",
  "password": "supersecretpassword"
}];

const isValid = (username)=>{ //returns boolean
  let filtered_users = users.filter((user) => user.username == username);
  return filtered_users.length > 0 ? false : true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  let filtered_users = users.filter((user) => user.username == username && user.password == password);
  return filtered_users.length > 0 ? true : false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  if (!req.query.username || !req.query.password) return res.send("username and password cannot be empty!"); 
  if (!authenticatedUser(req.query.username, req.query.password)) return res.send("Invalid credentials!");

  let signedInUser = users.filter((user) => user.username == req.query.username);

  let accessToken = jwt.sign({
      user: signedInUser
    }, 
    'fingerprint_customer', 
    { expiresIn: 60 * 60 
  });
    
  req.session.authorization = {
    accessToken
  }

  return res.send("user " + accessToken + " is now logged in!");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!req.query.isbn) return res.status(400).json({message: "book can't be found"});

  books[req.query.isbn].reviews[req.user.user[0].username] = req.query.review;

  return res.send(JSON.stringify(books));
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (!req.query.isbn) return res.status(400).json({message: "book can't be found"});

  delete books[req.query.isbn].reviews[req.user.user[0].username];

  return res.send("your review has been deleted" + JSON.stringify(books));
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
