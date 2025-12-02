// axiosconfig.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar token automáticamente a cada request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // Usar "authToken" en lugar de "token"

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;
