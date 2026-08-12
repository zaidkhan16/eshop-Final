export const server =
  process.env.REACT_APP_SERVER_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://eshop-final-7uu8.vercel.app/api/v2"
    : "http://localhost:8000/api/v2");

export const backend_url =
  process.env.REACT_APP_BACKEND_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://eshop-final-7uu8.vercel.app/"
    : "http://localhost:8000/");

export const ENDPOINT =
  process.env.REACT_APP_SOCKET_SERVER_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://marvelous-endurance-production.up.railway.app/"
    : "http://localhost:4000/");