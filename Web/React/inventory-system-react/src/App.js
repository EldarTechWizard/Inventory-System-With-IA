import React, { useEffect, useState } from "react";
import Login from "./pages/login";
import Main from "./pages/main";
import ProtectedRoute from "./components/protectedRoute";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import InventoryReport from "./pages/inventoryReport";
import SalesReport from "./pages/salesReport";
import Sales from "./pages/sales";
import ViewProducts from "./pages/viewProducts";
import Customers from "./pages/customers";
import Products from "./pages/products";
import Suppliers from "./pages/suppliers";
import { AuthProvider } from "./context/authContext";
import ProtectedComponent from "./components/protectedRoute";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedComponent
                component={Main}
                roles={["Admin", "Warehouse", "Sales"]}
              />
            }
          />
          <Route
            path="/Reporte-Inventario"
            element={
              <ProtectedComponent
                component={InventoryReport}
                roles={["Admin"]}
              />
            }
          />
          <Route
            path="/Reporte-Ventas"
            element={
              <ProtectedComponent component={SalesReport} roles={["Admin"]} />
            }
          />
          <Route
            path="/Ventas"
            element={
              <ProtectedComponent
                component={Sales}
                roles={["Admin", "Sales"]}
              />
            }
          />
          <Route
            path="/Ver-Productos"
            element={
              <ProtectedComponent
                component={ViewProducts}
                roles={["Admin", "Sales"]}
              />
            }
          />
          <Route
            path="/Clientes"
            element={
              <ProtectedComponent
                component={Customers}
                roles={["Admin", "Sales"]}
              />
            }
          />
          <Route
            path="/Productos"
            element={
              <ProtectedComponent
                component={Products}
                roles={["Admin", "Warehouse"]}
              />
            }
          />

          <Route
            path="/Proveedores"
            element={
              <ProtectedComponent
                component={Suppliers}
                roles={["Admin", "Warehouse"]}
              />
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
