import React, { useState, useContext } from "react";
import AuthContext from "../context/authContext";
import { Navigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
  let { loginUser, user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/LogoLogin.png" alt="Logo" className="login-logo" />
          <h1>Bienvenido </h1>
          <p>Ingresa tu Usuario y Contraseña para continuar</p>
        </div>
        <form className="login-form" onSubmit={loginUser}>
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
        <img
          src="/LoginBackgroung.png"
          alt="Inventario"
          className="inventory-img"
        />
      </div>
    </div>
  );
}

export default Login;
