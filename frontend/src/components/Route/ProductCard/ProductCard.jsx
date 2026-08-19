import React, { useState, useEffect } from "react";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import { toast } from "react-toastify";
import { HiOutlineShoppingBag, HiCheckBadge } from "react-icons/hi2";

const ProductCard = ({ data, isEvent }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
    toast.info("Removed from wishlist");
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
    toast.success("Added to wishlist!");
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart!");
      }
    }
  };

  const discountPercent =
    data.originalPrice && data.discountPrice && data.originalPrice > data.discountPrice
      ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
      : null;

  return (
    <>
      <div className="w-full bg-white rounded-3xl border border-slate-200/70 shadow-xs hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 hover:border-indigo-300/80 transition-all duration-500 p-3.5 sm:p-5 relative cursor-pointer flex flex-col justify-between group overflow-hidden">
        
        {/* Top Badges & Action Bar */}
        <div className="flex items-center justify-between absolute top-3 inset-x-3 sm:top-4 sm:inset-x-4 z-10 pointer-events-none">
          {/* Discount Badge */}
          {discountPercent ? (
            <span className="pointer-events-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-[9px] sm:text-[10px] px-2.5 py-1 sm:px-3 sm:py-1 rounded-full shadow-lg uppercase tracking-widest backdrop-blur-md border border-white/20">
              -{discountPercent}% OFF
            </span>
          ) : (
            <div></div>
          )}

          {/* Floating Luxury Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
            {click ? (
              <button
                onClick={() => removeFromWishlistHandler(data)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-pink-50 text-pink-500 shadow-md border border-pink-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Remove from wishlist"
              >
                <AiFillHeart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={() => addToWishlistHandler(data)}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white/90 backdrop-blur-md text-slate-400 hover:text-pink-500 shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
                title="Add to wishlist"
              >
                <AiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            
            <button
              onClick={() => setOpen(!open)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white/90 backdrop-blur-md text-slate-400 hover:text-indigo-600 shadow-md border border-slate-100 flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
              title="Quick view"
            >
              <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Product Image Stage */}
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <div className="w-full h-[140px] sm:h-[190px] rounded-2xl bg-gradient-to-b from-slate-50/90 via-slate-50/40 to-indigo-50/20 flex items-center justify-center p-3 sm:p-5 overflow-hidden relative mb-3 border border-slate-100/80 group-hover:border-indigo-100 transition-colors">
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
              alt={data.name || "Product"}
              className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-700 ease-out filter drop-shadow-md"
            />
          </div>
        </Link>

        {/* Product Meta */}
        <div className="space-y-1">
          {/* Shop Name & Verification */}
          <Link to={`/shop/preview/${data?.shop?._id}`}>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-indigo-600 hover:text-indigo-700 tracking-wider uppercase inline-flex items-center gap-1 line-clamp-1">
              <HiOutlineShoppingBag className="w-3.5 h-3.5 shrink-0 text-indigo-500" />
              <span>{data?.shop?.name || "Official Store"}</span>
              <HiCheckBadge className="w-3.5 h-3.5 text-blue-500 inline shrink-0" title="Verified Seller" />
            </span>
          </Link>

          {/* Title */}
          <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
            <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm leading-snug hover:text-indigo-600 transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px] tracking-tight">
              {data.name}
            </h4>
          </Link>
        </div>

        {/* Stock & Sales Highlight (No Review Stars) */}
        <div className="flex items-center justify-between my-2 sm:my-2.5">
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 bg-slate-100/80 px-2.5 py-0.5 rounded-full border border-slate-200/60">
            {data?.stock > 0 ? `${data.stock} in stock` : "Limited Edition"}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            🔥 {data?.sold_out || 0} Sold
          </span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2.5 sm:pt-3 border-t border-slate-100/80 flex items-center justify-between mt-auto gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider hidden sm:block">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
                ${data.discountPrice || data.originalPrice}
              </span>
              {data.originalPrice && data.discountPrice < data.originalPrice ? (
                <span className="text-[11px] sm:text-xs text-slate-400 font-semibold line-through">
                  ${data.originalPrice}
                </span>
              ) : null}
            </div>
          </div>

          <button
            onClick={() => addToCartHandler(data._id)}
            className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 hover:from-indigo-600 hover:to-violet-600 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-md hover:shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all duration-300 shrink-0"
            title="Add to cart"
          >
            <AiOutlineShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-300" />
            <span>Add</span>
          </button>
        </div>

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </>
  );
};

export default ProductCard;
