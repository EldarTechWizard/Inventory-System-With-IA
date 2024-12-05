import React, { useState } from "react";
import Sidebar from "../layouts/sideBar";
import Header from "../layouts/header";

function MainComponent({ children }) {
  return (
    <div className="d-flex h-100">
      <Sidebar />
      <div className="w-100 h-100">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default MainComponent;
