const express = require('express');
const morgan = require('morgan');
const app = express();

//middleware functions
app.use(morgan('common'));

//serving static files
app.use(express.static('public'));

//Error handling middleware functions
app.use(function(err, req, res, next) {
        console.error(err.stack);
        res.status(500).send("Something broke!");
        next();
      });

let top3movies = [ {
    title : 'Harry Potter and the Sorcerer\'s Stone',
},
{
    title : 'Lord of the Rings',
},
{
    title : 'Twilight',
}
]

// GET requests
app.get('/', function(req, res) {
  res.send('Welcome to myFlix!')
});
app.get('/documentation', function(req, res) {
  res.sendFile('documentation.html', { root : __dirname });
});
app.get('/movies', function(req, res) {
  res.json(top3movies)
});
app.get('/secreturl', function (req, res) {
  res.send('This is a secret url with super top-secret content.');
});

// listen for requests
app.listen(8080);
