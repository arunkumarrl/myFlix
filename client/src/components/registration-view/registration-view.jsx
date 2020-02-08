import React, { useState } from "react";
import "./registration-view.scss";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export function RegistrationView(props) {
  const [username, createUsername] = useState("");
  const [password, createPassword] = useState("");
  const [email, createEmail] = useState("");
  const [birthday, createBirthday] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("https://myflixdb01.herokuapp.com/users", {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthday
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        window.open("/", "_self"); // the second argument '_self' is necessary so that the page will open in the current tab
      })
      .catch((e) => {
        console.log("error registering the user");
      });
  };

  return (
    <Form className="registration-form">
      <Form.Group controlId="formBasicUsername">
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => createUsername(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formBasicPassword">
        <Form.Control
          type="text"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => createPassword(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Control
          type="text"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => createEmail(e.target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formBasicBirthday">
        <Form.Control
          type="text"
          placeholder="Enter Date of Birth"
          value={birthday}
          onChange={(e) => createBirthday(e.target.value)}
        />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={handleRegister}>
        Register
      </Button>
    </Form>
  )
};