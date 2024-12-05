import React, { useContext } from "react";
import "./sideBar.css";
import AuthContext from "../context/authContext";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const groups = [
  {
    groupName: "Admin",
    fields: [
      { "Reporte de inventario": "Reporte-Inventario" },
      { "Reporte de ventas": "Reporte-Ventas" },
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
    fields: [{ Productos: "Productos" }, { Proveedores: "Proveedores" }],
  },
];

function ListWithTittle({ tittle }) {
  return (
    <div>
      <h5>{tittle}</h5>
      <ul>
        {groups
          .find((item) => item.groupName === tittle)
          .fields.map((item, index) =>
            Object.entries(item).map(([label, path]) => (
              <li key={path}>
                <Link to={`/${path}`}>{label}</Link>
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
    <div className="h-100 border-end px-3 bg-white">
      <h2 className="p-3">My Sidebar</h2>

      {group.includes("Admin") ? <ListWithTittle tittle="Admin" /> : null}
      {group.includes("Admin") || group.includes("Sales") ? (
        <ListWithTittle tittle="Sales" />
      ) : null}
      {group.includes("Admin") || group.includes("Warehouse") ? (
        <ListWithTittle tittle="Warehouse" />
      ) : null}

      <Button
        variant="primary"
        type="submit"
        className="w-100 mt-4"
        onClick={logoutUser}
      >
        Logout
      </Button>
    </div>
  );
}

export default Sidebar;
