import React, { useState } from "react";
import { isLoggedIn } from "../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdmin, isWarehouse } from "../utils/groups";

function Suppliers() {
  return (
    <div className="d-flex m-2 bg-white">
      <h1>Suppliers</h1>
    </div>
  );
}

export default Suppliers;
