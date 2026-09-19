const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: "config/.env" });

const User = require("./model/user");
const Shop = require("./model/shop");
const Product = require("./model/product");
const Event = require("./model/event");
const CoupounCode = require("./model/coupounCode");

// Amazon & Curated Top E-Commerce Products across diverse categories
const curatedAmazonProducts = [
  // Music and Gaming
  {
    name: "Sony PlayStation 5 Console (PS5 Slim Disc Edition)",
    description: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.",
    category: "Music and Gaming",
    tags: "sony, ps5, gaming console, playstation 5, video games",
    originalPrice: 499,
    discountPrice: 449,
    stock: 45,
    sold_out: 28,
    ratings: 4.9,
    images: [
      {
        public_id: "amazon/ps5_1",
        url: "https://m.media-amazon.com/images/I/51051FiD9UL._SL1000_.jpg",
      },
      {
        public_id: "amazon/ps5_2",
        url: "https://m.media-amazon.com/images/I/619BkvKW35L._SL1500_.jpg",
      },
    ],
    reviews: [
      {
        user: { name: "David Miller" },
        rating: 5,
        comment: "The graphics and loading speeds are truly next generation!",
        createdAt: new Date(),
      },
      {
        user: { name: "Sarah K." },
        rating: 5,
        comment: "Best gaming console I have ever owned. 10/10 recommended.",
        createdAt: new Date(),
      },
    ],
  },
  {
    name: "Xbox Series X 1TB Gaming Console",
    description: "The fastest, most powerful Xbox ever. Explore rich new worlds with 12 teraflops of raw graphic processing power, DirectX ray tracing, a custom SSD, and 4K gaming.",
    category: "Music and Gaming",
    tags: "microsoft, xbox, xbox series x, gaming, 4k",
    originalPrice: 499,
    discountPrice: 469,
    stock: 30,
    sold_out: 19,
    ratings: 4.8,
    images: [
      {
        public_id: "amazon/xbox_1",
        url: "https://m.media-amazon.com/images/I/61-jjE67uqL._SL1500_.jpg",
      },
    ],
    reviews: [
      {
        user: { name: "Chris Evans" },
        rating: 5,
        comment: "Game Pass on this console is unbeatable value.",
        createdAt: new Date(),
      },
    ],
  },
  {
    name: "Nintendo Switch - OLED Model White",
    description: "Featuring a vibrant 7-inch OLED screen, a wide adjustable stand, a dock with a wired LAN port, 64 GB of internal storage, and enhanced audio.",
    category: "Music and Gaming",
    tags: "nintendo, switch, oled, gaming, portable console",
    originalPrice: 349,
    discountPrice: 319,
    stock: 50,
    sold_out: 34,
    ratings: 4.9,
    images: [
      {
        public_id: "amazon/switch_1",
        url: "https://m.media-amazon.com/images/I/61-eaL+5ndL._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  {
    name: "Bose QuietComfort Ultra Wireless Noise Cancelling Headphones",
    description: "World-class noise cancellation, world-class comfort. Breakthrough spatialized audio for more immersive listening that makes your music feel real.",
    category: "Music and Gaming",
    tags: "bose, headphones, noise cancelling, bluetooth, audio",
    originalPrice: 429,
    discountPrice: 379,
    stock: 25,
    sold_out: 12,
    ratings: 4.8,
    images: [
      {
        public_id: "amazon/bose_qc_1",
        url: "https://m.media-amazon.com/images/I/51aXvjzcukL._SL1200_.jpg",
      },
    ],
    reviews: [],
  },
  {
    name: "Marshall Stanmore III Bluetooth Wireless Speaker",
    description: "Re-engineered for a wider soundstage, home-filling Marshall signature sound. Bluetooth 5.2 and next-generation connectivity.",
    category: "Music and Gaming",
    tags: "marshall, speaker, bluetooth, premium audio, rock",
    originalPrice: 379,
    discountPrice: 329,
    stock: 20,
    sold_out: 9,
    ratings: 4.7,
    images: [
      {
        public_id: "amazon/marshall_1",
        url: "https://m.media-amazon.com/images/I/71N7eW3QZpL._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  // Pet Care
  {
    name: "Purina Pro Plan High Protein Adult Dry Dog Food 35 lb",
    description: "Real salmon is the #1 ingredient. High protein formula fortified with guaranteed live probiotics for digestive and immune health.",
    category: "Pet Care",
    tags: "pet food, dog food, purina, high protein, salmon",
    originalPrice: 84,
    discountPrice: 69,
    stock: 60,
    sold_out: 42,
    ratings: 4.8,
    images: [
      {
        public_id: "amazon/purina_1",
        url: "https://m.media-amazon.com/images/I/81xUeM49bIL._SL1500_.jpg",
      },
    ],
    reviews: [
      {
        user: { name: "Emily Watson" },
        rating: 5,
        comment: "My golden retriever loves this food! Coat is shinier than ever.",
        createdAt: new Date(),
      },
    ],
  },
  {
    name: "Multi-Level Cat Tree Tower with Scratching Posts & Hammock",
    description: "Heavy-duty plush cat condo with natural sisal scratching posts, cozy hammock, and dangling play toys for indoor cats.",
    category: "Pet Care",
    tags: "cat tree, scratching post, pet furniture, cat tower",
    originalPrice: 119,
    discountPrice: 89,
    stock: 35,
    sold_out: 17,
    ratings: 4.7,
    images: [
      {
        public_id: "amazon/cattree_1",
        url: "https://m.media-amazon.com/images/I/81-0W6a9SUL._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  {
    name: "Automatic Pet Water Fountain 3.2L Ultra Quiet Stainless Steel",
    description: "Circulating filtration system with activated carbon filter. Continuous fresh filtered water for cats and small dogs.",
    category: "Pet Care",
    tags: "pet fountain, water dispenser, cat fountain, dog water",
    originalPrice: 45,
    discountPrice: 34,
    stock: 80,
    sold_out: 53,
    ratings: 4.6,
    images: [
      {
        public_id: "amazon/fountain_1",
        url: "https://m.media-amazon.com/images/I/71Y74t-JzGL._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  {
    name: "Orthopedic Memory Foam Dog Bed with Removable Washable Cover",
    description: "High-density orthopedic egg-crate foam relieves joint pain and arthritis in older pets. Ultra soft flannel fleece sleeping surface.",
    category: "Pet Care",
    tags: "dog bed, memory foam, orthopedic, pet comfort",
    originalPrice: 79,
    discountPrice: 59,
    stock: 40,
    sold_out: 22,
    ratings: 4.9,
    images: [
      {
        public_id: "amazon/dogbed_1",
        url: "https://m.media-amazon.com/images/I/71Y7g6L2dEL._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  // Computers and Laptops
  {
    name: "Apple MacBook Pro 16-inch M3 Max (36GB Unified Memory, 1TB SSD)",
    description: "Liquid Retina XDR display with extreme dynamic range. Up to 22 hours of battery life. Mind-blowing performance for demanding professional workflows.",
    category: "Computers and Laptops",
    tags: "apple, macbook pro, m3 max, laptop, pro laptop",
    originalPrice: 3499,
    discountPrice: 3199,
    stock: 20,
    sold_out: 11,
    ratings: 5.0,
    images: [
      {
        public_id: "amazon/macbook16_1",
        url: "https://m.media-amazon.com/images/I/618d5bS2lUL._SL1500_.jpg",
      },
    ],
    reviews: [
      {
        user: { name: "Robert Taylor" },
        rating: 5,
        comment: "Unmatched performance. Video rendering is instantaneous.",
        createdAt: new Date(),
      },
    ],
  },
  {
    name: "Dell XPS 15 9530 Laptop (13th Gen Intel i9-13900H, RTX 4070, 32GB RAM, 1TB SSD)",
    description: "Stunning 3.5K OLED touchscreen display, premium CNC aluminum chassis, carbon fiber palm rest, and powerhouse processing performance.",
    category: "Computers and Laptops",
    tags: "dell, xps 15, windows laptop, intel i9, rtx 4070",
    originalPrice: 2499,
    discountPrice: 2199,
    stock: 18,
    sold_out: 7,
    ratings: 4.7,
    images: [
      {
        public_id: "amazon/dell_xps_1",
        url: "https://m.media-amazon.com/images/I/71YmQdC5aAL._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  {
    name: "ASUS ROG Zephyrus G14 Gaming Laptop (AMD Ryzen 9, RTX 4060, 16GB DDR5, 512GB SSD)",
    description: "ROG Nebula 165Hz Display, ultra-compact 14-inch gaming powerhouse with liquid metal cooling and sleek anime matrix lid.",
    category: "Computers and Laptops",
    tags: "asus, rog zephyrus, gaming laptop, rtx 4060, ryzen 9",
    originalPrice: 1599,
    discountPrice: 1349,
    stock: 25,
    sold_out: 14,
    ratings: 4.8,
    images: [
      {
        public_id: "amazon/asus_rog_1",
        url: "https://m.media-amazon.com/images/I/71V2+H8q3NL._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  // Mobile and Tablets
  {
    name: "Apple iPhone 15 Pro Max 256GB Natural Titanium",
    description: "A17 Pro chip with 6-core GPU, 48MP main camera with 5x telephoto optical zoom, all-day battery life, USB-C connectivity with USB 3 speeds.",
    category: "Mobile and Tablets",
    tags: "apple, iphone 15 pro max, titanium, ios, 5g smartphone",
    originalPrice: 1199,
    discountPrice: 1089,
    stock: 50,
    sold_out: 39,
    ratings: 4.9,
    images: [
      {
        public_id: "amazon/iphone15pro_1",
        url: "https://m.media-amazon.com/images/I/81+GIkwqLIL._SL1500_.jpg",
      },
    ],
    reviews: [
      {
        user: { name: "Jessica Alba" },
        rating: 5,
        comment: "The camera is sensational, especially the 5x zoom!",
        createdAt: new Date(),
      },
    ],
  },
  {
    name: "Samsung Galaxy S24 Ultra 5G AI Smartphone (512GB Titanium Gray)",
    description: "Built-in S Pen, Snapdragon 8 Gen 3 for Galaxy, Galaxy AI features with live translate, Circle to Search, and 200MP camera system.",
    category: "Mobile and Tablets",
    tags: "samsung, galaxy s24 ultra, galaxy ai, android smartphone, 5g",
    originalPrice: 1419,
    discountPrice: 1249,
    stock: 35,
    sold_out: 21,
    ratings: 4.8,
    images: [
      {
        public_id: "amazon/s24ultra_1",
        url: "https://m.media-amazon.com/images/I/71Nw5-hNq+L._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  {
    name: "Apple iPad Pro 12.9-inch M2 Chip (Wi-Fi 256GB Space Gray)",
    description: "Brilliant 12.9-inch Liquid Retina XDR display with ProMotion, True Tone, and P3 wide color. Apple M2 chip with 8-core CPU and 10-core GPU.",
    category: "Mobile and Tablets",
    tags: "apple, ipad pro, m2, tablet, liquid retina xdr",
    originalPrice: 1099,
    discountPrice: 979,
    stock: 40,
    sold_out: 18,
    ratings: 4.9,
    images: [
      {
        public_id: "amazon/ipadpro_1",
        url: "https://m.media-amazon.com/images/I/81c+9BOQNWL._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  // Gifts & Home
  {
    name: "Dyson V15 Detect Cordless Vacuum Cleaner",
    description: "Engineered for deep cleaning anywhere. Laser reveals microscopic dust. Intelligently optimizes suction and run time based on floor type and dust volume.",
    category: "Gifts",
    tags: "dyson, vacuum, home appliances, cordless, smart clean",
    originalPrice: 749,
    discountPrice: 649,
    stock: 22,
    sold_out: 15,
    ratings: 4.8,
    images: [
      {
        public_id: "amazon/dyson_1",
        url: "https://m.media-amazon.com/images/I/61GqHq5Pz7L._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
  {
    name: "Nespresso VertuoPlus Coffee and Espresso Maker by De'Longhi",
    description: "Centrifusion extraction technology brews the perfect crema-topped single cup of coffee or authentic espresso at the touch of a button.",
    category: "Gifts",
    tags: "nespresso, coffee maker, espresso machine, kitchen, gift",
    originalPrice: 199,
    discountPrice: 149,
    stock: 45,
    sold_out: 29,
    ratings: 4.7,
    images: [
      {
        public_id: "amazon/nespresso_1",
        url: "https://m.media-amazon.com/images/I/61J6Qh0yv3L._SL1500_.jpg",
      },
    ],
    reviews: [],
  },
];

const categoryMapping = {
  beauty: "cosmetics and body care",
  fragrances: "cosmetics and body care",
  "skin-care": "cosmetics and body care",
  laptops: "Computers and Laptops",
  smartphones: "Mobile and Tablets",
  tablets: "Mobile and Tablets",
  "mobile-accessories": "Accesories",
  "sports-accessories": "Music and Gaming",
  sunglasses: "Accesories",
  "womens-bags": "Accesories",
  "womens-jewellery": "Accesories",
  "mens-watches": "Accesories",
  "womens-watches": "Accesories",
  "mens-shirts": "Cloths",
  tops: "Cloths",
  "womens-dresses": "Cloths",
  "mens-shoes": "Shoes",
  "womens-shoes": "Shoes",
  "home-decoration": "Gifts",
  furniture: "Gifts",
  groceries: "Others",
  "kitchen-accessories": "Others",
  motorcycle: "Others",
  vehicle: "Others",
};

async function seedData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB successfully!");

    const targetEmail = "pathanzaidkhan99@gmail.com";
    const targetPassword = "Zaid@123";

    // 1. Ensure User account exists and password is encrypted as Zaid@123
    let user = await User.findOne({ email: targetEmail });

    if (!user) {
      console.log(`Creating user account for ${targetEmail}...`);
      user = await User.create({
        name: "Pathan Zaid",
        email: targetEmail,
        password: targetPassword,
        phoneNumber: 9773059910,
        role: "user",
        avatar: {
          public_id: "avatars/zaid",
          url: "https://res.cloudinary.com/demo/image/upload/v1578330767/sample.jpg",
        },
        addresses: [
          {
            country: "IN",
            city: "Ahmedabad",
            address1: "B-202 SRP Camp, Krishnanagar",
            address2: "Near St Stand",
            zipCode: 382345,
            addressType: "Home",
          },
        ],
      });
      console.log("User created successfully!");
    } else {
      console.log(`Updating password and profile for user ${targetEmail}...`);
      user.password = targetPassword;
      await user.save();
      console.log("User password updated to Zaid@123!");
    }

    // 2. Ensure Shop (Seller) account exists and password is encrypted as Zaid@123
    let shop = await Shop.findOne({ email: targetEmail });
    if (!shop) {
      console.log(`Creating seller shop account for ${targetEmail}...`);
      shop = await Shop.create({
        name: "Zaid Prime Store",
        email: targetEmail,
        password: targetPassword,
        description: "Official Prime Electronics, Fashion & Accessories Store by Pathan Zaid.",
        address: "B-202 SRP Camp, Krishnanagar, Ahmedabad, Gujarat",
        phoneNumber: 9773059910,
        zipCode: 382345,
        role: "Seller",
        avatar: {
          public_id: "avatars/zaid_shop",
          url: "https://res.cloudinary.com/demo/image/upload/v1578330767/sample.jpg",
        },
        availableBalance: 15400,
      });
      console.log("Seller Shop created successfully!");
    } else {
      console.log(`Updating password for seller shop ${targetEmail}...`);
      shop.password = targetPassword;
      shop.name = shop.name || "Zaid Prime Store";
      shop.description = "Official Prime Electronics, Fashion & Accessories Store by Pathan Zaid.";
      shop.address = "B-202 SRP Camp, Krishnanagar, Ahmedabad, Gujarat";
      shop.phoneNumber = 9773059910;
      shop.zipCode = 382345;
      await shop.save();
      console.log("Seller shop password updated to Zaid@123!");
    }

    // 3. Clear old products for this seller (or prepare fresh insert)
    const deletedCount = await Product.deleteMany({
      $or: [
        { shopId: shop._id.toString() },
        { "shop.email": targetEmail },
        { "shop._id": shop._id },
      ],
    });
    console.log(`Cleared ${deletedCount.deletedCount} previous products for ${targetEmail}`);

    // 4. Fetch 190+ products from DummyJSON API
    console.log("Fetching live product dataset from DummyJSON API...");
    const dummyRes = await fetch("https://dummyjson.com/products?limit=0");
    const dummyData = await dummyRes.json();
    console.log(`Fetched ${dummyData.products?.length || 0} products from DummyJSON!`);

    const productsToInsert = [];

    // Transform DummyJSON items
    if (dummyData.products && Array.isArray(dummyData.products)) {
      for (const item of dummyData.products) {
        const mappedCat = categoryMapping[item.category] || "Others";
        
        // Build image array
        const images = [];
        if (item.images && Array.isArray(item.images) && item.images.length > 0) {
          item.images.forEach((imgUrl, idx) => {
            if (imgUrl && typeof imgUrl === "string" && imgUrl.startsWith("http")) {
              images.push({
                public_id: `dummy_${item.id}_${idx}`,
                url: imgUrl,
              });
            }
          });
        }
        if (images.length === 0 && item.thumbnail) {
          images.push({
            public_id: `dummy_${item.id}_thumb`,
            url: item.thumbnail,
          });
        }
        if (images.length === 0) {
          images.push({
            public_id: `dummy_${item.id}_default`,
            url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop",
          });
        }

        const originalPrice = Math.round(
          item.price * (1 + (item.discountPercentage ? item.discountPercentage / 100 : 0.15))
        );
        const discountPrice = Math.round(item.price);

        // Reviews
        const reviews = [];
        if (item.reviews && Array.isArray(item.reviews)) {
          item.reviews.forEach((r) => {
            reviews.push({
              user: { name: r.reviewerName || "Verified Buyer" },
              rating: r.rating || 5,
              comment: r.comment || "Great product, fast shipping!",
              createdAt: r.date ? new Date(r.date) : new Date(),
            });
          });
        }

        const tags = Array.isArray(item.tags)
          ? item.tags.join(", ")
          : `${item.category}, ${mappedCat.toLowerCase()}, deal`;

        productsToInsert.push({
          name: item.title,
          description: item.description,
          category: mappedCat,
          tags: tags,
          originalPrice: originalPrice > discountPrice ? originalPrice : discountPrice + 10,
          discountPrice: discountPrice,
          stock: item.stock || Math.floor(Math.random() * 50) + 10,
          sold_out: Math.floor(Math.random() * 30),
          ratings: item.rating ? Number(item.rating.toFixed(1)) : 4.5,
          images: images,
          reviews: reviews,
          shopId: shop._id.toString(),
          shop: {
            _id: shop._id,
            name: shop.name,
            email: shop.email,
            address: shop.address,
            phoneNumber: shop.phoneNumber,
            avatar: shop.avatar,
            role: shop.role,
          },
          createdAt: new Date(),
        });
      }
    }

    // 5. Add Curated Amazon Top Products
    for (const prod of curatedAmazonProducts) {
      productsToInsert.push({
        ...prod,
        shopId: shop._id.toString(),
        shop: {
          _id: shop._id,
          name: shop.name,
          email: shop.email,
          address: shop.address,
          phoneNumber: shop.phoneNumber,
          avatar: shop.avatar,
          role: shop.role,
        },
        createdAt: new Date(),
      });
    }

    console.log(`Inserting ${productsToInsert.length} total products into database under seller ${targetEmail}...`);
    const inserted = await Product.insertMany(productsToInsert);
    console.log(`SUCCESS! Inserted ${inserted.length} products into MongoDB for seller ${targetEmail}!`);

    // 6. Seed Events for Zaid
    await Event.deleteMany({
      $or: [{ shopId: shop._id.toString() }, { "shop.email": targetEmail }],
    });

    const startDate = new Date();
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + 30);

    const sampleEvents = [
      {
        name: "PlayStation 5 Mega Launch Festival - Flat $50 OFF",
        description: "Special limited-time launch festival on Sony PS5 Slim Disc Edition! Includes exclusive bundled games and free rapid shipping.",
        category: "Music and Gaming",
        tags: "sale, ps5, sony, gaming, festival",
        start_Date: startDate,
        Finish_Date: finishDate,
        status: "Running",
        originalPrice: 499,
        discountPrice: 449,
        stock: 30,
        sold_out: 12,
        images: [
          {
            public_id: "event/ps5",
            url: "https://m.media-amazon.com/images/I/51051FiD9UL._SL1000_.jpg",
          },
        ],
        shopId: shop._id.toString(),
        shop: {
          _id: shop._id,
          name: shop.name,
          email: shop.email,
          address: shop.address,
          phoneNumber: shop.phoneNumber,
          avatar: shop.avatar,
          role: shop.role,
        },
      },
      {
        name: "Apple MacBook Pro M3 Max Pro Designer Event",
        description: "Exclusive creator event discounts on high-performance M3 Max 16-inch laptops. Level up your productivity today.",
        category: "Computers and Laptops",
        tags: "apple, macbook, sale, event, creator",
        start_Date: startDate,
        Finish_Date: finishDate,
        status: "Running",
        originalPrice: 3499,
        discountPrice: 3099,
        stock: 15,
        sold_out: 5,
        images: [
          {
            public_id: "event/macbook",
            url: "https://m.media-amazon.com/images/I/618d5bS2lUL._SL1500_.jpg",
          },
        ],
        shopId: shop._id.toString(),
        shop: {
          _id: shop._id,
          name: shop.name,
          email: shop.email,
          address: shop.address,
          phoneNumber: shop.phoneNumber,
          avatar: shop.avatar,
          role: shop.role,
        },
      },
    ];

    await Event.insertMany(sampleEvents);
    console.log(`Created ${sampleEvents.length} promotional events for ${targetEmail}!`);

    // 7. Seed Discount Coupons
    await CoupounCode.deleteMany({ shopId: shop._id.toString() });
    const sampleCoupons = [
      {
        name: "ZAIDPRIME10",
        value: 10,
        minAmount: 50,
        maxAmount: 500,
        shopId: shop._id.toString(),
      },
      {
        name: "ZAIDVIP20",
        value: 20,
        minAmount: 150,
        maxAmount: 1000,
        shopId: shop._id.toString(),
      },
    ];
    await CoupounCode.insertMany(sampleCoupons);
    console.log(`Created ${sampleCoupons.length} coupon codes for ${targetEmail}!`);

    // 8. Category breakdown
    const categoryCounts = {};
    for (const p of productsToInsert) {
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
    }
    console.log("\n--- Category Breakdown ---");
    console.table(categoryCounts);

    // 7. Verify login credentials
    const testShop = await Shop.findOne({ email: targetEmail }).select("+password");
    const isPasswordCorrect = await bcrypt.compare(targetPassword, testShop.password);
    console.log(`\nShop Login Test for [${targetEmail} / ${targetPassword}]: ${isPasswordCorrect ? "PASSED (MATCH!)" : "FAILED"}`);

    const testUser = await User.findOne({ email: targetEmail }).select("+password");
    const isUserPasswordCorrect = await bcrypt.compare(targetPassword, testUser.password);
    console.log(`User Login Test for [${targetEmail} / ${targetPassword}]: ${isUserPasswordCorrect ? "PASSED (MATCH!)" : "FAILED"}`);

    console.log("\n==========================================");
    console.log("Seeding Complete!");
    console.log(`Total Products in DB for ${targetEmail}: ${inserted.length}`);
    console.log("Seller / Shop Credentials:");
    console.log(`  Email: ${targetEmail}`);
    console.log(`  Password: ${targetPassword}`);
    console.log("==========================================");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedData();
