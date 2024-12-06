import React, { useState } from "react";
import logo from "../assets/logo.png";
function Main() {
  return (
    <div className="d-flex p-2 bg-white w-100 h-100 justify-content-center align-items-center">
      <div className="d-flex flex-column  align-items-center pb-5">
        <img src={logo} alt="Principal" className="pb-3" width={200} />
        <h1>Bienvenido</h1>
      </div>
    </div>
  );
}

export default Main;
