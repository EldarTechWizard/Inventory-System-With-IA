import { jwtDecode } from "jwt-decode";

export const isLoggedIn = () => {
  const token = localStorage.getItem("access");
  if (!token) return false;

  const decoded = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Current time in seconds

  return decoded.exp > currentTime; // Check if token is expired
};
