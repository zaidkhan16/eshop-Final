const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
require("dotenv").config({ path: "config/.env" });

const Product = require("./model/product");
const Shop = require("./model/shop");

// Configure Cloudinary
if (process.env.CLOUDINARY_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME.trim(),
    api_key: process.env.CLOUDINARY_API_KEY ? process.env.CLOUDINARY_API_KEY.trim() : "",
    api_secret: process.env.CLOUDINARY_API_SECRET ? process.env.CLOUDINARY_API_SECRET.trim() : "",
  });
}

const photosDir = path.join(__dirname, "../Add product Photos");

const categoryMap = {
  Accesories: "Accessories",
  Clothes: "Clothes",
  Mobiles: "Mobile & Tablets",
  cosmetics: "Cosmetics",
  laptops: "Computers & Laptop",
  shoes: "Shoes",
};

const sampleTitles = {
  Accessories: [
    "Premium Wireless Earbuds with ANC",
    "Smart Fitness Watch with Heart Rate Monitor",
    "Leather Crossbody Travel Bag",
    "Designer UV Protection Sunglasses",
    "High-Fast Charging Power Bank 20000mAh",
    "Magnetic Wireless Charger Dock",
    "Ergonomic Gaming Mouse",
    "Mechanical RGB Backlit Keyboard",
    "Waterproof Bluetooth Speaker 20W",
  ],
  Clothes: [
    "Men's Casual Slim Fit Cotton Shirt",
    "Women's Vintage Floral Print Summer Dress",
    "Unisex Oversized Graphic Hoodie",
    "Classic Denim Jacket Dark Wash",
    "Athletic Workout Training Shorts",
    "Winter Fleece Thermal Parka Coat",
  ],
  "Mobile & Tablets": [
    "Ultra Pro Smartphone 5G 256GB",
    "Flagship Dual SIM Mobile 128GB OLED",
    "Foldable Display Smartphone 512GB",
    "Slim Android Tablet 10.5-inch 64GB",
    "Gaming Phone 144Hz AMOLED Display",
    "Budget 4G Smartphone Long Battery Life",
  ],
  Cosmetics: [
    "Hydrating Facial Serum with Hyaluronic Acid",
    "Matte Liquid Lipstick Long Lasting",
    "Nourishing Night Cream & Moisturizer",
    "Organic Rosewater Facial Toner Spray",
    "Full Coverage Liquid Foundation 30ml",
    "Volumizing Waterproof Mascara Black",
    "Natural Vitamin C Brightening Cleanser",
    "Gentle Exfoliating Face Scrub 100g",
  ],
  "Computers & Laptop": [
    "Ultra-Thin Ultrabook 14-inch Intel i7 16GB",
    "High Performance Gaming Laptop RTX 4060",
    "Sleek Workstation Laptop 15.6-inch 512GB SSD",
    "Portable Touchscreen 2-in-1 Convertible Laptop",
    "Business Notebook AMD Ryzen 7 1TB SSD",
  ],
  Shoes: [
    "Air Cushion Running Sneakers Lightweight",
    "Classic Casual Canvas Low Top Shoes",
    "Genuine Leather Formal Dress Shoes",
    "Waterproof Hiking & Outdoor Trail Boots",
    "Breathable Sport Gym Trainers",
    "Slip-On Mesh Comfort Walking Shoes",
  ],
};

const seedPhotos = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");

    // Find or create sample shop
    let sampleShop = await Shop.findOne({});
    if (!sampleShop) {
      sampleShop = await Shop.create({
        name: "E-Shop Mega Store",
        email: "store@eshop.com",
        password: "password123",
        description: "Official E-Shop Premium Store",
        address: "100 Main Street",
        phoneNumber: 18005550199,
        zipCode: 10001,
        avatar: {
          public_id: "avatars/store",
          url: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
        },
      });
    }

    const subfolders = fs.readdirSync(photosDir);
    let totalAdded = 0;

    for (const folder of subfolders) {
      const folderPath = path.join(photosDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const categoryName = categoryMap[folder] || folder;
      const files = fs.readdirSync(folderPath).filter(file => !file.startsWith("."));
      const titles = sampleTitles[categoryName] || [];

      console.log(`Processing folder "${folder}" (${files.length} images)...`);

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(folderPath, file);
        if (fs.statSync(filePath).isDirectory()) continue;

        let imageUrl = "";
        let publicId = `products/${folder}_${i}_${Date.now()}`;

        // Attempt Cloudinary upload or fallback to Base64
        try {
          const uploadRes = await cloudinary.v2.uploader.upload(filePath, {
            folder: `eshop/${folder}`,
          });
          imageUrl = uploadRes.secure_url;
          publicId = uploadRes.public_id;
        } catch (uploadErr) {
          const fileData = fs.readFileSync(filePath);
          const ext = path.extname(file).replace(".", "") || "jpeg";
          imageUrl = `data:image/${ext};base64,${fileData.toString("base64")}`;
        }

        const title = titles[i % titles.length] || `${categoryName} Item #${i + 1}`;
        const basePrice = Math.floor(Math.random() * 200) + 20;
        const discountPrice = Math.floor(basePrice * 0.85);

        await Product.create({
          name: `${title} (Model ${i + 1})`,
          description: `High quality ${categoryName.toLowerCase()} product. Features premium materials, durable construction, and elegant design suitable for daily use. Includes manufacturer warranty.`,
          category: categoryName,
          tags: `${categoryName.toLowerCase()}, quality, popular, featured`,
          originalPrice: basePrice,
          discountPrice: discountPrice,
          stock: Math.floor(Math.random() * 50) + 10,
          sold_out: Math.floor(Math.random() * 20),
          ratings: (Math.random() * 1.5 + 3.5).toFixed(1),
          images: [
            {
              public_id: publicId,
              url: imageUrl,
            },
          ],
          shopId: sampleShop._id.toString(),
          shop: sampleShop,
          reviews: [
            {
              user: { name: "Verified Customer" },
              rating: 5,
              comment: "Great quality product! Super fast delivery.",
              createdAt: new Date(),
            },
          ],
        });

        totalAdded++;
      }
    }

    console.log(`Successfully added ${totalAdded} products from photos directory!`);
    process.exit(0);
  } catch (err) {
    console.error("Error seeding photos:", err);
    process.exit(1);
  }
};

seedPhotos();
