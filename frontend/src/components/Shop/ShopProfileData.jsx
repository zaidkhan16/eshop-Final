import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import ProductCard from "../Route/ProductCard/ProductCard";
import Ratings from "../Products/Ratings";
import Loader from "../Layout/Loader";
import {
  HiOutlineShoppingBag,
  HiOutlineBolt,
  HiOutlineStar,
  HiOutlineInformationCircle,
  HiOutlineMagnifyingGlass,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineArrowPath,
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineSparkles,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import { AiFillStar } from "react-icons/ai";

const ShopProfileData = ({ isOwner }) => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { events, isLoading: eventsLoading } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [ratingFilter, setRatingFilter] = useState("All");

  useEffect(() => {
    if (id) {
      dispatch(getAllProductsShop(id));
      dispatch(getAllEventsShop(id));
    }
  }, [dispatch, id]);

  // Extract all reviews across products
  const allReviews = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return products.map((p) => p.reviews || []).flat();
  }, [products]);

  // Categories present in this shop
  const shopCategories = useMemo(() => {
    if (!products || !Array.isArray(products)) return ["All"];
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return products
      .filter((p) => {
        if (selectedCategory !== "All" && p.category !== selectedCategory) {
          return false;
        }
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = p.name?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchTags = p.tags?.toLowerCase().includes(q);
          return matchName || matchDesc || matchTags;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_low") {
          return (Number(a.discountPrice) || 0) - (Number(b.discountPrice) || 0);
        }
        if (sortBy === "price_high") {
          return (Number(b.discountPrice) || 0) - (Number(a.discountPrice) || 0);
        }
        if (sortBy === "best_selling") {
          return (Number(b.sold_out) || 0) - (Number(a.sold_out) || 0);
        }
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  // Review statistics
  const reviewStats = useMemo(() => {
    const total = allReviews.length;
    if (total === 0) {
      return {
        avg: "5.0",
        total: 0,
        distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      };
    }
    const sum = allReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / total).toFixed(1);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach((r) => {
      const star = Math.round(Number(r.rating) || 5);
      if (distribution[star] !== undefined) {
        distribution[star]++;
      }
    });

    return { avg, total, distribution };
  }, [allReviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    if (ratingFilter === "All") return allReviews;
    const targetStar = Number(ratingFilter);
    return allReviews.filter((r) => Math.round(Number(r.rating) || 5) === targetStar);
  }, [allReviews, ratingFilter]);

  if (isLoading || eventsLoading) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const tabs = [
    {
      id: 1,
      label: "Products Catalog",
      count: products?.length || 0,
      icon: HiOutlineShoppingBag,
    },
    {
      id: 2,
      label: "Flash Deals & Events",
      count: events?.length || 0,
      icon: HiOutlineBolt,
    },
    {
      id: 3,
      label: "Customer Reviews",
      count: allReviews.length,
      icon: HiOutlineStar,
    },
    {
      id: 4,
      label: "Store Policies & About",
      count: null,
      icon: HiOutlineInformationCircle,
    },
  ];

  return (
    <div className="w-full space-y-6 font-Poppins">
      {/* Top Storefront Tabs Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: STORE PRODUCTS CATALOG */}
      {activeTab === 1 && (
        <div className="space-y-6">
          {/* Search, Category Filters, and Sort Controls */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
            {/* Category Filter Chips */}
            {shopCategories.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar">
                {shopCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* In-store Search & Sorting */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search in this store's catalog..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-xs text-slate-500">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                >
                  <option value="featured">Featured Items</option>
                  <option value="newest">Newest Additions</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="best_selling">Best Selling</option>
                </select>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                <HiOutlineShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Products Found
              </h3>
              <p className="text-xs text-slate-500">
                {searchTerm || selectedCategory !== "All"
                  ? "No items match your filter. Try adjusting your search query."
                  : "This seller hasn't published any products yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {filteredProducts.map((product, index) => (
                <ProductCard data={product} key={product._id || index} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RUNNING EVENTS & FLASH DEALS */}
      {activeTab === 2 && (
        <div className="space-y-6">
          {events && events.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto">
                <HiOutlineBolt className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Active Flash Sales
              </h3>
              <p className="text-xs text-slate-500">
                This store currently does not have any ongoing promotional events. Browse the regular catalog for deals!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {events &&
                events.map((eventItem, index) => (
                  <ProductCard
                    data={eventItem}
                    key={eventItem._id || index}
                    isEvent={true}
                  />
                ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: CUSTOMER REVIEWS & FEEDBACK */}
      {activeTab === 3 && (
        <div className="space-y-6">
          {/* Review Summary Header Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Overall Score */}
              <div className="md:col-span-4 text-center md:border-r border-slate-100 md:pr-6">
                <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-Poppins">
                  {reviewStats.avg}
                </span>
                <div className="flex items-center justify-center gap-1 text-amber-400 mt-2">
                  <Ratings rating={Number(reviewStats.avg)} />
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Based on {reviewStats.total} verified customer ratings
                </p>
              </div>

              {/* Star Distribution Breakdown */}
              <div className="md:col-span-8 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = reviewStats.distribution[star] || 0;
                  const percent =
                    reviewStats.total > 0
                      ? Math.round((count / reviewStats.total) * 100)
                      : 0;

                  return (
                    <div
                      key={star}
                      onClick={() =>
                        setRatingFilter(
                          ratingFilter === star.toString() ? "All" : star.toString()
                        )
                      }
                      className={`flex items-center gap-3 text-xs cursor-pointer p-1 rounded-lg transition-all ${
                        ratingFilter === star.toString()
                          ? "bg-indigo-50 font-bold"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <span className="w-12 text-slate-600 flex items-center gap-1">
                        {star} <AiFillStar className="w-3.5 h-3.5 text-amber-400" />
                      </span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <span className="w-12 text-right text-slate-400">
                        {count} ({percent}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {filteredReviews.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center max-w-md mx-auto space-y-3 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <HiOutlineChatBubbleBottomCenterText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                No Reviews Found
              </h3>
              <p className="text-xs text-slate-500">
                {ratingFilter !== "All"
                  ? `No reviews match ${ratingFilter}-star rating.`
                  : "This seller does not have any customer reviews yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReviews.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {item.user?.name
                          ? item.user.name.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                            {item.user?.name || "Verified Customer"}
                          </h4>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.2 rounded-full">
                            <HiOutlineCheckBadge className="w-3 h-3 text-emerald-600" />
                            Verified Buyer
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Ratings rating={item.rating || 5} />
                          <span className="text-[11px] text-slate-400">
                            {item.createdAt
                              ? new Date(item.createdAt).toLocaleDateString()
                              : "Recent purchase"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                    {item.comment || "Great product, excellent quality and fast delivery from this shop!"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STORE POLICIES & ABOUT */}
      {activeTab === 4 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineSparkles className="w-5 h-5 text-indigo-600" />
              <span>About Our Store & Quality Commitment</span>
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Learn about our authentic product sourcing, fulfillment standards, and customer happiness policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                <HiOutlineShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">100% Genuine Products</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                All inventory items are inspected and certified authentic directly from verified manufacturers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <HiOutlineTruck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Swift Express Delivery</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Orders are processed and handed to our premium logistics courier partners within 24 business hours.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <HiOutlineArrowPath className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Hassle-Free Returns</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Protected by our 7-day customer satisfaction guarantee with dedicated resolution support.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;
