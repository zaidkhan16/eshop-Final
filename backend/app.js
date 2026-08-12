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

// connect db & cloudinary initialization for serverless compatibility
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

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        origin.includes("vercel.app") ||
        origin.includes("localhost") ||
        (process.env.FRONTEND_URL && origin.includes(process.env.FRONTEND_URL))
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.get("/", (req, res) => {
  res.send("Nexus Store Backend Server is running successfully!");
});

const getConfigDiagnostics = () => {
  const mongoose = require("mongoose");
  return {
    success: true,
    message: "Nexus Store Server Status",
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

// it's for ErrorHandling
app.use(ErrorHandler);

module.exports = app;
