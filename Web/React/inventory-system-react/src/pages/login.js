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

// Login.js
import React from 'react';
import './Login.css'; // Importa el archivo CSS
import { useNavigate } from 'react-router-dom'; // Para la redirección

const Login = () => {
  const navigate = useNavigate(); // Hook para navegar

  const handleLogin = (event) => {
    event.preventDefault();
    // Lógica de validación (opcional)
    navigate('/loading'); // Redirige a la pantalla de carga
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img
            src="/LogoLogin.png" 
            alt="Logo" 
            className="login-logo" 
          />
          <h1>Bienvenido </h1>
          <p>Ingresa tu Usuario y Contraseña para continuar</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Ingresa tu usuario"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <button type="submit" className="login-button">
            Ingresar
          </button>
        </form>
      </div>
      <div className="login-image">
        <img src="/LoginBackgroung.png" alt="Inventario" className="inventory-img" />
      </div>
    </div>
  );
};

export default Login;
