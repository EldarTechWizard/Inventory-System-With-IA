import React from "react";
import Login from "./pages/login";
import Main from "./pages/main";
import ProtectedRoute from "./components/protectedRoute";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
