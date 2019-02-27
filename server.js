'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');
const pg = require('pg');
const cors = require('cors');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.urlencoded({ extended: true }));

// Database setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));


// Set the view engine for server-side templating
app.set('view engine', 'ejs');
// Set the file locations for ejs templates and static files like CSS
app.use(express.static('./public'));


// API Routes
// Renders the search form
app.get('/new', newSearch);

// Creates a new search to the Google Books API
app.post('/searches', createSearch);
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// HELPER FUNCTIONS

function handleError(error, response) {
  console.error(error);
  response.render('pages/error');
}

function Book(info) {
  const placeHolder = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title ? info.title : 'No Title Avaialble';
  this.author = info.authors ? info.authors : 'No Author Available';
  this.isbn = info.industryIdentifiers ? `ISBN_13 ${info.industryIdentifiers[0].identifier}` : 'No ISBN available';
  this.img_url = info.imageLinks ? info.imageLinks.thumbnail : placeHolder;
  this.description = info.description ? info.description : 'No description is available';
  this.id = info.industryIdentifiers ? `${info.industryIdentifiers[0].identifier}` : ''
}

// Note that .ejs file extension is not required
function newSearch(request, response) {
  response.render('pages/index'); //location for ejs files
  app.use(express.static('./public'));//location for other files like css
}

// No API key required

// No API key required
// Console.log request.body and request.body.search
function createSearch(request, response) {
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  console.log(request.body)
  console.log(request.body.search)

  if (request.body.search[1] === 'title') { url += `+intitle:${request.body.search[0]}`; }
  if (request.body.search[1] === 'author') { url += `+inauthor:${request.body.search[0]}`; }

  console.log(url);

  superagent.get(url)
    .then(apiResponse =>
      apiResponse.body.items.map(bookResult => new Book(bookResult.volumeInfo)))
    .then(results => response.render('pages/searches/show', { searchesResults: results }))
    .catch(error => handleError(error, response));
}
