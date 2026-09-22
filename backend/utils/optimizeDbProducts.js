const mongoose = require("mongoose");
const connectDatabase = require("../db/Database");
const Product = require("../model/product");
const Event = require("../model/event");

const optimizeDatabase = async () => {
  try {
    console.log("Connecting to MongoDB for optimization...");
    await connectDatabase();

    // 1. Build Indexes
    console.log("Ensuring Product collection indexes...");
    await Product.createIndexes();
    console.log("Ensuring Event collection indexes...");
    await Event.createIndexes();

    // 2. Find and fix products with base64 image strings
    const base64Products = await Product.find({
      "images.url": { $regex: "^data:image" },
    });

    console.log(`Found ${base64Products.length} products with base64 images.`);

    for (const prod of base64Products) {
      let replacementUrl = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80";

      const nameLower = (prod.name || "").toLowerCase();
      if (nameLower.includes("sunscreen") || nameLower.includes("watermelon")) {
        replacementUrl = "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80";
      } else if (nameLower.includes("body oil") || nameLower.includes("vaseline") || nameLower.includes("cocoa")) {
        replacementUrl = "https://images.unsplash.com/photo-1608248597359-5f212269a84a?auto=format&fit=crop&w=800&q=80";
      }

      prod.images = prod.images.map((img, idx) => {
        if (img.url && img.url.startsWith("data:image")) {
          return {
            public_id: `products/optimized_${prod._id}_${idx}`,
            url: replacementUrl,
          };
        }
        return img;
      });

      await prod.save({ validateBeforeSave: false });
      console.log(`Cleaned base64 images for product: ${prod.name} (${prod._id})`);
    }

    // 3. Verify total collection size and index list
    const productIndexes = await Product.collection.getIndexes();
    console.log("Current Product Indexes:", Object.keys(productIndexes));

    const allProds = await Product.find({}).lean();
    let totalPayloadSize = JSON.stringify(allProds).length;
    console.log(`Optimized Total Products: ${allProds.length}`);
    console.log(`Optimized Raw JSON Payload Size: ${(totalPayloadSize / 1024).toFixed(2)} KB`);

    console.log("Database optimization completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Optimization failed:", err);
    process.exit(1);
  }
};

optimizeDatabase();
