const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async(req, res, next) => {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
        if (req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else {
            token = req.headers.authorization;
        }
    }

    if (!token && req.headers["x-auth-token"]) {
        token = req.headers["x-auth-token"];
    }

    if (!token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY || "NEXUS_JWT_SECRET_KEY_PROD_2026";
        const decoded = jwt.verify(token, secretKey);
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            return next(new ErrorHandler("User doesn't exist", 401));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired session. Please login again.", 401));
    }
});


exports.isSeller = catchAsyncErrors(async(req, res, next) => {
    let seller_token = req.cookies?.seller_token;

    if (!seller_token && req.headers["x-seller-token"]) {
        seller_token = req.headers["x-seller-token"];
    }

    if (!seller_token && req.headers.authorization) {
        if (req.headers.authorization.startsWith("Bearer ")) {
            seller_token = req.headers.authorization.split(" ")[1];
        } else {
            seller_token = req.headers.authorization;
        }
    }

    if (!seller_token) {
        return next(new ErrorHandler("Please login to continue", 401));
    }

    try {
        const secretKey = process.env.JWT_SECRET_KEY || "NEXUS_JWT_SECRET_KEY_PROD_2026";
        const decoded = jwt.verify(seller_token, secretKey);
        req.seller = await Shop.findById(decoded.id);

        if (!req.seller) {
            return next(new ErrorHandler("Seller doesn't exist", 401));
        }

        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired seller session. Please login again.", 401));
    }
});


exports.isAdmin = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new ErrorHandler(`${req.user ? req.user.role : 'User'} can not access this resources!`, 403));
        }
        next();
    };
};