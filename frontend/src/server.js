import axios from "axios";

export const server =
  process.env.REACT_APP_SERVER_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://eshop-final-7uu8-9j4psxugm-zaidkhan16s-projects.vercel.app/api/v2"
    : "http://localhost:8000/api/v2");

export const backend_url =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://eshop-final-7uu8-9j4psxugm-zaidkhan16s-projects.vercel.app/"
    : "http://localhost:8000/");

export const ENDPOINT =
  process.env.REACT_APP_SOCKET_SERVER_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://marvelous-endurance-production.up.railway.app/"
    : "http://localhost:4000/");

// Configure global Axios Request Interceptor for Token Authorization across origins (Vercel)
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const sellerToken = localStorage.getItem("seller_token");

    if (token && !config.headers["Authorization"]) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (sellerToken && !config.headers["x-seller-token"]) {
      config.headers["x-seller-token"] = sellerToken;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);