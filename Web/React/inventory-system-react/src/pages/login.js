import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { isLoggedIn } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (username === "" || password === "") {
      setError("Por favor, completa todos los campos");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      if (!response.ok) {
        throw new Error("Crendenciales incorrectas");
      }

      const data = await response.json();

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoggedIn()) {
    return <Navigate to="/" />;
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center">Inicio de Sesión</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Nombre de usuario</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword" className="mt-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
