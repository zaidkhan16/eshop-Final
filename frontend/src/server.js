import axios from "axios";

const getServerUrl = () => {
  if (typeof window !== "undefined") {
    // 1. If running in browser on localhost/127.0.0.1
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "::1"
    ) {
      return (
        process.env.REACT_APP_LOCAL_SERVER_URL ||
        "http://localhost:8000/api/v2"
      );
    }
  }

// 2. Custom environment variable override with legacy preview URL filter
  if (process.env.REACT_APP_SERVER_URL) {
    const customUrl = process.env.REACT_APP_SERVER_URL.replace(/\/$/, "");
    if (!customUrl.includes("9j4psxugm") && !customUrl.includes("eshop-final-7uu8-9j4")) {
      return customUrl;
    }
  }

  // 3. Active Vercel Backend Server API
  return "https://eshop-final-7uu8-da96bt9pw-zaidkhan16s-projects.vercel.app/api/v2";
};

const getBackendUrl = () => {
  if (typeof window !== "undefined") {
    // 1. If running in browser on localhost/127.0.0.1
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "::1"
    ) {
      return (
        process.env.REACT_APP_LOCAL_BACKEND_URL ||
        "http://localhost:8000/"
      );
    }
  }

  // 2. Custom environment variable override with legacy preview URL filter
  if (process.env.REACT_APP_BACKEND_URL) {
    const customUrl = process.env.REACT_APP_BACKEND_URL.replace(/\/$/, "");
    if (!customUrl.includes("9j4psxugm") && !customUrl.includes("eshop-final-7uu8-9j4")) {
      return customUrl + "/";
    }
  }

  // 3. Active Vercel Backend Server
  return "https://eshop-final-7uu8-da96bt9pw-zaidkhan16s-projects.vercel.app/";
};

export const server = getServerUrl();

export const backend_url = getBackendUrl();

console.log("[NEXUS_CONFIG] Configured API Server:", server);
console.log("[NEXUS_CONFIG] Configured Backend URL:", backend_url);

export const ENDPOINT =
  process.env.REACT_APP_SOCKET_SERVER_URL ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://marvelous-endurance-production.up.railway.app/");

const isValidToken = (t) => {
  return typeof t === "string" && t.trim() !== "" && t !== "null" && t !== "undefined";
};

// Configure global Axios Request Interceptor for Token Authorization & URL Rewriting
axios.interceptors.request.use(
  (config) => {
    // Automatically rewrite any legacy or frozen preview URLs to active backend
    if (
      config.url &&
      (config.url.includes("9j4psxugm") ||
        config.url.includes("eshop-final-7uu8-9j4") ||
        config.url.includes("eshop-final-7uu8-9j4psxugm-zaidkhan16sprojects"))
    ) {
      console.warn("[AXIOS] Rewriting legacy URL:", config.url);
      config.url = config.url.replace(
        /https:\/\/eshop-final-7uu8-9j4psxugm-zaidkhan16s-?projects\.vercel\.app/g,
        "https://eshop-final-7uu8-da96bt9pw-zaidkhan16s-projects.vercel.app"
      );
    }

    const token = localStorage.getItem("token");
    const sellerToken = localStorage.getItem("seller_token");

    if (isValidToken(token)) {
      const cleanToken = token.trim();
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("Authorization", `Bearer ${cleanToken}`);
        config.headers.set("x-auth-token", cleanToken);
      } else {
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${cleanToken}`;
        config.headers["x-auth-token"] = cleanToken;
      }
    } else {
      localStorage.removeItem("token");
    }

    if (isValidToken(sellerToken)) {
      const cleanSellerToken = sellerToken.trim();
      if (config.headers && typeof config.headers.set === "function") {
        config.headers.set("x-seller-token", cleanSellerToken);
      } else {
        config.headers = config.headers || {};
        config.headers["x-seller-token"] = cleanSellerToken;
      }
    } else {
      localStorage.removeItem("seller_token");
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