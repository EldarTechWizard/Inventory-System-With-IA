import React, { useContext } from "react";
import "./sideBar.css";
import AuthContext from "../context/authContext";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import DescriptionIcon from "@mui/icons-material/Description";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import PersonIcon from "@mui/icons-material/Person";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventNoteIcon from "@mui/icons-material/EventNote";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDining";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const groups = [
  {
    groupName: "Admin",
    fields: [
      { "Reporte de inventario": "Reporte-Inventario" },
      { "Reporte de ventas": "Reporte-Ventas" },
      { "Reporte de articulos mas vendidos": "Reporte-Mas-Vendidos" },
    ],
  },
  {
    groupName: "Sales",
    fields: [
      { "Ver productos": "Ver-Productos" },
      { Ventas: "Ventas" },
      { Clientes: "Clientes" },
    ],
  },
  {
    groupName: "Warehouse",
    fields: [
      { Productos: "Productos" },
      { Proveedores: "Proveedores" },
      { "Movimientos de inventario": "Movimientos-Inventario" },
      { Gastos: "Expenses" },
    ],
  },
];

const icons = [
  { "Reporte-Inventario": <DescriptionIcon /> },
  { "Reporte-Ventas": <DescriptionIcon /> },
  { "Reporte-Mas-Vendidos": <DescriptionIcon /> },
  { "Ver-Productos": <EventNoteIcon /> },
  { Ventas: <ShoppingCartIcon /> },
  { Clientes: <PersonIcon /> },
  { Productos: <TakeoutDiningIcon /> },
  { Proveedores: <LocalShippingIcon /> },
  { "Movimientos-Inventario": <InventoryIcon /> },
  { Expenses: <MonetizationOnIcon /> },
];

const IconDisplay = ({ prop }) => {
  const icon = icons.find((item) => item.hasOwnProperty(prop));
  const iconComponent = Object.values(icon)[0];
  return <>{iconComponent}</>;
};

function ListWithTittle({ tittle, label }) {
  return (
    <div className="px-2">
      <h5 className="group-title">{label}</h5>
      <ul className="list">
        {groups
          .find((item) => item.groupName === tittle)
          .fields.map((item, index) =>
            Object.entries(item).map(([label, path]) => (
              <li key={path} className="item">
                <Link to={`/${path}`}>
                  <div className="d-flex align-items-center links ">
                    <IconDisplay prop={path} />
                    <h6>{label}</h6>
                  </div>
                </Link>
              </li>
            ))
          )}
      </ul>
    </div>
  );
}

function Sidebar() {
  let { logoutUser, group } = useContext(AuthContext);

  return (
    <div className="sidebar border-end px-3 bg-white">
      <div className="py-2 tittle-sidebar">
        <h2> SITE CONTROL</h2>
        <img src={logo} alt="Principal" className="main-image" width={60} />
      </div>

      {group.includes("Admin") ? (
        <ListWithTittle tittle="Admin" label="Administrador" />
      ) : null}
      {group.includes("Admin") || group.includes("Sales") ? (
        <ListWithTittle tittle="Sales" label="Ventas" />
      ) : null}
      {group.includes("Admin") || group.includes("Warehouse") ? (
        <ListWithTittle tittle="Warehouse" label="Almacen" />
      ) : null}

      <Button
        variant="primary"
        type="submit"
        className="w-100 mt-2"
        onClick={logoutUser}
      >
        Logout
      </Button>
    </div>
  );
}

export default Sidebar;
