import React, { useState } from "react";
import { logout, isLoggedIn } from "../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";

function Main() {
  return (
    <div className="d-flex m-2 bg-white">
      <h1>Hola</h1>
    </div>
  );
}

export default Main;