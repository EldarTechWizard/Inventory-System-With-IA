import React, { useState } from "react";
import { isLoggedIn } from "../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdmin, isSales } from "../utils/groups";

function Customers() {
  return (
    <div className="d-flex m-2 bg-white">
      <h1>Customers</h1>
    </div>
  );
}

export default Customers;
