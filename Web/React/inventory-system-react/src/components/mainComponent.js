import React, { useState } from "react";
import Sidebar from "../layouts/sideBar";
import Header from "../layouts/header";

function MainComponent({ children }) {
  return (
    <div className="d-flex h-100 w-100">
      <Sidebar />
      <div className="h-100 relative dashboard">
        <Header />
        {children}
      </div>
    </div>
  );
}

export default MainComponent;
