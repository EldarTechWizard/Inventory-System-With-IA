import React, { useEffect, useState } from "react";
import "./sideBar.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { isAdmin, isSales, isWarehouse } from "../utils/groups";

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
  const navigate = useNavigate();
  const [group, setGroup] = useState("");

  const handleOnClick = () => {
    logout();
    navigate("/login");
  };

  const handleOnLoad = async () => {
    try {
      const token = `Bearer ${localStorage.getItem("access")}`;

      const response = await axios.get("http://127.0.0.1:8000/auth/users/me/", {
        headers: {
          Authorization: token,
        },
      });

      const { groups } = response.data;

      setGroup(groups[0]);
      localStorage.setItem("group", groups[0]);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    handleOnLoad();
  }, []);

  return (
    <div className="h-100 border-end px-3 bg-white">
      <h2 className="p-3">My Sidebar</h2>

      {isAdmin() ? <ListWithTittle tittle="Admin" /> : null}
      {isAdmin() || isSales() ? <ListWithTittle tittle="Sales" /> : null}
      {isAdmin() || isWarehouse() ? (
        <ListWithTittle tittle="Warehouse" />
      ) : null}

      <Button
        variant="primary"
        type="submit"
        className="w-100 mt-4"
        onClick={handleOnClick}
      >
        Logout
      </Button>
    </div>
  );
}

export default Sidebar;
