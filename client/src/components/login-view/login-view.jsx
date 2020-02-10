import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './login-view.scss'

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    /* Send a request to the server for authentication */
    axios.post('https://myflixdb01.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(response => {
        const data = response.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('no such user')
      });
  };

  return (
    <div className="login-view">
      <Row className="justify-content-center">
        <Col>
          <Container className="container Login-container border border-light shadow p-3 mb-5 rounded py-3 px-3">
            <h3>Log in</h3>
            <Form>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={username} placeholder="Username"
                  onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <Row className="justify-content-end"></Row>
              <Button className="login-button ml-3 mr-3" block onClick={handleSubmit} variant="primary" type="submit">Login</Button>
            </Form>
          </Container >
          <Container className="mt-4">
            <Row className="d-flex align-items-center justify-content-center">
              <span>Don't have an account?</span>
              <Link to={`/register`}>
                <Button variant="link" className="Register-link btn-lg">Sign up</Button>
              </Link>
            </Row>
          </Container>
        </Col>
      </Row>
    </div>
  );
}
