import React, { useState } from "react";
import { useNotifications } from "../context/notificationContext";
import { Badge, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { useLocation } from "react-router-dom";
import "./header.css";

function Header() {
  const { notifications, removeNotification } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const location = useLocation();
  const pathname =
    location.pathname === "/" ? "Main" : location.pathname.slice(1);

  return (
    <div className="d-flex p-3 header justify-content-between align-items-center">
      <h6>Pages / {pathname}</h6>
      <IconButton onClick={handleClick}>
        <Badge
          badgeContent={notifications.length > 0 ? notifications.length : null}
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
                  color: "white",
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
