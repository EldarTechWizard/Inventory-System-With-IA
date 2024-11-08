export const groups = {
  Admin: [
    "Reporte-Inventario",
    "Reporte-Ventas",
    "Ver-Productos",
    "Ventas",
    "Clientes",
    "Productos",
    "Proveedores",
  ],
  Sales: ["Ver-Productos", "Ventas", "Clientes"],
  Warehouse: ["Productos", "Proveedores"],
};

export const isAdmin = () => {
  return localStorage.getItem("group") === "Admin";
};

export const isWarehouse = () => {
  return localStorage.getItem("group") === "Warehouse";
};

export const isSales = () => {
  return localStorage.getItem("group") === "Sales";
};
