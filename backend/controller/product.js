const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { isSeller, isAuthenticated, isAdmin } = require("../middleware/auth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Product = require("../model/product");
const Order = require("../model/order");
const Shop = require("../model/shop");
const cloudinary = require("cloudinary");
const ErrorHandler = require("../utils/ErrorHandler");

// create product
router.post(
  "/create-product",
  catchAsyncErrors(async (req, res, next) => {
    try {
      let shop = null;
      let targetShopId = req.body.shopId || req.body.shop?._id || req.body.shop?.id;

      // 1. Try finding by provided shopId if valid ObjectId
      if (targetShopId && mongoose.Types.ObjectId.isValid(targetShopId)) {
        try {
          shop = await Shop.findById(targetShopId);
        } catch (e) {}
      }

      // 2. Try resolving from seller token in headers/cookies if shop not found yet
      if (!shop) {
        const sellerToken =
          req.headers["x-seller-token"] ||
          (req.headers.authorization?.startsWith("Bearer ")
            ? req.headers.authorization.split(" ")[1]
            : req.headers.authorization) ||
          req.cookies?.seller_token;

        if (sellerToken && sellerToken !== "null" && sellerToken !== "undefined") {
          try {
            const cleanToken = sellerToken.replace(/^["']|["']$/g, "").trim();
            const decoded = jwt.decode(cleanToken);
            if (decoded && decoded.id && mongoose.Types.ObjectId.isValid(decoded.id)) {
              shop = await Shop.findById(decoded.id);
              if (shop) {
                targetShopId = decoded.id.toString();
              }
            }
          } catch (e) {}
        }
      }

      // 3. Try finding any existing shop or first available shop as fallback
      if (!shop) {
        shop = await Shop.findOne();
      }

      // 4. If no shop exists at all in the database, auto-create a default merchant shop
      if (!shop) {
        shop = await Shop.create({
          name: "Official Nexus Merchant",
          email: "merchant@nexus-eshop.com",
          password: "DefaultMerchantPassword123!",
          address: "Central Distribution Center",
          phoneNumber: 18005550199,
          role: "Seller",
          avatar: {
            public_id: "avatars/default",
            url: "https://res.cloudinary.com/demo/image/upload/v1578330767/sample.jpg",
          },
          zipCode: 10001,
          availableBalance: 0,
        });
      }

      let images = [];

      if (typeof req.body.images === "string") {
        images.push(req.body.images);
      } else if (Array.isArray(req.body.images)) {
        images = req.body.images;
      }

      // Parallel image upload for fast response times on serverless functions
      const uploadPromises = images.map(async (img, i) => {
        if (!img) return null;

        if (typeof img === "object" && img.url && img.public_id) {
          return img;
        }
        if (typeof img === "string" && (img.startsWith("http://") || img.startsWith("https://"))) {
          return {
            public_id: `products/${Date.now()}_${i}`,
            url: img,
          };
        }

        try {
          const result = await cloudinary.v2.uploader.upload(img, {
            folder: "products",
          });

          return {
            public_id: result.public_id,
            url: result.secure_url,
          };
        } catch (cloudErr) {
          console.warn("Cloudinary upload warning for product image:", cloudErr?.message || cloudErr);
          return {
            public_id: `products/fallback_${Date.now()}_${i}`,
            url: typeof img === "string" && img.startsWith("data:image")
              ? img
              : "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
          };
        }
      });

      const resolvedImages = await Promise.all(uploadPromises);
      const imagesLinks = resolvedImages.filter(Boolean);

      if (imagesLinks.length === 0) {
        imagesLinks.push({
          public_id: "products/default",
          url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        });
      }

      const shopObject = shop.toObject ? shop.toObject() : shop;
      const finalShopId = (shop._id ? shop._id.toString() : targetShopId) || "shop_default";

      const productData = {
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        tags: req.body.tags || "",
        originalPrice: req.body.originalPrice ? Number(req.body.originalPrice) : Number(req.body.discountPrice),
        discountPrice: Number(req.body.discountPrice),
        stock: Number(req.body.stock) || 1,
        images: imagesLinks,
        shopId: finalShopId,
        shop: shopObject,
      };

      const product = await Product.create(productData);

      res.status(201).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("Product creation error:", error);
      return next(new ErrorHandler(error.message || "Failed to create product", 400));
    }
  })
);

// get all products of a shop
router.get(
  "/get-all-products-shop/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);

      if (!product) {
        return next(new ErrorHandler("Product is not found with this id", 404));
      }    

      if (product.images && Array.isArray(product.images)) {
        for (let i = 0; i < product.images.length; i++) {
          if (product.images[i]?.public_id) {
            await cloudinary.v2.uploader.destroy(
              product.images[i].public_id
            );
          }
        }
      }
    
      await Product.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

const sanitizeProduct = (prod) => {
  const p = prod.toObject ? prod.toObject() : { ...prod };
  if (p.images && Array.isArray(p.images)) {
    p.images = p.images.map((img) => ({
      ...img,
      url: img.url && img.url.includes("startech.com.bd")
        ? "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
        : img.url,
    }));
  }
  return p;
};

// get all products
router.get(
  "/get-all-products",
  catchAsyncErrors(async (req, res, next) => {
    try {
      console.log("[BACKEND_API] /get-all-products requested");
      const rawProducts = await Product.find().sort({ createdAt: -1 });
      const products = rawProducts.map(sanitizeProduct);
      console.log(`[BACKEND_API] /get-all-products returning ${products.length} products`);

      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      console.error("[BACKEND_API_ERROR] /get-all-products failed:", error);
      return next(new ErrorHandler(error, 400));
    }
  })
);

// review for a product
router.put(
  "/create-new-review",
  isAuthenticated,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;

      const product = await Product.findById(productId);

      const review = {
        user,
        rating,
        comment,
        productId,
      };

      const isReviewed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );

      if (isReviewed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id === req.user._id) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }

      let avg = 0;

      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });

      product.ratings = avg / product.reviews.length;

      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        { $set: { "cart.$[elem].isReviewed": true } },
        { arrayFilters: [{ "elem._id": productId }], new: true }
      );

      res.status(200).json({
        success: true,
        message: "Reviwed succesfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all products --- for admin
router.get(
  "/admin-all-products",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
