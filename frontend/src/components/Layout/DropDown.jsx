import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  IoIosArrowForward,
  IoIosStar,
  IoIosFlash,
} from "react-icons/io";
import {
  HiOutlineSparkles,
  HiOutlineFire,
  HiOutlineCheckBadge,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowPath,
  HiOutlineTag,
} from "react-icons/hi2";
import { FiArrowUpRight, FiSearch } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";

// Rich metadata mapping for categories with Ultra-Crisp Dark Slate & Glowing Indigo Theme
const CATEGORY_META = {
  "Computers and Laptops": {
    displayName: "Computers & Laptops",
    tagline: "High-performance ultrabooks, gaming rigs, displays & pro accessories.",
    badge: "Popular",
    badgeStyle: "bg-indigo-950 text-indigo-300 border-indigo-700/80",
    accentGradient: "from-blue-600 to-indigo-600",
    badgeIcon: HiOutlineFire,
    subcategories: [
      "MacBooks & Laptops",
      "Gaming Laptops",
      "Monitors & Displays",
      "Mechanical Keyboards",
      "PC Components",
      "Storage & SSDs",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&auto=format&fit=crop&q=80",
  },
  "cosmetics and body care": {
    displayName: "Cosmetics & Body Care",
    tagline: "Luxury skincare, organic cosmetics, designer fragrances & personal care.",
    badge: "Trending",
    badgeStyle: "bg-rose-950 text-rose-300 border-rose-700/80",
    accentGradient: "from-rose-500 to-pink-600",
    badgeIcon: HiOutlineSparkles,
    subcategories: [
      "Skincare Routine",
      "Makeup & Lips",
      "Fragrances & Perfumes",
      "Hair & Scalp Care",
      "Body Washes",
      "Organic Beauty",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
  },
  "Accesories": {
    displayName: "Accessories & Bags",
    tagline: "Premium timepieces, designer sunglasses, luxury leather bags & jewelry.",
    badge: "Hot Deal",
    badgeStyle: "bg-amber-950 text-amber-300 border-amber-700/80",
    accentGradient: "from-amber-500 to-orange-600",
    badgeIcon: HiOutlineTag,
    subcategories: [
      "Smart Watches",
      "Sunglasses & Eyewear",
      "Leather Backpacks",
      "Wallets & Belts",
      "Fine Jewelry",
      "Hats & Caps",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
  },
  "Cloths": {
    displayName: "Clothing & Fashion",
    tagline: "Trending streetwear, seasonal apparel, comfy hoodies & timeless outfits.",
    badge: "New In",
    badgeStyle: "bg-violet-950 text-violet-300 border-violet-700/80",
    accentGradient: "from-violet-600 to-purple-600",
    badgeIcon: HiOutlineSparkles,
    subcategories: [
      "Men's Streetwear",
      "Women's Fashion",
      "Hoodies & Sweatshirts",
      "Denim & Trousers",
      "Active & Gym Wear",
      "Jackets & Coats",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&auto=format&fit=crop&q=80",
  },
  "Shoes": {
    displayName: "Shoes & Footwear",
    tagline: "Engineered runners, iconic retro sneakers, athletic trainers & leather shoes.",
    badge: "Best Seller",
    badgeStyle: "bg-emerald-950 text-emerald-300 border-emerald-700/80",
    accentGradient: "from-emerald-600 to-teal-600",
    badgeIcon: HiOutlineFire,
    subcategories: [
      "Sneakers & Streetwear",
      "Running & Training",
      "Formal Leather Shoes",
      "Boots & Outdoors",
      "Slides & Sandals",
      "Gym Trainers",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
  },
  "Gifts": {
    displayName: "Gifts & Celebrations",
    tagline: "Curated celebration hampers, customized keepsakes & unforgettable gifts.",
    badge: "Special",
    badgeStyle: "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-700/80",
    accentGradient: "from-fuchsia-600 to-pink-600",
    badgeIcon: HiOutlineSparkles,
    subcategories: [
      "Curated Gift Boxes",
      "Festive Hampers",
      "Personalized Keepsakes",
      "Toys & Collectibles",
      "Greeting Cards & Wraps",
      "Handmade Crafts",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=80",
  },
  "Pet Care": {
    displayName: "Pet Care & Supplies",
    tagline: "Nutritious pet food, interactive toys, grooming kits & wellness gear.",
    badge: "Top Rated",
    badgeStyle: "bg-teal-950 text-teal-300 border-teal-700/80",
    accentGradient: "from-teal-600 to-emerald-600",
    badgeIcon: HiOutlineCheckBadge,
    subcategories: [
      "Dog Food & Treats",
      "Cat Supplies & Toys",
      "Pet Grooming & Hygiene",
      "Beds & Furniture",
      "Leashes & Collars",
      "Pet Healthcare",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=500&auto=format&fit=crop&q=80",
  },
  "Mobile and Tablets": {
    displayName: "Mobiles & Tablets",
    tagline: "Flagship 5G smartphones, iPads, Android tablets, fast chargers & cases.",
    badge: "Featured",
    badgeStyle: "bg-sky-950 text-sky-300 border-sky-700/80",
    accentGradient: "from-sky-600 to-blue-600",
    badgeIcon: HiOutlineFire,
    subcategories: [
      "5G Smartphones",
      "iPads & Android Tablets",
      "Fast GaN Chargers",
      "Protective Phone Cases",
      "Wireless Power Banks",
      "Screen Protectors",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&auto=format&fit=crop&q=80",
  },
  "Music and Gaming": {
    displayName: "Music & Gaming",
    tagline: "Immersive Hi-Fi headphones, gaming consoles, RGB peripherals & studio mics.",
    badge: "Pro Choice",
    badgeStyle: "bg-purple-950 text-purple-300 border-purple-700/80",
    accentGradient: "from-purple-600 to-indigo-600",
    badgeIcon: HiOutlineFire,
    subcategories: [
      "Wireless Headphones",
      "Gaming Keyboards & Mice",
      "Consoles & Gamepads",
      "Surround Soundbars",
      "True Wireless Earbuds",
      "Gaming Headsets & Mic",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80",
  },
  "Others": {
    displayName: "More Categories",
    tagline: "Smart home gadgets, kitchen essentials, office goods & daily lifestyle items.",
    badge: "Explore",
    badgeStyle: "bg-slate-850 bg-slate-800 text-slate-200 border-slate-700",
    accentGradient: "from-slate-700 to-zinc-800",
    badgeIcon: HiOutlineSparkles,
    subcategories: [
      "Smart Home Devices",
      "Kitchen & Dining",
      "Fitness & Outdoor Gear",
      "Office Stationery",
      "Books & Media",
      "Travel Essentials",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=500&auto=format&fit=crop&q=80",
  },
};

const getCategoryMeta = (title) => {
  if (CATEGORY_META[title]) return CATEGORY_META[title];
  const foundKey = Object.keys(CATEGORY_META).find(
    (k) => k.toLowerCase() === title?.toLowerCase()
  );
  if (foundKey) return CATEGORY_META[foundKey];
  return {
    displayName: title || "Category",
    tagline: "Explore our curated collection of verified authentic products.",
    badge: "Popular",
    badgeStyle: "bg-indigo-950 text-indigo-300 border-indigo-700/80",
    accentGradient: "from-indigo-600 to-purple-600",
    badgeIcon: HiOutlineSparkles,
    subcategories: [
      "Best Sellers",
      "New Arrivals",
      "Trending Deals",
      "Top Rated",
      "Special Offers",
      "Featured",
    ],
    defaultImage:
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=500&auto=format&fit=crop&q=80",
  };
};

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();
  const { allProducts } = useSelector((state) => state.products);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [filterQuery, setFilterQuery] = useState("");

  // Filtered categories based on quick search
  const filteredCategories = useMemo(() => {
    if (!categoriesData) return [];
    if (!filterQuery.trim()) return categoriesData;
    return categoriesData.filter((cat) => {
      const meta = getCategoryMeta(cat.title);
      return (
        cat.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
        meta.displayName.toLowerCase().includes(filterQuery.toLowerCase()) ||
        meta.subcategories.some((sub) =>
          sub.toLowerCase().includes(filterQuery.toLowerCase())
        )
      );
    });
  }, [categoriesData, filterQuery]);

  // Current active category
  const activeCategory =
    filteredCategories[selectedIdx] || filteredCategories[0] || categoriesData?.[0];
  const activeMeta = activeCategory ? getCategoryMeta(activeCategory.title) : null;

  // Real-time product counts for each category
  const categoryCounts = useMemo(() => {
    const counts = {};
    if (allProducts && Array.isArray(allProducts)) {
      allProducts.forEach((p) => {
        if (p.category) {
          counts[p.category] = (counts[p.category] || 0) + 1;
        }
      });
    }
    return counts;
  }, [allProducts]);

  // Top products for active category
  const categoryFeaturedProducts = useMemo(() => {
    if (!activeCategory || !allProducts || !Array.isArray(allProducts)) return [];
    return allProducts
      .filter((p) => {
        const catName = p.category?.toLowerCase() || "";
        const target = activeCategory.title?.toLowerCase() || "";
        return catName === target;
      })
      .slice(0, 2);
  }, [activeCategory, allProducts]);

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${encodeURIComponent(category.title)}`);
    setDropDown(false);
  };

  const handleSubcategoryClick = (category, subcategory) => {
    navigate(
      `/products?category=${encodeURIComponent(category.title)}&search=${encodeURIComponent(subcategory)}`
    );
    setDropDown(false);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setDropDown(false);
  };

  return (
    <div
      className="w-[780px] lg:w-[830px] xl:w-[890px] bg-[#0c1222] border-2 border-indigo-500/40 absolute top-[60px] left-0 z-50 rounded-b-2xl rounded-tr-2xl shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_35px_rgba(99,102,241,0.25)] flex overflow-hidden transition-all duration-200 animate-in fade-in-50 zoom-in-95 text-slate-100 ring-1 ring-white/10"
      style={{ zIndex: 99999 }}
    >
      {/* Left Column: Category Sidebar */}
      <div className="w-[280px] lg:w-[300px] xl:w-[320px] bg-[#070b14] border-r border-slate-800/90 flex flex-col shrink-0">
        {/* Sidebar Search Bar */}
        <div className="p-3 border-b border-slate-800/80 bg-[#0a0f1d]">
          <div className="relative flex items-center">
            <FiSearch
              size={14}
              className="absolute left-3 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search category..."
              value={filterQuery}
              onChange={(e) => {
                setFilterQuery(e.target.value);
                setSelectedIdx(0);
              }}
              className="w-full h-8 pl-8 pr-3 bg-[#111827] border border-slate-700 rounded-lg text-xs font-semibold text-white placeholder-slate-400 focus:outline-hidden focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Scrollable Categories List */}
        <div className="py-1.5 overflow-y-auto max-h-[380px] scrollbar-thin scrollbar-thumb-slate-700 bg-[#070b14]">
          {filteredCategories.map((cat, index) => {
            const meta = getCategoryMeta(cat.title);
            const isSelected =
              activeCategory && activeCategory.id === cat.id;
            const count = categoryCounts[cat.title] || 0;

            return (
              <div
                key={cat.id || index}
                onMouseEnter={() => setSelectedIdx(index)}
                onClick={() => handleCategoryClick(cat)}
                className={`group relative flex items-center justify-between px-3.5 py-2.5 mx-2 my-0.5 rounded-xl cursor-pointer transition-all duration-150 select-none ${
                  isSelected
                    ? "bg-[#131b2e] text-indigo-300 shadow-md ring-1 ring-indigo-500/50 font-bold"
                    : "text-slate-200 hover:bg-[#111827] hover:text-white"
                }`}
              >
                {/* Left Active Accent Bar */}
                {isSelected && (
                  <span className="absolute left-0 top-2 bottom-2 w-1.5 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.9)]" />
                )}

                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  {/* Category Thumbnail / Icon Badge */}
                  <div
                    className={`w-7 h-7 rounded-lg p-0.5 flex items-center justify-center shrink-0 transition-transform duration-200 border ${
                      isSelected
                        ? "bg-indigo-950 border-indigo-500 shadow-xs scale-105"
                        : "bg-[#111827] border-slate-700 group-hover:scale-105 group-hover:bg-slate-800"
                    }`}
                  >
                    <img
                      src={cat.image_Url || meta.defaultImage}
                      alt={meta.displayName}
                      className="w-full h-full object-contain select-none"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = meta.defaultImage;
                      }}
                    />
                  </div>

                  <span className="text-[13px] tracking-tight truncate select-none text-white font-medium group-hover:text-indigo-300">
                    {meta.displayName}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {count > 0 ? (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold transition-colors border ${
                        isSelected
                          ? "bg-indigo-950 text-indigo-300 border-indigo-600"
                          : "bg-[#111827] text-slate-300 border-slate-700 group-hover:bg-indigo-950 group-hover:text-indigo-300"
                      }`}
                    >
                      {count}
                    </span>
                  ) : (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold border ${meta.badgeStyle}`}
                    >
                      {meta.badge}
                    </span>
                  )}
                  <IoIosArrowForward
                    size={13}
                    className={`transition-all duration-150 ${
                      isSelected
                        ? "text-indigo-400 translate-x-0.5"
                        : "text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-indigo-400"
                    }`}
                  />
                </div>
              </div>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="py-8 text-center px-4 text-slate-400 text-xs">
              No matching categories found
            </div>
          )}
        </div>

        {/* Bottom Sidebar Action */}
        <div className="p-2.5 mt-auto border-t border-slate-800/80 bg-[#0a0f1d]">
          <Link
            to="/products"
            onClick={() => setDropDown(false)}
            className="w-full py-2 px-3 rounded-xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-300 hover:text-white text-xs font-bold flex items-center justify-between transition-colors group shadow-sm"
          >
            <span className="flex items-center gap-1.5">
              <BiCategory size={15} />
              View All Categories
            </span>
            <FiArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-indigo-400"
            />
          </Link>
        </div>
      </div>

      {/* Right Column: Mega-Menu Category Detail & Showcase */}
      {activeCategory && activeMeta ? (
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0 bg-gradient-to-br from-[#0c1222] via-[#0f172a] to-[#151c33]">
          <div>
            {/* Category Hero Banner */}
            <div className="relative rounded-2xl overflow-hidden p-4 mb-4 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 text-white border border-indigo-500/30 shadow-xl">
              <div className="absolute top-0 right-0 w-48 h-full opacity-25 pointer-events-none">
                <img
                  src={activeCategory.image_Url || activeMeta.defaultImage}
                  alt=""
                  className="w-full h-full object-cover mix-blend-overlay"
                />
              </div>

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 backdrop-blur-xs text-[10px] font-bold tracking-wider uppercase text-indigo-300 border border-indigo-400/30">
                      <IoIosFlash size={12} className="text-amber-400" />
                      {activeMeta.badge}
                    </span>
                    {categoryCounts[activeCategory.title] > 0 && (
                      <span className="text-[11px] font-medium text-slate-300">
                        {categoryCounts[activeCategory.title]} items available
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-extrabold text-white tracking-tight">
                    {activeMeta.displayName}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-normal max-w-md">
                    {activeMeta.tagline}
                  </p>
                </div>

                <button
                  onClick={() => handleCategoryClick(activeCategory)}
                  className="shrink-0 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/40 flex items-center gap-1.5 cursor-pointer hover:scale-105 active:scale-95"
                >
                  <span>Explore</span>
                  <IoIosArrowForward size={12} className="text-white" />
                </button>
              </div>
            </div>

            {/* Subcategories Quick Tags */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                  Popular Subcategories
                </span>
                <span className="text-[11px] font-bold text-indigo-400">
                  Click to filter
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {activeMeta.subcategories.map((sub, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => handleSubcategoryClick(activeCategory, sub)}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#070b14] border border-slate-700/80 hover:border-indigo-400 hover:bg-[#131b2e] text-left transition-all duration-150 group cursor-pointer shadow-sm"
                  >
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                      {sub}
                    </span>
                    <FiArrowUpRight
                      size={12}
                      className="text-slate-400 group-hover:text-indigo-400 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Featured / Live Products in Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-300">
                  Featured Products
                </span>
                <button
                  onClick={() => handleCategoryClick(activeCategory)}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  View All ({categoryCounts[activeCategory.title] || 0})
                  <IoIosArrowForward size={12} />
                </button>
              </div>

              {categoryFeaturedProducts.length > 0 ? (
                <div className="grid grid-cols-2 gap-2.5">
                  {categoryFeaturedProducts.map((p) => {
                    const price = p.discountPrice || p.originalPrice || 0;
                    const origPrice = p.originalPrice;
                    const imgUrl =
                      p.images && p.images[0]?.url && !p.images[0]?.url.includes("startech.com.bd")
                        ? p.images[0].url
                        : activeMeta.defaultImage;

                    return (
                      <div
                        key={p._id}
                        onClick={() => handleProductClick(p._id)}
                        className="flex items-center gap-2.5 p-2 rounded-xl bg-[#070b14] border border-slate-700/90 hover:border-indigo-400 hover:bg-[#131b2e] transition-all cursor-pointer group shadow-md"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#0f172a] border border-slate-700 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={imgUrl}
                            alt={p.name}
                            className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = activeMeta.defaultImage;
                            }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                            {p.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-xs font-extrabold text-indigo-400">
                              ${price}
                            </span>
                            {origPrice && origPrice > price && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ${origPrice}
                              </span>
                            )}
                            {p.ratings > 0 && (
                              <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 ml-auto">
                                <IoIosStar size={11} />
                                {p.ratings}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  onClick={() => handleCategoryClick(activeCategory)}
                  className="p-3 rounded-xl bg-[#070b14] border border-dashed border-indigo-700/60 flex items-center justify-between cursor-pointer hover:bg-indigo-950/40 transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md">
                      <HiOutlineSparkles size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Discover {activeMeta.displayName}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Browse our latest arrivals and top verified sellers
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-400 group-hover:translate-x-1 transition-transform">
                    Shop Now →
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Perks Strip */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
            <div className="flex items-center gap-1.5">
              <HiOutlineTruck size={14} className="text-indigo-400" />
              <span>Fast Express Shipping</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiOutlineShieldCheck size={14} className="text-emerald-400" />
              <span>100% Authentic Products</span>
            </div>
            <div className="flex items-center gap-1.5">
              <HiOutlineArrowPath size={14} className="text-amber-400" />
              <span>7-Day Easy Returns</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DropDown;
