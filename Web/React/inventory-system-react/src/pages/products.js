import React, { useState } from "react";
import { isLoggedIn } from "../utils/auth";
import { Navigate, useNavigate } from "react-router-dom";
import { isAdmin, isWarehouse } from "../utils/groups";

function Products() {
  return (
    <div className="d-flex m-2 bg-white">
      <h1>Products</h1>
    </div>
  );
}

export default Products;
