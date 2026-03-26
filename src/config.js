// config.js - Centralized API configuration
const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const API_BASE_URL = isLocal
  ? "http://localhost:5001"
  : process.env.REACT_APP_API_URL || "https://auth-backend-3-4m2m.onrender.com";

console.log("Current API Configuration:", {
  hostname: window.location.hostname,
  isLocal: isLocal,
  apiBase: API_BASE_URL,
});

export default API_BASE_URL;
