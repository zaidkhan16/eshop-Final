const mongoose = require("mongoose");
require("dotenv").config({ path: "config/.env" });
const Product = require("./model/product");
const Shop = require("./model/shop");
const Event = require("./model/event");

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");

    // Clear existing data (optional)
    await Product.deleteMany({});
    await Shop.deleteMany({});
    await Event.deleteMany({});

    console.log("Creating Sample Shops...");
    const sampleShop = await Shop.create({
      name: "Apple Official Store",
      email: "apple@shop.com",
      password: "password123",
      description: "Official Apple Electronics & Accessories Store",
      address: "1 Infinite Loop, Cupertino, CA",
      phoneNumber: 18002752273,
      zipCode: 95014,
      avatar: {
        public_id: "avatars/apple",
        url: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png",
      },
    });

    const fashionShop = await Shop.create({
      name: "Fashion Hub",
      email: "fashion@shop.com",
      password: "password123",
      description: "Trending Footwear, Clothing, and Accessories",
      address: "5th Avenue, New York, NY",
      phoneNumber: 18005550199,
      zipCode: 10001,
      avatar: {
        public_id: "avatars/fashion",
        url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop",
      },
    });

    console.log("Creating Sample Products...");
    const productsData = [
      {
        name: "iPhone 15 Pro Max 256GB Natural Titanium",
        description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
        category: "Mobile & Tablets",
        tags: "apple, iphone, smartphone, mobile",
        originalPrice: 1199,
        discountPrice: 1099,
        stock: 25,
        sold_out: 14,
        ratings: 4.9,
        images: [
          {
            public_id: "prod/iphone15",
            url: "https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg",
          },
        ],
        shopId: sampleShop._id.toString(),
        shop: sampleShop,
        reviews: [
          {
            user: { name: "Alex Johnson" },
            rating: 5,
            comment: "Increible performance and camera quality! Titanium finish feels premium.",
            createdAt: new Date(),
          },
        ],
      },
      {
        name: "MacBook Pro 16-inch M3 Max 36GB RAM 1TB SSD",
        description: "The 16-inch MacBook Pro with M3 Max takes performance and speed to extraordinary levels. Exceptional battery life up to 22 hours and a stunning Liquid Retina XDR display.",
        category: "Computers & Laptop",
        tags: "apple, macbook, laptop, m3",
        originalPrice: 3499,
        discountPrice: 3299,
        stock: 12,
        sold_out: 8,
        ratings: 5.0,
        images: [
          {
            public_id: "prod/macbook16",
            url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
          },
        ],
        shopId: sampleShop._id.toString(),
        shop: sampleShop,
        reviews: [],
      },
      {
        name: "Sony WH-1000XM5 Wireless Noise Canceling Headphones",
        description: "Industry-leading noise canceling with two processors and 8 microphones for unprecedented sound quality and crystal-clear hands-free calling.",
        category: "Music & Gaming",
        tags: "sony, headphones, audio, wireless",
        originalPrice: 399,
        discountPrice: 329,
        stock: 40,
        sold_out: 22,
        ratings: 4.8,
        images: [
          {
            public_id: "prod/sonyheadphones",
            url: "https://www.startech.com.bd/image/cache/catalog/headphone/havit/h763d/h763d-02-500x500.jpg",
          },
        ],
        shopId: sampleShop._id.toString(),
        shop: sampleShop,
        reviews: [],
      },
      {
        name: "Nike Air Jordan 1 Retro High OG Sneaker",
        description: "The Air Jordan 1 Retro High OG combines premium leather construction with an iconic high-top design and Air-Sole cushioning.",
        category: "Shoes",
        tags: "nike, sneakers, shoes, jordan",
        originalPrice: 190,
        discountPrice: 159,
        stock: 30,
        sold_out: 18,
        ratings: 4.7,
        images: [
          {
            public_id: "prod/jordan1",
            url: "https://mirzacdns3.s3.ap-south-1.amazonaws.com/cache/catalog/RLV0015/2-800x800.jpg",
          },
        ],
        shopId: fashionShop._id.toString(),
        shop: fashionShop,
        reviews: [],
      },
    ];

    await Product.insertMany(productsData);

    console.log("Creating Sample Events...");
    const startDate = new Date();
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + 15);

    await Event.create({
      name: "Apple Super Sale - MacBook Pro M3 Max Mega Discount",
      description: "Limited time mega offer on the latest 16-inch M3 Max MacBook Pro! Grab yours with free shipping and extended 2-year warranty.",
      category: "Computers & Laptop",
      tags: "sale, macbook, apple, event",
      start_Date: startDate,
      Finish_Date: finishDate,
      status: "Running",
      originalPrice: 3499,
      discountPrice: 2999,
      stock: 10,
      sold_out: 3,
      images: [
        {
          public_id: "event/macbook",
          url: "https://www.istorebangladesh.com/images/thumbs/0000286_macbook-pro-m1_550.png",
        },
      ],
      shopId: sampleShop._id.toString(),
      shop: sampleShop,
    });

    console.log("Database Seeded Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedDatabase();
