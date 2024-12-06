import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  let [user, setUser] = useState(() =>
    localStorage.getItem("authTokens")
      ? jwtDecode(localStorage.getItem("authTokens"))
      : null
  );
  let [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );

  let [refreshToken, setRefreshToken] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")).refresh
      : null
  );

  let [group, setGroup] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")).groups
      : null
  );

  let [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  let loginUser = async (e) => {
    e.preventDefault();

    const response = await axios.post(
      "http://127.0.0.1:8000/auth/jwt/create/",
      {
        username: e.target.username.value,
        password: e.target.password.value,
      }
    );

    let data = await response.data;

    if (data && response.statusText === "OK") {
      localStorage.setItem("authTokens", JSON.stringify(data));
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      setGroup(data.groups);
      setRefreshToken(data.refresh);
      navigate("/");
    }
  };

  let logoutUser = () => {
    // e.preventDefault()
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/login");
  };

  const updateToken = async () => {
    const response = await fetch("http://127.0.0.1:8000/auth/jwt/refresh/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });

    const data = await response.json();

    data.groups = group;
    data.refresh = refreshToken;

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    group: group,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    const REFRESH_INTERVAL = 1000 * 60 * 4; // 4 minutes
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
