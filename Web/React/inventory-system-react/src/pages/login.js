import React, { useState, useContext } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import AuthContext from "../context/authContext";
import { Navigate } from "react-router-dom";

function Login() {
  let { loginUser, user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">Inicio de Sesión</h2>

      <Form onSubmit={loginUser}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            name="username"
            autoComplete="off"
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mt-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            name="password"
            autoComplete="off"
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100 mt-4">
          Iniciar Sesión
        </Button>
      </Form>
    </Container>
  );
}

export default Login;
