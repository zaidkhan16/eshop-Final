import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { HiOutlineShoppingBag, HiCheckBadge, HiFire, HiOutlineShare } from "react-icons/hi2";
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import CountDown from "./CountDown";
import ProductDetailsCard from "../Route/ProductDetailsCard/ProductDetailsCard";

const EventGridCard = ({ data }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data?._id]);

  if (!data) return null;

  const removeFromWishlistHandler = (e) => {
    e.stopPropagation();
    setClick(false);
    dispatch(removeFromWishlist(data));
    toast.info("Removed from wishlist");
  };

  const addToWishlistHandler = (e) => {
    e.stopPropagation();
    setClick(true);
    dispatch(addToWishlist(data));
    toast.success("Saved to your wishlist!");
  };

  const addToCartHandler = (e) => {
    e.stopPropagation();
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limit reached!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Added event item to cart!");
      }
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/product/${data._id}?isEvent=true`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      toast.success("Event deal link copied to clipboard!");
    } else {
      toast.info("Deal URL: " + url);
    }
  };

  const discountPercent =
    data.originalPrice && data.discountPrice && data.originalPrice > data.discountPrice
      ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
      : null;

  const savingsAmount =
    data.originalPrice && data.discountPrice && data.originalPrice > data.discountPrice
      ? (data.originalPrice - data.discountPrice).toFixed(0)
      : null;

  // Stock / Claim calculation
  const totalStock = (data.sold_out || 15) + (data.stock || 5);
  const claimedPercent = Math.min(Math.round(((data.sold_out || 15) / totalStock) * 100), 96);

  const productUrl = `/product/${data._id}?isEvent=true`;

  const handleCardClick = (e) => {
    if (e.target.closest("button") || e.target.closest("a") || open) {
      return;
    }
    navigate(productUrl);
  };

  const imageUrl =
    data?.images && data.images[0]?.url && !data.images[0]?.url.includes("startech.com.bd")
      ? data.images[0].url
      : data?.image_Url && data.image_Url[0]?.url && !data.image_Url[0]?.url.includes("startech.com.bd")
      ? data.image_Url[0].url
      : "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80";

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-indigo-400 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-500 p-4 sm:p-5 flex flex-col justify-between overflow-hidden cursor-pointer"
      >
        {/* Top Decorative Flare */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />

        {/* Top Action Bar & Discount Badge */}
        <div className="flex items-center justify-between z-10 mb-2">
          {discountPercent ? (
            <div className="flex items-center gap-1.5">
              <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-black text-[10px] sm:text-[11px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider flex items-center gap-1">
                <HiFire className="w-3 h-3 text-amber-200 animate-bounce" />
                <span>-{discountPercent}%</span>
              </span>
              {savingsAmount && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 hidden sm:inline-block">
                  Save ${savingsAmount}
                </span>
              )}
            </div>
          ) : (
            <span className="bg-slate-900 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider">
              Flash Deal
            </span>
          )}

          {/* Floating Action Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="w-8 h-8 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 flex items-center justify-center border border-slate-100 transition-colors"
              title="Share deal"
            >
              <HiOutlineShare className="w-4 h-4" />
            </button>

            {click ? (
              <button
                onClick={removeFromWishlistHandler}
                className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center border border-pink-100 hover:scale-110 active:scale-95 transition-all shadow-xs"
                title="Remove from wishlist"
              >
                <AiFillHeart className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={addToWishlistHandler}
                className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-pink-500 flex items-center justify-center border border-slate-200 hover:scale-110 active:scale-95 transition-all shadow-xs"
                title="Save to wishlist"
              >
                <AiOutlineHeart className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpen(true);
              }}
              className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-indigo-600 flex items-center justify-center border border-slate-200 hover:scale-110 active:scale-95 transition-all shadow-xs"
              title="Quick view"
            >
              <AiOutlineEye className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Image Box */}
        <Link to={productUrl} className="block relative my-2">
          <div className="w-full h-[160px] sm:h-[190px] rounded-2xl bg-gradient-to-b from-slate-50 via-slate-50/50 to-indigo-50/20 flex items-center justify-center p-3 sm:p-4 overflow-hidden border border-slate-100 group-hover:border-indigo-100 transition-colors">
            <img
              src={imageUrl}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80";
              }}
              alt={data.name || "Event Item"}
              className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-700 ease-out filter drop-shadow-md"
            />
          </div>

          {/* Floating Live Countdown overlay */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-center pointer-events-none">
            <CountDown data={data} size="compact" showPulse={true} />
          </div>
        </Link>

        {/* Card Content & Meta */}
        <div className="space-y-1.5 mt-2">
          {/* Shop Name */}
          <div className="flex items-center justify-between">
            <Link
              to={`/shop/preview/${data?.shop?._id || data?.shopId}`}
              className="text-[10px] sm:text-[11px] font-extrabold text-indigo-600 hover:text-indigo-700 tracking-wider uppercase inline-flex items-center gap-1 line-clamp-1"
            >
              <HiOutlineShoppingBag className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>{data?.shop?.name || "Official Merchant"}</span>
              <HiCheckBadge className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            </Link>

            {data.category && (
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-md">
                {data.category}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={productUrl}>
            <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug hover:text-indigo-600 transition-colors line-clamp-2 min-h-[36px]">
              {data.name}
            </h3>
          </Link>

          {/* Stock Scarcity Claim Meter */}
          <div className="pt-1.5">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold mb-1">
              <span className="text-rose-600 flex items-center gap-0.5">
                <HiFire className="w-3.5 h-3.5" />
                <span>{claimedPercent}% Claimed</span>
              </span>
              <span className="text-slate-500">
                {data.stock > 0 ? `${data.stock} left` : "Selling Fast"}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="event-shimmer-bar h-full rounded-full transition-all duration-1000"
                style={{ width: `${claimedPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pricing & CTA Button */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
              Deal Price
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                ${data.discountPrice || data.originalPrice}
              </span>
              {data.originalPrice && data.discountPrice < data.originalPrice && (
                <span className="text-[11px] sm:text-xs text-slate-400 font-semibold line-through">
                  ${data.originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={addToCartHandler}
            className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-300"
            title="Claim deal"
          >
            <AiOutlineShoppingCart className="w-3.5 h-3.5 text-indigo-300" />
            <span>Claim</span>
          </button>
        </div>
      </div>

      {open && <ProductDetailsCard setOpen={setOpen} data={data} />}
    </>
  );
};

export default EventGridCard;
