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
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-indigo-100 transition-all duration-300 p-4 relative cursor-pointer flex flex-col justify-between group overflow-hidden">
        
        {/* Top Badges & Action Bar */}
        <div className="flex items-center justify-between absolute top-4 inset-x-4 z-10 pointer-events-none">
          {/* Discount Badge */}
          {discountPercent ? (
            <span className="pointer-events-auto bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-black text-[10px] px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
              SAVE {discountPercent}%
            </span>
          ) : (
            <div></div>
          )}

          {/* Floating Action Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            {click ? (
              <button
                onClick={() => removeFromWishlistHandler(data)}
                className="w-9 h-9 rounded-full bg-pink-50 text-pink-500 shadow-md flex items-center justify-center hover:scale-110 transition-transform"
                title="Remove from wishlist"
              >
                <AiFillHeart size={18} />
              </button>
            ) : (
              <button
                onClick={() => addToWishlistHandler(data)}
                className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-pink-500 shadow-md flex items-center justify-center hover:scale-110 transition-all"
                title="Add to wishlist"
              >
                <AiOutlineHeart size={18} />
              </button>
            )}
            
            <button
              onClick={() => setOpen(!open)}
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-500 hover:text-indigo-600 shadow-md flex items-center justify-center hover:scale-110 transition-all"
              title="Quick view"
            >
              <AiOutlineEye size={18} />
            </button>
          </div>
        </div>

        {/* Product Image Stage */}
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <div className="w-full h-[190px] rounded-2xl bg-gradient-to-b from-slate-50/80 to-indigo-50/30 flex items-center justify-center p-4 overflow-hidden relative mb-3 border border-slate-100/60">
            <img
              src={`${data.images && data.images[0]?.url}`}
              alt={data.name}
              className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-md"
            />
          </div>
        </Link>

        {/* Product Meta */}
        <div className="space-y-1">
          {/* Shop Name */}
          <Link to={`/shop/preview/${data?.shop?._id}`}>
            <span className="text-[11px] font-extrabold text-indigo-600 hover:text-indigo-700 tracking-wider uppercase inline-flex items-center gap-1">
              <HiOutlineShoppingBag className="w-3.5 h-3.5" />
              {data?.shop?.name || "Official Store"}
            </span>
          </Link>

          {/* Title */}
          <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
            <h4 className="font-bold text-slate-800 text-sm leading-snug hover:text-indigo-600 transition-colors line-clamp-2 min-h-[40px]">
              {data.name}
            </h4>
          </Link>
        </div>

        {/* Ratings & Sales Info */}
        <div className="flex items-center justify-between my-2.5">
          <Ratings rating={data?.ratings} />
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
            🔥 {data?.sold_out || 0} Sold
          </span>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 font-medium">Price</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-indigo-600">
                ${data.discountPrice || data.originalPrice}
              </span>
              {data.originalPrice && data.discountPrice < data.originalPrice ? (
                <span className="text-xs text-slate-400 font-medium line-through">
                  ${data.originalPrice}
                </span>
              ) : null}
            </div>
          </div>

          <button
            onClick={() => addToCartHandler(data._id)}
            className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/25 hover:scale-105 active:scale-95 transition-all group/btn"
            title="Add to cart"
          >
            <AiOutlineShoppingCart size={16} />
            <span>Add</span>
          </button>
        </div>

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </>
  );
};

export default ProductCard;
