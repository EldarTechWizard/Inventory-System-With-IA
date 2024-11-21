import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/"; // Replace with your base API URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Adjust timeout as needed
});

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("authTokens")).access;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Unauthorized - log out user, for instance
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export const fetchData = async (endpoint, params = {}) => {
  try {
    const response = await api.get(endpoint, { params });

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
};

export const updateData = async (endpoint, data) => {
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
};

export default api;
