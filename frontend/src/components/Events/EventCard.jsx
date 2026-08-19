import React from "react";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { HiOutlineSparkles, HiOutlineShoppingCart, HiOutlineEye } from "react-icons/hi";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  if (!data) return null;

  const discountPercent =
    data.originalPrice && data.discountPrice && data.originalPrice > data.discountPrice
      ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
      : null;

  return (
    <div
      className={`w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-4 sm:p-8 ${
        active ? "" : "mb-8 sm:mb-12"
      } grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center relative overflow-hidden group`}
    >
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Left Column Image Showcase */}
      <div className="lg:col-span-5 flex justify-center items-center relative">
        <div className="w-full h-[200px] sm:h-[340px] bg-slate-50 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden border border-slate-100">
          {discountPercent ? (
            <span className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-[11px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-md uppercase tracking-wider">
              SAVE {discountPercent}%
            </span>
          ) : null}

          <img
            src={
              data?.images && data.images[0]?.url && !data.images[0]?.url.includes("startech.com.bd")
                ? data.images[0].url
                : data?.image_Url && data.image_Url[0]?.url && !data.image_Url[0]?.url.includes("startech.com.bd")
                ? data.image_Url[0].url
                : "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80"
            }
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80";
            }}
            alt={data.name || "Event"}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
          />
        </div>
      </div>

      {/* Right Column Content */}
      <div className="lg:col-span-7 flex flex-col justify-center text-left">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold w-fit mb-2 sm:mb-3">
          <HiOutlineSparkles className="w-4 h-4 animate-pulse" />
          <span>Special Event Offer</span>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-2 sm:mb-3">
          {data.name}
        </h2>

        {/* Description */}
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 line-clamp-3">
          {data.description}
        </p>

        {/* Price & Sold */}
        <div className="flex flex-wrap items-center justify-between gap-3 py-2.5 sm:py-3 border-y border-slate-100 my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">
              ${data.discountPrice || data.originalPrice}
            </span>
            {data.originalPrice && data.discountPrice < data.originalPrice ? (
              <span className="text-xs sm:text-base text-slate-400 font-medium line-through">
                ${data.originalPrice}
              </span>
            ) : null}
          </div>

          <span className="text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            🔥 {data.sold_out || 0} Claimed
          </span>
        </div>

        {/* Countdown */}
        <CountDown data={data} />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
          <Link to={`/product/${data._id}?isEvent=true`} className="w-full sm:w-auto">
            <button className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all">
              <HiOutlineEye size={18} />
              <span>See Details</span>
            </button>
          </Link>

          <button
            onClick={() => addToCartHandler(data)}
            className="w-full sm:w-auto px-6 py-3 sm:py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <HiOutlineShoppingCart size={18} />
            <span>Add To Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
