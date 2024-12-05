import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function Header() {
  const location = useLocation();
  const pathname =
    location.pathname === "/" ? "Main" : location.pathname.slice(1);

  return (
    <div className="d-flex p-3">
      <h6>Pages / {pathname}</h6>
    </div>
  );
}

export default Header;
