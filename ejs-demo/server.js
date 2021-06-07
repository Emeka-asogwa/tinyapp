const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/',(req, res) => {
  res.render('pages/index');
});

// about page
app.get('/about',(req, res) => {
  res.render('pages/about');
});

app.listen(8080);
console.log('Server is listening on port 8080');