const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id);

    if (!req.user) {
        return next(new ErrorHandler("User doesn't exist", 401));
    }

    next();
});


exports.isSeller = catchAsyncErrors(async(req,res,next) => {
    const {seller_token} = req.cookies;
    if(!seller_token){
        return next(new ErrorHandler("Please login to continue", 401));
    }

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);

    req.seller = await Shop.findById(decoded.id);

    if (!req.seller) {
        return next(new ErrorHandler("Seller doesn't exist", 401));
    }

    next();
});


exports.isAdmin = (...roles) => {
    return (req,res,next) => {
        if(!req.user || !roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user ? req.user.role : 'User'} can not access this resources!`, 403))
        };
        next();
    }
}