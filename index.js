const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const uuid = require("uuid");

// Middleware functions
app.use(express.static("public"));
app.use(morgan("common")); // Logging with Morgan
app.use(bodyParser.json()); // Using bodyParser


//Error handling middleware functions

app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});
let movies = [
  {
    Title : "Robo",
    Description: "The movie is about the good robot which becomes bad and fights against the creator",
    Genre : "Action",
    DirectorName: "Sharmila"
  }
];
let genres = [
  {
    Name : "Action",
    Description : "Action film is a film genre in which the protagonist or protagonists are thrust into a series of events that typically include violence, extended fighting, physical feats, and frantic chases"
  }
];

let directors = [
  {
    Name : "Shankar.S",
    Details :"17 August 1963"
  }
];
let Users = [
  {
    name : "arun",
    password : "kumar",
    id : "1"
    }
];
// Homepage

app.get("/", (req, res) => {
  res.send("Welcome to myFlix! ");
});

// Gets the list of data about ALL movies

app.get(
  "/movies",(req, res) => {
    /*movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });*/
      res.json(movies);
  }
);

// Gets the data about a single movie, by title

app.get(
  "/movies/:Title",(req, res) => {
    res.json(movies.find( (movie) =>
      { return movie.Title === req.params.Title   }));
  });

// Get data about a movie genre, by name

app.get(
  "/genres/:Name",(req, res) => {
    res.json(genres.find( (genre) =>
      { return genre.Name === req.params.Name   }));
  });

// Get data about a director

app.get(
  "/directors/:Name",(req, res) => {
    res.json(directors.find( (director) =>
      { return director.Name === req.params.Name   }));
  });

// Add a user

app.post("/Users", (req, res) => {
  let newUser = req.body;
    if (!newUser.name) {
    const message = `Missing "name" in request body`;
    res.status(400).send(message);
    } else {
    newUser.id = uuid.v4();
    Users.push(newUser);
    res.status(201).send(newUser);
  }
});

// Update the user's information by name/password

app.put(
  "/Users/:name/:password",(req, res) => {
  let user = Users.find((user) => { return user.name === req.params.name });

  if (user) {
    user.name[req.params.name] = req.params.password;
    res.status(201).send("The username and password was updated successfully ");
  } else {
    res.status(404).send("user with the name " + req.params.name + " was not found.")
  }
});

// Add a movie to a user's list of favorites

app.post(
  "/users/:name/favourites",
  (req, res) => {
    let newUser = req.body;
      if (!newUser.name) {
      const message = `Missing "name" in request body`;
      res.status(400).send(message);
      } else {
      newUser.id = uuid.v4();
      Users.push(newUser);
      res.status(201).send(newUser);
    }
  });

// Remove a movie from user's list of favorites

app.delete(
  "/users/:name/favourites",(req, res) => {
    let newUser = req.body;
      if (!newUser.id) {
      const message = `Robo was removed from favourites`;
      res.status(400).send(message);
      } else {
      newUser.id = uuid.v4();
      Users.push(newUser);
      res.status(201).send(newUser);
    }
  });


// Delete a user by username

app.delete(
  "/Users/:name",(req, res) => {
let user = Users.find ((user)=>{return user.name ===req.params.name});
if(user){
  Users.filter (function(obj){return obj.name!==req.params.name});
  res.status(201).send("user " +req.params.name+ " was deleted.")
}
});

app.listen(8080, () => {
  console.log(`Your app is listening on port 8080`);
});
