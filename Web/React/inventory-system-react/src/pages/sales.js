import React, { useState } from "react";
import { isLoggedIn } from "../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdmin, isSales } from "../utils/groups";

function Sales() {
  return (
    <div className="d-flex m-2 bg-white">
      <h1>Sales</h1>
    </div>
  );
}

export default Sales;
