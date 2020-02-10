import React from "react";
import PropTypes from 'prop-types';
import Media from 'react-bootstrap/Media';
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import './movie-view.scss';
import axios from 'axios';

export class MovieView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  addToFavorites(e) {
    const { movie } = this.props;
    e.preventDefault();
    axios.post(
      `https://myflixdb01.herokuapp.com/users/username/Movies/${movie._id}`,
      { username: localStorage.getItem('user') },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(res => {
        alert(`${movie.Title} successfully added to your favorites`);
      })
      // .then(res => {
      //   window.open(`/users/${localStorage.getItem('user')}`)
      // })
      .then(res => {
        document.location.reload(true);
      })
      .catch(error => {
        alert(`${movie.Title} not added to your favorites` + error)
      });
  }
  render() {
    const { movie } = this.props;
    if (!movie) return null;
    return (
      <div
        className="container-fluid align-items-center ml-3 mt-2"
        style={{ width: "660px" }}
      >
        <div className="movie-title">
          <h1 className="value">{movie.Title}</h1>
        </div>
        <img
          className="movie-poster"
          src="http://via.placeholder.com/640x360"
        />
        <div className="movie-description">
          <div className="mt-1 mb-3">{movie.Description}</div>
        </div>
        <div className="movie-genre">
          Genre:
          <Link to={`/genres/${movie.Genre.Name}`}>
            <Button variant="link">{movie.Genre.Name}</Button>
          </Link>
        </div>
        <div className="movie-director">
          Director:
          <Link to={`/directors/${movie.Director.Name}`}>
            <Button variant="link">{movie.Director.Name}</Button>
          </Link>
        </div>
        <Link to={`/`}>
          <Button className="mt-3" variant="primary">
            Back to Movies
          </Button>
        </Link>

        <Button className="add-favorite-btn mt-4" onClick={e => this.addToFavorites(e)}>
          <span className="d-flex align-items-center">
            <i className="mr-3">   Add to my favorites</i>
          </span>
        </Button>
      </div >
    );
  }
}
MovieView.propTypes = {
  movie: PropTypes.shape({
    _id: PropTypes.string,
    Title: PropTypes.string,
    ReleaseYear: PropTypes.string,
    ImagePath: PropTypes.string,
    Description: PropTypes.string,
    Genre: PropTypes.shape({
      Name: PropTypes.string,
      Description: PropTypes.string
    }),
    Director: PropTypes.shape({
      Name: PropTypes.string,
      Bio: PropTypes.string,
      Birth: PropTypes.string,
      Death: PropTypes.string
    }),
    Featured: PropTypes.boolean,
    Actors: PropTypes.array
  }),
  userProfile: PropTypes.shape({
    _id: PropTypes.string,
    FavoriteMovies: PropTypes.arrays,
    Username: PropTypes.string,
    Password: PropTypes.string,
    Birthday: PropTypes.date
  }).isRequired
};