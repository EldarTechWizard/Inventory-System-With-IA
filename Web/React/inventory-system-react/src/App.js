import React from "react";
import Login from "./pages/login";
import Main from "./pages/main";
import { Route, Routes } from "react-router-dom";
import InventoryReport from "./pages/inventoryReport";
import SalesReport from "./pages/salesReport";
import Sales from "./pages/sales";
import ViewProducts from "./pages/viewProducts";
import Customers from "./pages/customers";
import Products from "./pages/products";
import Suppliers from "./pages/suppliers";
import { AuthProvider } from "./context/authContext";
import ProtectedComponent from "./components/protectedRoute";
import InventoryMovement from "./pages/inventoryMovement";
import MostSalesReport from "./pages/mostSalesResport";
import Expenses from "./pages/expenses";

function App() {
  return (
    <div className="App">
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
            <ProtectedComponent component={InventoryReport} roles={["Admin"]} />
          }
        />
        <Route
          path="/Reporte-Ventas"
          element={
            <ProtectedComponent component={SalesReport} roles={["Admin"]} />
          }
        />
        <Route
          path="/Reporte-Inventario"
          element={
            <ProtectedComponent component={InventoryReport} roles={["Admin"]} />
          }
        />
        <Route
          path="/Reporte-Mas-Vendidos"
          element={
            <ProtectedComponent component={MostSalesReport} roles={["Admin"]} />
          }
        />
        <Route
          path="/Ventas"
          element={
            <ProtectedComponent component={Sales} roles={["Admin", "Sales"]} />
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

        <Route
          path="/Movimientos-Inventario"
          element={
            <ProtectedComponent
              component={InventoryMovement}
              roles={["Admin", "Warehouse"]}
            />
          }
        />

        <Route
          path="/Expenses"
          element={
            <ProtectedComponent
              component={Expenses}
              roles={["Admin", "Warehouse"]}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
