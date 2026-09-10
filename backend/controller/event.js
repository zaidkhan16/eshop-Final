const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("cloudinary");

// GET create-event info route
router.get("/create-event", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Event creation API endpoint is active. Use HTTP POST with event details to create an event, or open /dashboard-create-event in your browser.",
  });
});

// create event
router.post(
  "/create-event",
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
            public_id: `events/${Date.now()}_${i}`,
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
          console.warn("Cloudinary upload warning for event image:", cloudErr?.message || cloudErr);
          return {
            public_id: `events/fallback_${Date.now()}_${i}`,
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
          public_id: "events/default",
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
        start_Date: req.body.start_Date,
        Finish_Date: req.body.Finish_Date,
      };

      const event = await Event.create(productData);

      res.status(201).json({
        success: true,
        event,
      });
    } catch (error) {
      console.error("Event creation error:", error);
      return next(new ErrorHandler(error.message || "Failed to create event", 400));
    }
  })
);

const sanitizeEvent = (evt) => {
  const e = evt.toObject ? evt.toObject() : { ...evt };
  if (e.images && Array.isArray(e.images)) {
    e.images = e.images.map((img) => ({
      ...img,
      url: img.url && img.url.includes("startech.com.bd")
        ? "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
        : img.url,
    }));
  }
  return e;
};

// get all events
router.get("/get-all-events", async (req, res, next) => {
  try {
    const rawEvents = await Event.find();
    const events = rawEvents.map(sanitizeEvent);
    res.status(201).json({
      success: true,
      events,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 400));
  }
});

// get all events of a shop
router.get(
  "/get-all-events/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find({ shopId: req.params.id });

      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return next(new ErrorHandler("Event is not found with this id", 404));
      }    

      if (event.images && Array.isArray(event.images)) {
        for (let i = 0; i < event.images.length; i++) {
          if (event.images[i]?.public_id) {
            await cloudinary.v2.uploader.destroy(
              event.images[i].public_id
            );
          }
        }
      }
    
      await Event.findByIdAndDelete(req.params.id);

      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

// all events --- for admin
router.get(
  "/admin-all-events",
  isAuthenticated,
  isAdmin("Admin"),
  catchAsyncErrors(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
