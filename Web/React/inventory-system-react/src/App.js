import React, { useEffect, useState } from "react";
import Login from "./pages/login";
import Main from "./pages/main";
import ProtectedRoute from "./components/protectedRoute";
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";
import MainComponent from "./components/mainComponent";
import InventoryReport from "./pages/inventoryReport";
import SalesReport from "./pages/salesReport";
import Sales from "./pages/sales";
import ViewProducts from "./pages/viewProducts";
import Customers from "./pages/customers";
import Products from "./pages/products";
import Suppliers from "./pages/suppliers";
import GroupProtectedRoute from "./components/groupProtectedRoute";
import { groups } from "./utils/groups";

const createProtectedRoute = (path, Component, groups, userGroup) => (
  <Route
    path={path}
    element={
      <GroupProtectedRoute allowedGroups={groups} userGroup={userGroup}>
        <ProtectedRoute>
          <MainComponent>
            <Component />
          </MainComponent>
        </ProtectedRoute>
      </GroupProtectedRoute>
    }
  />
);

function App() {
  const [userGroup, setUserGroup] = useState(localStorage.getItem("group"));

  useEffect(() => {
    setUserGroup(localStorage.getItem("group"));
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainComponent>
                <Main />
              </MainComponent>
            </ProtectedRoute>
          }
        />

        {createProtectedRoute(
          "/Reporte-Inventario",
          InventoryReport,
          "Admin",
          userGroup
        )}
        {createProtectedRoute(
          "/Reporte-Ventas",
          SalesReport,
          "Admin",
          userGroup
        )}
        {createProtectedRoute("/Ventas", Sales, "Sales", userGroup)}
        {createProtectedRoute(
          "/Ver-Productos",
          ViewProducts,
          "Sales",
          userGroup
        )}
        {createProtectedRoute("/Clientes", Customers, "Sales", userGroup)}
        {createProtectedRoute("/Productos", Products, "Warehouse", userGroup)}
        {createProtectedRoute(
          "/Proveedores",
          Suppliers,
          "Warehouse",
          userGroup
        )}
      </Routes>
    </div>
  );
}

export default App;
