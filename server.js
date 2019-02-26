'use strict';

// Application Dependencies
const express = require('express');
const superagent = require('superagent');

// Application Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Application Middleware
app.use(express.urlencoded({ extended: true }));

// Set the file locations for ejs templates and static files like CSS
app.set('view engine', 'ejs');
app.use(express.static(__dirname +'/public'));


// API Routes
// Renders the search form
app.get('/', newSearch);

// Creates a new search to the Google Books API
app.post('/searches', createSearch);

// Catch-all
app.get('*', (request, response) => response.status(404).send('This route does not exist'));

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));

// HELPER FUNCTIONS
function Book(info) {
  const placeHolder = 'https://i.imgur.com/J5LVHEL.jpg';
  this.title = info.title || 'No Title Avaialble';
  this.author = info.authors || 'No Author Available';
  this.isbn=info.industryIdentifiers;
  this.img_url = info.imageLinks ? info.imageLinks.thumbnail : placeHolder;
  this.description=info.description || 'No description is Available'
}

// Note that .ejs file extension is not required
function newSearch(request, response) {
  response.render('pages/index'); //location for ejs files
  app.use(express.static('./public'));//location for other files like css
}

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
    .then(apiResponse => apiResponse.body.items.map(bookResult => {
        //console.log(bookResult.volumeInfo);
        new Book(bookResult.volumeInfo);
    }))
    .then(results => {
        console.log('line 66', results);
      response.render('pages/searches/show', { searchesResults: results });
        //response.send('rendering');
});

  // how will we handle errors?
}