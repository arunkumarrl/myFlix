import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import './profile-view.scss';

import { setMovies } from '../../actions/actions';
import { setUserProfile } from '../../actions/actions';
import { Link } from "react-router-dom";

export class ProfileView extends React.Component {

  constructor() {
    super();
    this.state = {};
  }

  deleteFavorite(movieId) {
    axios.delete(`https://myflixdb01.herokuapp.com/users/${localStorage.getItem('user')}/Movies/${movieId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        document.location.reload(true);
      })
      .then(() => {
        alert('Movie successfully deleted from favorites');
      })

      .catch(e => {
        alert('Movie could not be deleted from favorites ' + e)
      });
  }

  componentDidMount() {
    //authentication
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://myflixdb01.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(response => {
        this.setState({
          userData: response.data,
          username: response.data.Username,
          password: response.data.Password,
          email: response.data.Email,
          birthday: response.data.Birthday,
          favouriteMovies: response.data.Favourites
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  deleteMovieFromFavs(event, favoriteMovie) {
    event.preventDefault();
    console.log(favoriteMovie);
    axios.delete(`https://myflixdb01.herokuapp.com/users/${localStorage.getItem('user')}/Favourites/${favoriteMovie}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        this.getUser(localStorage.getItem('token'));
      })
      .catch(() => {
        alert('Oops... something went wrong...');
      });
  }

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  render() {
    const { username, email, birthday, favouriteMovies } = this.state;

    return (
      <Card className="profile-view" style={{ width: '32rem' }}>
        <Card.Body>
          <Card.Title className="profile-title">My Profile</Card.Title>
          <ListGroup className="list-group-flush" variant="flush">
            <ListGroup.Item>Username: {username}</ListGroup.Item>
            <ListGroup.Item>Password:******* </ListGroup.Item>
            <ListGroup.Item>Email: {email}</ListGroup.Item>
            <ListGroup.Item>Birthday: {birthday && birthday.slice(0, 10)}</ListGroup.Item>
            <ListGroup.Item>Favourite Movies:
             <div>
                {favouriteMovies === 0 &&
                  <div className="value">No Favourite Movies have been added</div>
                }
                {favouriteMovies > 0 &&
                  <ul>
                    {favouriteMovies.map(favouriteMovie =>
                      (<li key={favoriteMovie}>
                        <p className="favouriteMovies">
                          {JSON.parse(localStorage.getItem('movies')).find(movie => movie._id === favouriteMovie).Title}
                        </p>
                        <Link to={`/movies/${favouriteMovie}`}>
                          <Button size="sm" variant="info">Open</Button>
                        </Link>
                        <Button variant="secondary" size="sm" onClick={(event) => this.deleteMovieFromFavs(event, favouriteMovie)}>
                          Delete
                        </Button>
                      </li>)
                    )}
                  </ul>
                }
              </div>
            </ListGroup.Item>
          </ListGroup>
          <div className="text-center">
            <Link to={`/`}>
              <Button className="button-back" variant="outline-info">MOVIES</Button>
            </Link>
            <Link to={`/update/:Username`}>
              <Button className="button-update" variant="outline-secondary">Update profile</Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

let mapStateToProps = state => {
  return { movies: state.movies, userProfile: state.userProfile }
};
const mapDispatchToProps = {
  setMovies,
  setUserProfile
}
// #4
export default connect(mapStateToProps, mapDispatchToProps)(ProfileView);
ProfileView.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
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
      Featured: PropTypes.boolean
    })
  ),
  userProfile: PropTypes.shape({
    _id: PropTypes.string,
    FavoriteMovies: PropTypes.arrays,
    Username: PropTypes.string,
    Email: PropTypes.string,
    Password: PropTypes.string,
    Birthday: PropTypes.date
  }).isRequired
};