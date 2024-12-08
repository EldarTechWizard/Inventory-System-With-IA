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

export default Login;
