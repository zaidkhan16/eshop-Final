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
      className={`w-full bg-white rounded-3xl border border-slate-100 shadow-xl p-6 sm:p-8 ${
        active ? "" : "mb-12"
      } grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden group`}
    >
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Left Column Image Showcase */}
      <div className="lg:col-span-5 flex justify-center items-center relative">
        <div className="w-full h-[280px] sm:h-[340px] bg-slate-50 rounded-2xl flex items-center justify-center p-4 relative overflow-hidden border border-slate-100">
          {discountPercent ? (
            <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-xs px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
              SAVE {discountPercent}%
            </span>
          ) : null}

          <img
            src={`${data.images && data.images[0]?.url}`}
            alt={data.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
          />
        </div>
      </div>

      {/* Right Column Content */}
      <div className="lg:col-span-7 flex flex-col justify-center text-left">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold w-fit mb-3">
          <HiOutlineSparkles className="w-4 h-4 animate-pulse" />
          <span>Special Event Offer</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
          {data.name}
        </h2>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {data.description}
        </p>

        {/* Price & Sold */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-3 border-y border-slate-100 my-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-indigo-600">
              ${data.discountPrice || data.originalPrice}
            </span>
            {data.originalPrice && data.discountPrice < data.originalPrice ? (
              <span className="text-base text-slate-400 font-medium line-through">
                ${data.originalPrice}
              </span>
            ) : null}
          </div>

          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            🔥 {data.sold_out || 0} Products Claimed
          </span>
        </div>

        {/* Countdown */}
        <CountDown data={data} />

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <Link to={`/product/${data._id}?isEvent=true`} className="flex-1 sm:flex-initial">
            <button className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition-all">
              <HiOutlineEye size={18} />
              <span>See Details</span>
            </button>
          </Link>

          <button
            onClick={() => addToCartHandler(data)}
            className="flex-1 sm:flex-initial px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
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
