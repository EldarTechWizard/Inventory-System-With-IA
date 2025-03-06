import React, { useState, useContext } from "react";
import AuthContext from "../context/authContext";
import { Navigate } from "react-router-dom";
import "../styles/Login.css";
import ImageLogin from "../assets/LoginImage.png";
import logo from "../assets/logo2.png";
import { Table, Modal, Form, Row, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { width } from "@mui/system";

function Login() {
  let { loginUser, user } = useContext(AuthContext);
  let [error, setError] = useState("");

  if (user) {
    return <Navigate to="/" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await loginUser(e);
      setError("");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Credenciales incorrectas. Verifica tu usuario y contraseña.");
        console.log(error);
      } else {
        setError("Ocurrió un error al iniciar sesión. Intenta nuevamente.");
        console.log(error);
      }
    }
  };

  return (
    <div className="w-100 h-100 d-flex align-items-center justify-content-center gap-5 pt-5">
      <div className="d-flex flex-column formContainer gap-2 h-100">
        <div className="d-flex flex-column text-center gap-5 ">
          <img src={logo} alt="Logo" width={500} height={170} />
          <p>Ingresa tu Usuario y Contraseña para continuar</p>
        </div>
        <Form className="d-flex" onSubmit={handleLogin}>
          <div className="d-flex flex-column w-100 gap-3">
            <Form.Group controlId="username">
              <Form.Label>Usuario</Form.Label>
              <Form.Control type="text" placeholder="" />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" placeholder="" />
            </Form.Group>
            {error && <p className="text-danger m-0">{error}</p>}
            <Button
              variant="contained"
              type="submit"
              endIcon={<ArrowForwardIcon />}
            >
              Iniciar sesion
            </Button>
          </div>
        </Form>
      </div>
      <div className="d-flex flex-column justify-content-center imageContainer align-items-center">
        <h5 className="leftTittle text-center">
          Bienvenido a su Sistema de Inventario de Calidad y Confianza
        </h5>
        <img
          src={ImageLogin}
          alt="Inventario"
          className="inventory-img"
          width={600}
          height={600}
        />
      </div>
    </div>
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
