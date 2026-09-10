const express = require("express");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const Event = require("../model/event");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller, isAdmin, isAuthenticated } = require("../middleware/auth");
const router = express.Router();
const cloudinary = require("cloudinary");

// create event
router.post(
  "/create-event",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      if (!shopId) {
        return next(new ErrorHandler("Shop ID is required. Please ensure you are logged into your shop account.", 400));
      }

      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop not found with this ID!", 400));
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

      const productData = { ...req.body };
      productData.images = imagesLinks;
      productData.shop = shop;

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
