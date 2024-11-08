import React from "react";
import { Navigate } from "react-router-dom";

// Componente que verifica permisos según el grupo del usuario
const GroupProtectedRoute = ({ allowedGroups, userGroup, children }) => {
  if (allowedGroups === userGroup || userGroup === "Admin") {
    return children; // Renderiza el componente si tiene acceso
  } else {
    return <Navigate to="/" />; // Redirige si no tiene acceso
  }
};

export default GroupProtectedRoute;
