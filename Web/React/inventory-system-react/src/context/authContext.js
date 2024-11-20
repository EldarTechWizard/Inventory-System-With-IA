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

  let [group, setGroup] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens")).groups
      : null
  );

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
      navigate("/");
    } else {
      alert(
        "Check login credentials :Something went wrong while logging in the user!"
      );
    }
  };

  let logoutUser = () => {
    // e.preventDefault()
    localStorage.removeItem("authTokens");
    setAuthTokens(null);
    setUser(null);
    console.log("authTokens", localStorage.getItem("authTokens"));
    navigate("/login");
  };

  let contextData = {
    user: user,
    authTokens: authTokens,
    group: group,
    loginUser: loginUser,
    logoutUser: logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
};
