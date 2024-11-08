import React, { useState } from "react";
import { isLoggedIn } from "../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdmin } from "../utils/groups";

function SalesReport() {
  return (
    <div className="d-flex m-2 bg-white">
      <h1>SalesReport</h1>
    </div>
  );
}

export default SalesReport;
