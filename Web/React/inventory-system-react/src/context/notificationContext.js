import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchData } from "../hooks/apiManager";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [productsMinimumStock, setProductsMinimumStock] = useState([]);
  const [productsAproachingExpiry, setProductsAproachingExpiry] = useState([]);
  const [productsExpired, setProductsExpired] = useState([]);

  const addNotification = (message, type, uniqueKey) => {
    setNotifications((prevNotifications) => {
      const exists = prevNotifications.some(
        (notif) => notif.uniqueKey === uniqueKey
      );
      if (exists) return prevNotifications;
      return [...prevNotifications, { message, type, uniqueKey }];
    });
  };

  const removeNotification = (index) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((_, i) => i !== index)
    );
  };

  const reloadMinimumStockProducts = async () => {
    const products = await fetchData("/products/need-stock/");
    setProductsMinimumStock(products);

    const currentStockNotificationKeys = products.map(
      (p) => `stock-${p.product_id}`
    );

    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notif) =>
          !notif.uniqueKey.startsWith("stock-") ||
          currentStockNotificationKeys.includes(notif.uniqueKey)
      )
    );

    products.forEach((p) => handleStockAlert(p));
  };

  const reloadApproachingExpiryProducts = async () => {
    const products = await fetchData("/products/approaching-expiration/");
    setProductsAproachingExpiry(products);

    const currentApproachingNotificationKeys = products.map(
      (p) => `approaching-${p.product_id}`
    );

    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notif) =>
          !notif.uniqueKey.startsWith("approaching-") ||
          currentApproachingNotificationKeys.includes(notif.uniqueKey)
      )
    );

    products.forEach((p) => handleAproachingExpiryAlert(p));
  };

  const reloadExpiredProducts = async () => {
    const products = await fetchData("/products/expired/");
    setProductsExpired(products);

    const currentExpiredNotificationKeys = products.map(
      (p) => `expired-${p.product_id}`
    );

    setNotifications((prevNotifications) =>
      prevNotifications.filter(
        (notif) =>
          !notif.uniqueKey.startsWith("expired-") ||
          currentExpiredNotificationKeys.includes(notif.uniqueKey)
      )
    );

    products.forEach((p) => handleExpiredAlert(p));
  };

  const handleStockAlert = (product) => {
    addNotification(
      `El producto '${product.product_name}' tiene solo ${product.units_in_stock} unidades en inventario. Considere reabastecerlo pronto.`,
      "warning",
      `stock-${product.product_id}`
    );
  };

  const handleAproachingExpiryAlert = (product) => {
    addNotification(
      `El producto '${product.product_name}' caduca el ${product.expiration_date}. Considere priorizar su venta o consumo.`,
      "warning",
      `approaching-${product.product_id}`
    );
  };

  const handleExpiredAlert = (product) => {
    addNotification(
      `El producto '${product.product_name}' ha caducado el ${product.expiration_date}. Retíralo del inventario lo antes posible para evitar inconvenientes.`,
      "error",
      `expired-${product.product_id}`
    );
  };

  // Obtener datos de los productos
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
    if (productsMinimumStock) {
      productsMinimumStock.forEach((p) => handleStockAlert(p));
    }
  }, [productsMinimumStock]);

  useEffect(() => {
    if (productsAproachingExpiry) {
      productsAproachingExpiry.forEach((p) => handleAproachingExpiryAlert(p));
    }
  }, [productsAproachingExpiry]);

  useEffect(() => {
    if (productsExpired) {
      productsExpired.forEach((p) => handleExpiredAlert(p));
    }
  }, [productsExpired]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        reloadMinimumStockProducts,
        reloadApproachingExpiryProducts,
        reloadExpiredProducts,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook para usar el contexto
export const useNotifications = () => {
  return useContext(NotificationContext);
};
