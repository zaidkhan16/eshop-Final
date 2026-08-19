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
import Ratings from "../../Products/Ratings";
import { HiOutlineShoppingBag } from "react-icons/hi";

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
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-indigo-100 transition-all duration-300 p-3 sm:p-4 relative cursor-pointer flex flex-col justify-between group overflow-hidden">
        
        {/* Top Badges & Action Bar */}
        <div className="flex items-center justify-between absolute top-2.5 inset-x-2.5 sm:top-4 sm:inset-x-4 z-10 pointer-events-none">
          {/* Discount Badge */}
          {discountPercent ? (
            <span className="pointer-events-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-md uppercase tracking-wider">
              -{discountPercent}%
            </span>
          ) : (
            <div></div>
          )}

          {/* Floating Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5">
            {click ? (
              <button
                onClick={() => removeFromWishlistHandler(data)}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-pink-50 text-pink-500 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                title="Remove from wishlist"
              >
                <AiFillHeart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            ) : (
              <button
                onClick={() => addToWishlistHandler(data)}
                className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-pink-500 shadow-md flex items-center justify-center hover:scale-110 transition-all"
                title="Add to wishlist"
              >
                <AiOutlineHeart className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
            
            <button
              onClick={() => setOpen(!open)}
              className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-indigo-600 shadow-md flex items-center justify-center hover:scale-110 transition-all"
              title="Quick view"
            >
              <AiOutlineEye className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Product Image Stage */}
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <div className="w-full h-[130px] sm:h-[180px] rounded-2xl bg-gradient-to-b from-slate-50/80 to-indigo-50/30 flex items-center justify-center p-2.5 sm:p-4 overflow-hidden relative mb-2 sm:mb-3 border border-slate-100/60">
            <img
              src={`${data.images && data.images[0]?.url}`}
              alt={data.name}
              className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-md"
            />
          </div>
        </Link>

        {/* Product Meta */}
        <div className="space-y-0.5 sm:space-y-1">
          {/* Shop Name */}
          <Link to={`/shop/preview/${data?.shop?._id}`}>
            <span className="text-[10px] sm:text-[11px] font-extrabold text-indigo-600 hover:text-indigo-700 tracking-wider uppercase inline-flex items-center gap-1 line-clamp-1">
              <HiOutlineShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              {data?.shop?.name || "Official Store"}
            </span>
          </Link>

          {/* Title */}
          <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug hover:text-indigo-600 transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px]">
              {data.name}
            </h4>
          </Link>
        </div>

        {/* Ratings & Sales Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 sm:gap-0 my-2 sm:my-2.5">
          <Ratings rating={data?.ratings} />
          <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            🔥 {data?.sold_out || 0} Sold
          </span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between mt-auto gap-1">
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs text-slate-400 font-medium hidden sm:inline">Price</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm sm:text-lg font-black text-indigo-600">
                ${data.discountPrice || data.originalPrice}
              </span>
              {data.originalPrice && data.discountPrice < data.originalPrice ? (
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium line-through">
                  ${data.originalPrice}
                </span>
              ) : null}
            </div>
          </div>

          <button
            onClick={() => addToCartHandler(data._id)}
            className="px-2.5 py-1.5 sm:px-3.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-[11px] sm:text-xs flex items-center gap-1 shadow-md shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all shrink-0"
            title="Add to cart"
          >
            <AiOutlineShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Add</span>
          </button>
        </div>

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </>
  );
};

export default ProductCard;
