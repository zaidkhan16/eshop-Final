const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const connectDatabase = require("./db/Database");
const cloudinary = require("cloudinary");
const cors = require("cors");

// config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}

// 1. CORS & Preflight Configuration (Standardized for Safari, Chrome, and Mobile)
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cookie",
    "x-auth-token",
    "x-seller-token",
    "Cache-Control",
    "Pragma",
    "Expires",
  ],
  exposedHeaders: [
    "Set-Cookie",
    "Authorization",
    "x-auth-token",
    "x-seller-token",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use((req, res, next) => {
  if (req.url.startsWith("/v2/")) {
    req.url = "/api" + req.url;
  }
  next();
});

// 2. connect db & cloudinary initialization for serverless compatibility
app.use(async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (err) {
    console.error("DB Connection Error:", err);
    next(err);
  }
});

if (process.env.CLOUDINARY_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : "",
    api_secret: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : "",
  });
}

app.use(express.json());
app.use(cookieParser());
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/", (req, res) => {
  res.send("Nexus Next-Gen Market Backend Server is running successfully!");
});

const getConfigDiagnostics = () => {
  const mongoose = require("mongoose");
  return {
    success: true,
    message: "Nexus Next-Gen Market Server Status",
    dbConnected: mongoose.connection.readyState === 1,
    dbReadyState: mongoose.connection.readyState,
    dbUrlConfigured: !!process.env.DB_URL,
    dbUrlPreview: process.env.DB_URL ? `${process.env.DB_URL.substring(0, 15)}...` : "DEFAULT_FALLBACK",
    jwtConfigured: !!process.env.JWT_SECRET_KEY,
    cloudinaryConfigured: !!process.env.CLOUDINARY_NAME,
    nodeEnv: process.env.NODE_ENV || "development",
  };
};

app.get("/config-check", (req, res) => res.status(200).json(getConfigDiagnostics()));
app.get("/api/v2/config-check", (req, res) => res.status(200).json(getConfigDiagnostics()));
app.use("/test", (req, res) => {
  res.send("Hello world!");
});

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// import routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const conversation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");

app.use("/api/v2/user", user);
app.use("/user", user);
app.use("/api/v2/conversation", conversation);
app.use("/conversation", conversation);
app.use("/api/v2/message", message);
app.use("/message", message);
app.use("/api/v2/order", order);
app.use("/order", order);
app.use("/api/v2/shop", shop);
app.use("/shop", shop);
app.use("/api/v2/product", product);
app.use("/product", product);
app.use("/api/v2/event", event);
app.use("/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/payment", payment);
app.use("/api/v2/withdraw", withdraw);
app.use("/withdraw", withdraw);

// Serve frontend static build if available
const path = require("path");
const fs = require("fs");
const frontendBuildPath = path.join(__dirname, "../frontend/build");

if (fs.existsSync(frontendBuildPath)) {
  app.use(express.static(frontendBuildPath));

  app.get("*", (req, res, next) => {
    // Only intercept non-API GET requests
    if (
      req.url.startsWith("/api/") ||
      req.url.startsWith("/user/") ||
      req.url.startsWith("/shop/") ||
      req.url.startsWith("/product/") ||
      req.url.startsWith("/event/") ||
      req.url.startsWith("/payment/") ||
      req.url.startsWith("/config-check")
    ) {
      return next();
    }
    const indexPath = path.join(frontendBuildPath, "index.html");
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Explicit 404 handler for unknown routes with guaranteed CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(404).json({
    success: false,
    message: `API Route Not Found: ${req.method} ${req.originalUrl || req.url}`,
  });
});

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
