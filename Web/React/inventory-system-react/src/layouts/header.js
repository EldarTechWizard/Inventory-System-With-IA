import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./header.css";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import {
  Menu,
  MenuItem,
  Button,
  Typography,
  Badge,
  IconButton,
} from "@mui/material";
import { fetchData } from "../hooks/apiManager";

function Header() {
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const [productsMinimumStock, setProductsMinimumStock] = useState([]);
  const [productsAproachingExpiry, setProductsAproachingExpiry] = useState([]);
  const [productsExpired, setProductsExpired] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Cerrar el menú de notificaciones
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Añadir una notificación
  const addNotification = (message, type, uniqueKey) => {
    setNotifications((prevNotifications) => {
      // Verificar si ya existe una notificación con el mismo uniqueKey
      const exists = prevNotifications.some(
        (notif) => notif.uniqueKey === uniqueKey
      );
      if (exists) return prevNotifications; // No añadir duplicados
      return [...prevNotifications, { message, type, uniqueKey }];
    });
  };

  const removeNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  const handleStockAlert = (product) => {
    addNotification(
      `El producto '${product.product_name}' tiene solo ${product.units_in_stock} unidades en inventario. Considere reabastecerlo pronto.`,
      "warning",
      `stock-${product.product_id}` // Identificador único basado en el producto
    );
  };

  const handleAproachingExpiryAlert = (product) => {
    addNotification(
      `El producto '${product.product_name}' caduca el ${product.expiration_date}. Considere priorizar su venta o consumo.`,
      "warning",
      `approaching-${product.product_id}` // Identificador único basado en el producto
    );
  };

  const handleExpiredAlert = (product) => {
    addNotification(
      `El producto '${product.product_name}' ha caducado el ${product.expiration_date}. Retíralo del inventario lo antes posible para evitar inconvenientes.`,
      "error",
      `expired-${product.product_id}` // Identificador único basado en el producto
    );
  };

  const getMinimumStockProducts = async () => {
    setProductsMinimumStock(await fetchData("/products/need-stock/"));
  };

  const getAproachingExpiredProducts = async () => {
    setProductsAproachingExpiry(
      await fetchData("/products/approaching-expiration/")
    );
  };

  const getExpiredProducts = async () => {
    setProductsExpired(await fetchData("/products/expired/"));
  };

  useEffect(() => {
    getMinimumStockProducts();
    getAproachingExpiredProducts();
    getExpiredProducts();
  }, []);

  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications.length]);

  useEffect(() => {
    if (productsMinimumStock) {
      productsMinimumStock.map((p) => handleStockAlert(p));
    }
  }, [productsMinimumStock]);

  useEffect(() => {
    if (productsAproachingExpiry) {
      productsAproachingExpiry.map((p) => handleAproachingExpiryAlert(p));
    }
  }, [productsAproachingExpiry]);

  useEffect(() => {
    if (productsExpired) {
      productsExpired.map((p) => handleExpiredAlert(p));
    }
  }, [productsExpired]);

  const location = useLocation();
  const pathname =
    location.pathname === "/" ? "Main" : location.pathname.slice(1);

  return (
    <div className="d-flex p-3 header justify-content-between align-items-center">
      <h6>Pages / {pathname}</h6>
      <IconButton onClick={handleClick}>
        <Badge
          badgeContent={notificationCount > 0 ? notificationCount : null}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography>No hay notificaciones</Typography>
          </MenuItem>
        ) : (
          notifications.map((notif, index) => (
            <MenuItem
              key={index}
              onClick={() => removeNotification(index)}
              className="w-100"
            >
              <div
                style={{
                  backgroundColor:
                    notif.type === "error" ? "#C34A43" : "#F99E1E",
                  color: notif.type === "error" ? "white" : "white",
                }}
                className="notification-item d-flex align-items-center"
              >
                <div className="icon-container">
                  {notif.type === "error" ? (
                    <ErrorIcon sx={{ fontSize: "3rem" }} />
                  ) : (
                    <InfoIcon sx={{ fontSize: "3rem" }} />
                  )}
                </div>
                <div className="d-flex flex-column ">
                  <h4 className="m-0">
                    {notif.type === "error" ? "Precaucion" : "Aviso"}
                  </h4>
                  <p className="m-0">{notif.message}</p>
                </div>
              </div>
            </MenuItem>
          ))
        )}
      </Menu>
    </div>
  );
}

export default Header;
