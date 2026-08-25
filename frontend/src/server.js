import axios from "axios";

const getProdServer = () => {
  if (process.env.REACT_APP_SERVER_URL) return process.env.REACT_APP_SERVER_URL;
  if (typeof window !== "undefined" && window.location.origin) {
    return `${window.location.origin}/api/v2`;
  }
  return "https://eshop-final-7uu8-9j4psxugm-zaidkhan16s-projects.vercel.app/api/v2";
};

const getProdBackend = () => {
  if (process.env.REACT_APP_BACKEND_URL) return process.env.REACT_APP_BACKEND_URL;
  if (typeof window !== "undefined" && window.location.origin) {
    return `${window.location.origin}/`;
  }
  return "https://eshop-final-7uu8-9j4psxugm-zaidkhan16s-projects.vercel.app/";
};

export const server =
  process.env.NODE_ENV === "production"
    ? getProdServer()
    : "http://localhost:8000/api/v2";

export const backend_url =
  process.env.NODE_ENV === "production"
    ? getProdBackend()
    : "http://localhost:8000/";

export const ENDPOINT =
  process.env.REACT_APP_SOCKET_SERVER_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://marvelous-endurance-production.up.railway.app/"
    : "http://localhost:4000/");

// Configure global Axios Request Interceptor for Token Authorization
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const sellerToken = localStorage.getItem("seller_token");

    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["x-auth-token"] = token;
    }
    if (sellerToken) {
      config.headers = config.headers || {};
      config.headers["x-seller-token"] = sellerToken;
    }
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// Configure global Axios Response Interceptor to auto-clear invalid/expired tokens
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      const url = error.config?.url || "";
      const msg = (error.response.data?.message || "").toLowerCase();
      if (
        url.includes("/user/getuser") ||
        msg.includes("jwt") ||
        msg.includes("token") ||
        msg.includes("expired") ||
        msg.includes("session")
      ) {
        localStorage.removeItem("token");
      }
      if (
        url.includes("/shop/getSeller") ||
        (msg.includes("seller") && (msg.includes("token") || msg.includes("session")))
      ) {
        localStorage.removeItem("seller_token");
      }
    }
    return Promise.reject(error);
  }
);