const mongoose = require("mongoose");
const connectDatabase = require("../db/Database");
const Product = require("../model/product");
const Shop = require("../model/shop");

const newProductsData = [
  // 1. Computers and Laptops
  {
    name: "MacBook Pro 16-inch M3 Max (36GB Unified Memory, 1TB SSD, Space Black)",
    description: `The 16-inch MacBook Pro blasts forward with M3 Max, an extraordinarily advanced chip that brings massive performance and capabilities for the most extreme workflows. 

KEY FEATURES & SPECIFICATIONS:
• Processor: Apple M3 Max with 16-core CPU and 40-core GPU
• Unified Memory: 36GB high-bandwidth unified RAM
• Storage: 1TB ultra-fast PCIe NVMe SSD (up to 7.4GB/s read speeds)
• Display: 16.2-inch Liquid Retina XDR (3456 x 2234 native resolution at 254 ppi), 1,000,000:1 contrast ratio, 1600 nits peak HDR brightness, ProMotion technology up to 120Hz
• Battery Life: Up to 22 hours of continuous video playback, 140W USB-C Power Adapter included
• Audio & Camera: 1080p FaceTime HD camera with advanced image signal processor; high-fidelity six-speaker sound system with force-cancelling woofers and wide stereo sound with Dolby Atmos support
• Connectivity: Wi-Fi 6E (802.11ax), Bluetooth 5.3, 3x Thunderbolt 4 ports, HDMI port, SDXC card slot, headphone jack, MagSafe 3 port

IN THE BOX:
16-inch MacBook Pro, 140W USB-C Power Adapter, USB-C to MagSafe 3 Cable (2m), Apple 1-Year Limited Warranty Documentation.`,
    category: "Computers and Laptops",
    tags: "apple, macbook, laptop, m3, computers, pro",
    originalPrice: 3499,
    discountPrice: 3299,
    stock: 18,
    images: [
      {
        public_id: "products/macbook_m3_1",
        url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/macbook_m3_2",
        url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/macbook_m3_3",
        url: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/macbook_m3_4",
        url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.95,
    sold_out: 42,
    reviews: [
      {
        user: { name: "Marcus Vance", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
        rating: 5,
        comment: "The compilation speeds for 4K video rendering and Docker containers are staggering. Space black finish looks gorgeous and resists fingerprints.",
        createdAt: new Date("2026-07-15"),
      },
      {
        user: { name: "Sarah Lin", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
        rating: 5,
        comment: "Battery lasts all day with heavy Figma & code development. The Liquid Retina XDR screen is unmatched.",
        createdAt: new Date("2026-08-02"),
      },
    ],
  },
  {
    name: "Dell XPS 15 9530 Touchscreen Laptop (Intel Core i9-13900H, 32GB RAM, 1TB SSD, RTX 4070)",
    description: `Immerse yourself in precision craftsmanship and staggering power. The Dell XPS 15 delivers exceptional creative performance packed inside an aluminum chassis with a stunning 3.5K OLED InfinityEdge touchscreen.

KEY FEATURES & SPECIFICATIONS:
• Processor: 13th Gen Intel Core i9-13900H (14 cores, 20 threads, up to 5.4 GHz Turbo)
• Graphics: NVIDIA GeForce RTX 4070 Laptop GPU 8GB GDDR6 (40W)
• Memory: 32GB DDR5 4800MHz Dual Channel RAM
• Storage: 1TB M.2 PCIe NVMe Gen 4 Solid State Drive
• Display: 15.6-inch 3.5K (3456 x 2160) OLED InfinityEdge Touch Anti-Reflective 400-Nit Display, 100% DCI-P3 color gamut, DisplayHDR 500
• Chassis: Precision-cut CNC machined aluminum in Platinum Silver with Black carbon fiber composite palm rest
• Audio: Studio-quality tuning with Waves MaxxAudio Pro and Waves Nx 3D audio, quad-speaker design (2x 2.5W woofers and 2x 1.5W tweeters)
• Battery & Power: 6-Cell 86Whr integrated battery with 130W Type-C AC Adapter

IN THE BOX:
Dell XPS 15 9530 Laptop, 130W USB-C Power Adapter, USB-C to USB-A/HDMI Dongle, Quick Start Guide.`,
    category: "Computers and Laptops",
    tags: "dell, xps, laptop, windows, oled, intel, rtx",
    originalPrice: 2799,
    discountPrice: 2499,
    stock: 12,
    images: [
      {
        public_id: "products/dell_xps_1",
        url: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/dell_xps_2",
        url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/dell_xps_3",
        url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.8,
    sold_out: 28,
    reviews: [
      {
        user: { name: "David Chen" },
        rating: 5,
        comment: "The OLED touchscreen display is hypnotic. Color accuracy for photography is phenomenal.",
        createdAt: new Date("2026-08-10"),
      },
    ],
  },

  // 2. Mobile and Tablets
  {
    name: "Samsung Galaxy S24 Ultra 5G (512GB, Titanium Gray, Galaxy AI)",
    description: `Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity, productivity and possibility — starting with the most important device in your life.

KEY FEATURES & SPECIFICATIONS:
• Galaxy AI Capabilities: Live Translate during calls, Circle to Search with Google, Note Assist formatting, Generative Edit for photos
• Build: Armor Titanium frame with Corning Gorilla Armor front glass (reducing reflections by 75%) and IP68 water/dust resistance
• Display: 6.8-inch Dynamic AMOLED 2X Quad HD+ (3120 x 1440), 1-120Hz adaptive refresh rate, 2,600 nits peak brightness
• Processor: Qualcomm Snapdragon 8 Gen 3 for Galaxy (4nm)
• Camera System: 200MP Wide (f/1.7, OIS), 50MP Periscope Telephoto (5x optical / 100x Space Zoom), 10MP Telephoto (3x optical), 12MP Ultra-Wide, 8K video recording at 30fps
• S-Pen: Built-in Bluetooth stylus with 4,096 pressure levels
• Battery: 5,000mAh with 45W super-fast wired charging & 15W wireless charging

IN THE BOX:
Samsung Galaxy S24 Ultra, Embedded S-Pen, USB Type-C to Type-C Cable, SIM Ejection Tool, Quick Start Guide.`,
    category: "Mobile and Tablets",
    tags: "samsung, galaxy, s24, ultra, 5g, android, smartphone",
    originalPrice: 1419,
    discountPrice: 1299,
    stock: 35,
    images: [
      {
        public_id: "products/s24_ultra_1",
        url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/s24_ultra_2",
        url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/s24_ultra_3",
        url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.9,
    sold_out: 65,
    reviews: [
      {
        user: { name: "Jason Miller" },
        rating: 5,
        comment: "The flat screen and anti-reflective glass make a huge difference under direct sunlight. Galaxy AI features are genuinely useful.",
        createdAt: new Date("2026-08-20"),
      },
    ],
  },
  {
    name: "Apple iPad Pro 13-inch M4 Ultra Retina XDR (512GB, Wi-Fi, Space Black)",
    description: `The all-new iPad Pro is impossibly thin (5.1mm), featuring outrageous performance with the Apple M4 chip, a breakthrough Ultra Retina XDR display, and superfast Wi-Fi 6E.

KEY FEATURES & SPECIFICATIONS:
• Display: 13-inch Ultra Retina XDR featuring Tandem OLED technology, 2752 x 2064 resolution, 1000 nits full-screen brightness, 1600 nits peak HDR brightness, ProMotion 10-120Hz
• Chip: Apple M4 Chip with 9-core CPU, 10-core GPU with hardware-accelerated ray tracing, 16-core Neural Engine capable of 38 trillion operations per second
• Memory & Storage: 8GB RAM with 512GB high-speed storage
• Camera & Audio: Landscape 12MP Center Stage front camera; 12MP Wide rear camera with LiDAR Scanner and adaptive True Tone flash; 4 studio-quality mics and 4-speaker audio system
• Accessories Supported: Compatible with Apple Pencil Pro, Apple Pencil (USB-C), and Magic Keyboard for iPad Pro (M4)

IN THE BOX:
iPad Pro 13-inch, USB-C Charge Cable (1m), 20W USB-C Power Adapter.`,
    category: "Mobile and Tablets",
    tags: "apple, ipad, m4, tablet, oled, pro",
    originalPrice: 1499,
    discountPrice: 1399,
    stock: 20,
    images: [
      {
        public_id: "products/ipad_pro_1",
        url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/ipad_pro_2",
        url: "https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/ipad_pro_3",
        url: "https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.92,
    sold_out: 39,
    reviews: [
      {
        user: { name: "Elena Rostova" },
        rating: 5,
        comment: "This OLED screen is mind blowing. Contrast and deep blacks make digital illustration feel like painting on real velvet.",
        createdAt: new Date("2026-08-14"),
      },
    ],
  },

  // 3. Music and Gaming
  {
    name: "Sony WH-1000XM5 Wireless Industry-Leading Noise Canceling Headphones",
    description: `With two processors and eight microphones, Sony WH-1000XM5 headphones rewrite the rules for distraction-free listening and exceptional call clarity.

KEY FEATURES & SPECIFICATIONS:
• Noise Canceling: Dual processors control 8 microphones for unprecedented noise cancellation with Auto NC Optimizer
• Audio Drivers: Specially designed 30mm carbon fiber composite driver unit delivers natural sound quality with rich bass and sparkling highs
• Codecs Supported: LDAC (High-Resolution Audio Wireless), AAC, SBC, DSEE Extreme AI audio upscaling
• Microphones: 4 beamforming microphones with AI noise reduction algorithm for crystal-clear phone calls
• Battery Life: Up to 30 hours of continuous playback with ANC on (40 hours ANC off); 3-minute quick charge delivers 3 hours of listening
• Smart Features: Speak-to-Chat pauses music when you talk; Multipoint Bluetooth connection pairs with two devices simultaneously
• Comfort: Ultra-soft fit synthetic leather headband and earcups with lightweight pressure-relieving design

IN THE BOX:
Sony WH-1000XM5 Headphones, Collapsible Travel Carrying Case, 3.5mm Audio Cable (1.2m), USB-C Charging Cable.`,
    category: "Music and Gaming",
    tags: "sony, headphones, noise canceling, wireless, bluetooth, audio",
    originalPrice: 399,
    discountPrice: 329,
    stock: 45,
    images: [
      {
        public_id: "products/sony_xm5_1",
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/sony_xm5_2",
        url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/sony_xm5_3",
        url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.88,
    sold_out: 120,
    reviews: [
      {
        user: { name: "Lucas Reed" },
        rating: 5,
        comment: "Airplane cabin noise completely vanished. The ear cushions are so soft you forget you have them on after 4 hours.",
        createdAt: new Date("2026-07-28"),
      },
    ],
  },
  {
    name: "PlayStation 5 Slim Console (1TB NVMe, 4K HDR 120Hz, DualSense Wireless)",
    description: `Experience lightning-fast loading with an ultra-high speed 1TB SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.

KEY FEATURES & SPECIFICATIONS:
• Slim Design: 30% reduced volume with sleek 4-panel cover design
• Storage: Custom 1TB NVMe Gen 4 SSD (5.5GB/s raw read bandwidth)
• Performance: Custom 8-core AMD Zen 2 CPU up to 3.5GHz, AMD RDNA 2 GPU with Ray Tracing acceleration
• Video Output: Supports 4K 120Hz TVs, 8K TVs, VRR (Variable Refresh Rate) via HDMI 2.1
• Audio: Tempest 3D AudioTech engine for pinpoint environmental audio
• Controller: DualSense Wireless Controller featuring immersive Haptic Feedback and dynamic Adaptive Triggers

IN THE BOX:
PlayStation 5 Slim Console, DualSense Wireless Controller, 1TB SSD (installed), 2 Horizontal Stand Feet, HDMI 2.1 Cable, AC Power Cord, USB-C Charging Cable, ASTRO's PLAYROOM (Pre-installed game).`,
    category: "Music and Gaming",
    tags: "sony, ps5, playstation, gaming, console, 4k",
    originalPrice: 499,
    discountPrice: 449,
    stock: 22,
    images: [
      {
        public_id: "products/ps5_slim_1",
        url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/ps5_slim_2",
        url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/ps5_slim_3",
        url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.96,
    sold_out: 85,
    reviews: [
      {
        user: { name: "Kareem A." },
        rating: 5,
        comment: "Instant load times in Spider-Man 2 and Demon's Souls. The haptic feedback on the triggers is game-changing.",
        createdAt: new Date("2026-08-01"),
      },
    ],
  },

  // 4. Cosmetics and Body Care
  {
    name: "Dior Sauvage Elixir Luxury Men's Eau De Parfum (60ml)",
    description: `Dior Sauvage Elixir is an extraordinarily concentrated fragrance steeped in the iconic freshness of Sauvage with an intoxicating heart of spices, a 'tailor-made' lavender essence, and a blend of rich woods forming the signature of its powerful, lavish and captivating trail.

FRAGRANCE PROFILE & NOTES:
• Top Notes: Cardamom, Nutmeg, Cinnamon, Grapefruit
• Heart Notes: Custom Lavender essence grown in Nyons
• Base Notes: Rich Amber, Licorice, Haitian Vetiver, Patchouli, Sandalwood
• Bottle Design: Midnight blue lacquered glass bottle with magnetic cap and silver engraved details
• Sillage & Longevity: Beast-mode longevity lasting 14+ hours with distinct projection

USAGE INSTRUCTIONS:
Apply directly to pulse points (wrists, neck, chest) for maximum projection and all-day lingering presence.`,
    category: "cosmetics and body care",
    tags: "dior, perfume, cologne, fragrance, luxury, beauty",
    originalPrice: 230,
    discountPrice: 195,
    stock: 28,
    images: [
      {
        public_id: "products/dior_sauvage_1",
        url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/dior_sauvage_2",
        url: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/dior_sauvage_3",
        url: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.97,
    sold_out: 74,
    reviews: [
      {
        user: { name: "Benjamin Thorne" },
        rating: 5,
        comment: "Unmatched compliment getter. One or two sprays last until the next day. Truly a masterpiece.",
        createdAt: new Date("2026-08-11"),
      },
    ],
  },
  {
    name: "Estée Lauder Advanced Night Repair Synchronized Recovery Complex (50ml)",
    description: `Harness the restorative power of night. This deep- and fast-penetrating face serum, with exclusive Night Peptide, boosts 7 key skin-renewing actions to visibly reduce multiple signs of aging.

BENEFITS & ACTIVE INGREDIENTS:
• 8-Hour Antioxidant Protection: Defends skin against environmental damage from ozone and pollution
• 72-Hour Hydration: Infused with high levels of Hyaluronic Acid to lock in deep moisture
• Target Concerns: Fine lines, wrinkles, uneven tone, dryness, dehydration, dullness
• Formula Facts: Oil-free, non-acnegenic, fragrance-free, dermatologist and ophthalmologist-tested

HOW TO USE:
Apply this face serum on clean skin before your moisturizer, morning and night. Use one dropper and smooth gently all over face and throat.`,
    category: "cosmetics and body care",
    tags: "skincare, serum, anti-aging, estee lauder, hyaluronic acid, beauty",
    originalPrice: 125,
    discountPrice: 105,
    stock: 40,
    images: [
      {
        public_id: "products/anr_serum_1",
        url: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/anr_serum_2",
        url: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/anr_serum_3",
        url: "https://images.unsplash.com/photo-1608248597359-5f212269a84a?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.89,
    sold_out: 95,
    reviews: [
      {
        user: { name: "Clara Dupont" },
        rating: 5,
        comment: "My skin tone is visibly smoother and radiant after two weeks of nightly application. Holy grail product.",
        createdAt: new Date("2026-08-05"),
      },
    ],
  },

  // 5. Shoes & Accessories
  {
    name: "Nike Air Jordan 1 Retro High OG 'Chicago Lost & Found' (Limited Edition)",
    description: `The Air Jordan 1 Retro High OG 'Chicago Lost & Found' brings back the iconic silhouette with vintage aged aesthetics reminiscent of finding an untouched pair in an 80s mom-and-pop sneaker store.

SPECIFICATIONS & DETAILS:
• Upper: Premium cracked leather white side panels, Varsity Red overlays, and distressed Black collar
• Tongue: Vintage pre-yellowed nylon tongue with signature Nike Air woven label
• Cushioning: Encapsulated Nike Air-Sole unit in the heel for lightweight impact protection
• Outsole: Solid rubber cupsole with deep flex grooves and classic pivot point pattern
• Collector's Packaging: Comes in aged mismatch box lid with vintage receipt voucher invoice

FIT & CARE:
Fits true to size. Wipe clean with damp cloth and specialized sneaker cleaner.`,
    category: "Shoes",
    tags: "nike, jordan, sneakers, shoes, chicago, retro",
    originalPrice: 280,
    discountPrice: 220,
    stock: 14,
    images: [
      {
        public_id: "products/jordan_chicago_1",
        url: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/jordan_chicago_2",
        url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/jordan_chicago_3",
        url: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.98,
    sold_out: 140,
    reviews: [
      {
        user: { name: "Tariq Owens" },
        rating: 5,
        comment: "Absolute grail sneaker. The leather quality is top tier and the vintage cracked leather detailing is unmatched.",
        createdAt: new Date("2026-07-19"),
      },
    ],
  },
  {
    name: "Sony Alpha 7 IV Full-Frame Hybrid Mirrorless Camera with 28-70mm Lens Kit",
    description: `With groundbreaking performance in both photo and video recording, the α7 IV is the ideal hybrid, delivering breathtaking imagery alongside on-the-spot delivery and distribution.

TECHNICAL SPECIFICATIONS:
• Sensor: 33MP Full-Frame Exmor R Back-Illuminated CMOS Sensor
• Image Processing: BIONZ XR processing engine delivering 8x faster processing
• Video Capabilities: 4K 60p recording in 10-bit 4:2:2, S-Cinetone color profile, full-pixel readout without binning
• Autofocus: 759-point phase-detection AF covering 94% of image area with Real-time Eye AF for Humans, Animals, and Birds
• Stabilization: 5-axis in-body optical image stabilization with 5.5 stops of compensation
• Viewfinder & LCD: 3.68M-dot Quad-VGA OLED electronic viewfinder; 3.0-inch vari-angle side-opening touchscreen LCD

IN THE BOX:
Sony α7 IV Body, FE 28-70mm f/3.5-5.6 OSS Lens, NP-FZ100 Rechargeable Battery, AC Adapter, Shoulder Strap, Body Cap, Lens Caps, Lens Hood.`,
    category: "Accesories",
    tags: "sony, camera, photography, mirrorless, 4k, video, alpha",
    originalPrice: 2699,
    discountPrice: 2499,
    stock: 10,
    images: [
      {
        public_id: "products/sony_a7iv_1",
        url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/sony_a7iv_2",
        url: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=1000&q=80",
      },
      {
        public_id: "products/sony_a7iv_3",
        url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1000&q=80",
      },
    ],
    ratings: 4.94,
    sold_out: 26,
    reviews: [
      {
        user: { name: "Nathaniel Drake" },
        rating: 5,
        comment: "The autofocus tracking in low light is unbelievable. 10-bit color grading gives Hollywood cinematic look.",
        createdAt: new Date("2026-08-16"),
      },
    ],
  },
];

const insertNewProducts = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDatabase();

    const shops = await Shop.find({}).lean();
    if (!shops || shops.length === 0) {
      console.error("No shops found in database.");
      process.exit(1);
    }

    console.log(`Found ${shops.length} available shops.`);
    const appleShop = shops.find((s) => s.name?.includes("Apple")) || shops[0];
    const fashionShop = shops.find((s) => s.name?.includes("Fashion")) || shops[1] || shops[0];
    const nuvexaShop = shops.find((s) => s.name?.includes("Nuvexa") || s.name?.includes("Meran")) || shops[0];

    const productsToInsert = newProductsData.map((p) => {
      let targetShop = nuvexaShop;
      if (p.name.includes("Apple") || p.name.includes("MacBook") || p.name.includes("iPad")) {
        targetShop = appleShop;
      } else if (p.category === "Shoes" || p.category === "Cloths" || p.category === "cosmetics and body care") {
        targetShop = fashionShop;
      }

      return {
        ...p,
        shopId: targetShop._id.toString(),
        shop: targetShop,
        createdAt: new Date(),
      };
    });

    console.log(`Inserting ${productsToInsert.length} detailed flagship products...`);
    const result = await Product.insertMany(productsToInsert);
    console.log(`Successfully added ${result.length} new products with rich galleries and descriptions!`);

    const totalCount = await Product.countDocuments({});
    console.log(`Total Products in Catalog: ${totalCount}`);

    process.exit(0);
  } catch (error) {
    console.error("Error inserting new products:", error);
    process.exit(1);
  }
};

insertNewProducts();
