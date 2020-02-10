const path = require("path");
const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");
const mongoose = require("mongoose");
const Models = require("./models.js");

const Movies = Models.Movie;
const Users = Models.User;
const passport = require('passport');
require('./passport');
const cors = require('cors');
//let allowedOrigins = [`http://localhost:${port}`, ...process.env.ALLOWED_ORIGINS.split(' ')];
const { check, validationResult } = require('express-validator');


//mongoose.connect('mongodb://localhost:27017/myFlixDB', {useNewUrlParser: true,useUnifiedTopology: true});
//mongoose.connect('mongodb+srv://myflixdb:Myflixdb2112%21@cluster0.mongodb.net/myFlixDB?retryWrites=true', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://myflixdbadmin:myflixdb1234@myflixdb-qkqkp.mongodb.net/myFlixDB?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => {
    console.log("connected")
  })


// Middleware functions
app.use(express.static("public"));
app.use("/client", express.static(path.join(__dirname, "client", "dist")));
app.use(morgan("common")); // Logging with Morgan
app.use(bodyParser.json()); // Using bodyParser
app.use(cors());
var auth = require('./auth')(app)
//Error handling middleware functions

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});

// Homepage
app.get("/client/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});


// Gets the list of data about ALL users
app.get('/users',
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.find()
      .then(function (users) {
        res.status(201).json(users)
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });

// Get a user by username
app.get('/users/:Username',
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOne({ Username: req.params.Username })
      .then(function (user) {
        res.json(user)
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });

// Gets the list of data about ALL movies

app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Gets the data about a single movie, by title

app.get(
  "/movies/:Title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Get data about a movie genre, by name

app.get(
  "/movies/genres/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({
      "Genre.Name": req.params.Name
    })
      .then((movies) => {
        res.json(movies.Genre);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Get data about a director

app.get(
  "/movies/directors/:Name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({
      "Director.Name": req.params.Name
    })
      .then((movies) => {
        res.json(movies.Director);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Add a user

app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [check('Username', 'Username is required').isLength({ min: 5 }),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()],
  (req, res) => {

    // check the validation object for errors
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    var hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then(function (user) {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then(function (user) { res.status(201).json(user) })
            .catch(function (error) {
              console.error(error);
              res.status(500).send("Error: " + error);
            })
        }
      }).catch(function (error) {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

// Update the user's information by name/password

app.put('/users/:Username',
  passport.authenticate("jwt", { session: false }),
  function (req, res) {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
      $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
      { new: true }, // This line makes sure that the updated document is returned
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser)
        }
      })
  });

// Add a movie to a user's list of favorites

app.post(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Remove a movie from user's list of favorites

app.delete(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // This line makes sure that the updated document is returned
      (error, updatedUser) => {
        if (error) {
          console.error(error);
          res.status(500).send("Error: " + error);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete a user by username

app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Listen for requests on port 3000
var port = process.env.PORT || 5000;
app.listen(port, "0.0.0.0", function () {
  console.log("Listening on Port 5000");
});
