const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");

  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server Error";

  console.error("API Error:", err);

  // wrong mongodb id error
  if (err.name === "CastError") {
    const message = `Resources not found with this id.. Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate key ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    const message = `Your session token is invalid, please log in again`;
    err = new ErrorHandler(message, 401);
  }

  // jwt expired
  if (err.name === "TokenExpiredError") {
    const message = `Your session has expired, please log in again`;
    err = new ErrorHandler(message, 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};
