import React, { useState, useEffect } from "react";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { toast } from "react-toastify";
import {
  HiOutlineSparkles,
  HiOutlineShoppingCart,
  HiOutlineEye,
  HiOutlineShare,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiCheckBadge,
  HiFire,
} from "react-icons/hi2";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import ProductDetailsCard from "../Route/ProductDetailsCard/ProductDetailsCard";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [openQuickView, setOpenQuickView] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setIsWishlisted(true);
    } else {
      setIsWishlisted(false);
    }
  }, [wishlist, data?._id]);

  if (!data) return null;

  const addToCartHandler = () => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limit reached!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Event item added to cart successfully!");
      }
    }
  };

  const toggleWishlist = (e) => {
    e.stopPropagation();
    if (isWishlisted) {
      dispatch(removeFromWishlist(data));
      setIsWishlisted(false);
      toast.info("Removed from wishlist");
    } else {
      dispatch(addToWishlist(data));
      setIsWishlisted(true);
      toast.success("Saved to your wishlist!");
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/product/${data._id}?isEvent=true`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Event link copied to clipboard!");
    } else {
      toast.info("Event URL: " + url);
    }
  };

  // Extract all images
  const images =
    data?.images && data.images.length > 0
      ? data.images.map((img) => (img?.url ? img.url : img))
      : data?.image_Url && data.image_Url.length > 0
      ? data.image_Url.map((img) => (img?.url ? img.url : img))
      : ["https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"];

  const currentImage =
    images[selectedImgIndex] && !images[selectedImgIndex].includes("startech.com.bd")
      ? images[selectedImgIndex]
      : "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80";

  const discountPercent =
    data.originalPrice && data.discountPrice && data.originalPrice > data.discountPrice
      ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
      : null;

  const savingsAmount =
    data.originalPrice && data.discountPrice && data.originalPrice > data.discountPrice
      ? (data.originalPrice - data.discountPrice).toFixed(0)
      : null;

  // Stock / Claim calculation
  const totalStock = (data.sold_out || 18) + (data.stock || 6);
  const claimedPercent = Math.min(Math.round(((data.sold_out || 18) / totalStock) * 100), 96);

  return (
    <>
      <div
        className={`w-full event-glass-spotlight rounded-3xl p-5 sm:p-8 md:p-10 ${
          active ? "" : "mb-8 sm:mb-12"
        } grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative overflow-hidden group`}
      >
        {/* Ambient Glow Bubbles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Left Column: Interactive Product Showcase */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          {/* Main Stage Image */}
          <div className="w-full h-[260px] sm:h-[360px] md:h-[400px] bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-50/60 rounded-3xl flex items-center justify-center p-6 sm:p-8 relative overflow-hidden border border-slate-200/70 shadow-inner group">
            {/* Top Badge Overlay */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5 items-start">
              {discountPercent ? (
                <span className="bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-lg uppercase tracking-wider flex items-center gap-1.5 border border-white/20">
                  <HiFire className="w-4 h-4 text-yellow-200 animate-bounce" />
                  SAVE {discountPercent}% OFF
                </span>
              ) : (
                <span className="bg-slate-900 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                  Featured Event
                </span>
              )}
            </div>

            {/* Quick Action Floating Buttons */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
              <button
                onClick={toggleWishlist}
                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-slate-400 hover:text-pink-500 shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
              >
                {isWishlisted ? (
                  <AiFillHeart className="w-5 h-5 text-pink-500" />
                ) : (
                  <AiOutlineHeart className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setOpenQuickView(true)}
                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-slate-500 hover:text-indigo-600 shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Quick preview"
              >
                <HiOutlineEye className="w-5 h-5" />
              </button>

              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md text-slate-500 hover:text-indigo-600 shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Share event"
              >
                <HiOutlineShare className="w-4 h-4" />
              </button>
            </div>

            {/* Main Product Image */}
            <img
              src={currentImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80";
              }}
              alt={data.name || "Event Showcase"}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-700 ease-out filter drop-shadow-xl"
            />
          </div>

          {/* Interactive Multi-Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto py-1 max-w-full">
              {images.slice(0, 5).map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`w-14 h-14 rounded-xl p-1 bg-white border-2 transition-all shrink-0 overflow-hidden ${
                    selectedImgIndex === idx
                      ? "border-indigo-600 shadow-md scale-105 ring-2 ring-indigo-200"
                      : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information, Live Timer, Stock Bar & Actions */}
        <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-4">
          {/* Top Status Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 border border-rose-300 text-rose-600 text-xs font-black uppercase tracking-wider">
              <HiOutlineSparkles className="w-4 h-4 animate-pulse text-rose-500" />
              <span>Limited Time Mega Drop</span>
            </span>

            {data?.shop && (
              <Link
                to={`/shop/preview/${data?.shop?._id || data?.shopId}`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 border border-slate-200 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-colors"
              >
                <span>{data?.shop?.name || "Official Brand Store"}</span>
                <HiCheckBadge className="w-4 h-4 text-blue-500" />
              </Link>
            )}

            {data.category && (
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                {data.category}
              </span>
            )}
          </div>

          {/* Event Product Title */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
            {data.name}
          </h2>

          {/* Description */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
            {data.description}
          </p>

          {/* Live Countdown Clock */}
          <CountDown data={data} size="hero" showPulse={true} />

          {/* Pricing & Savings Breakdown */}
          <div className="flex flex-wrap items-baseline gap-3 py-3 border-y border-slate-200/80 my-1">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-indigo-600 tracking-tight">
                ${data.discountPrice || data.originalPrice}
              </span>
              {data.originalPrice && data.discountPrice < data.originalPrice && (
                <span className="text-base sm:text-xl text-slate-400 font-semibold line-through">
                  ${data.originalPrice}
                </span>
              )}
            </div>

            {savingsAmount && (
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-extrabold uppercase tracking-wider">
                Instant Savings: ${savingsAmount}
              </span>
            )}
          </div>

          {/* Stock & Claim Scarcity Meter */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-rose-600 flex items-center gap-1.5">
                <HiFire className="w-4 h-4 animate-pulse" />
                <span>{claimedPercent}% Claimed — Selling Fast!</span>
              </span>
              <span className="text-slate-500">
                {data.stock > 0 ? `Only ${data.stock} units remaining` : "Limited stock available"}
              </span>
            </div>
            <div className="w-full bg-slate-200/70 rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className="event-shimmer-bar h-full rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${claimedPercent}%` }}
              />
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-slate-600 font-semibold">
            <div className="flex items-center gap-2">
              <HiOutlineTruck className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>Express Priority Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <HiOutlineShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official Warranty & Buyer Protection</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={addToCartHandler}
              className="flex-1 px-8 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
              <span>Add To Cart & Claim Deal</span>
            </button>

            <Link to={`/product/${data._id}?isEvent=true`} className="sm:w-auto">
              <button className="w-full sm:w-auto px-6 py-3.5 sm:py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all hover:bg-slate-800">
                <HiOutlineEye className="w-5 h-5" />
                <span>View Full Specs</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {openQuickView && <ProductDetailsCard setOpen={setOpenQuickView} data={data} />}
    </>
  );
};

export default EventCard;
