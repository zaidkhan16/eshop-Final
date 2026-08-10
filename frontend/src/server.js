export const server = process.env.REACT_APP_SERVER_URL || (process.env.NODE_ENV === "production" ? "/api/v2" : "http://localhost:8000/api/v2");

export const backend_url = process.env.REACT_APP_BACKEND_URL || (process.env.NODE_ENV === "production" ? "/" : "http://localhost:8000/");