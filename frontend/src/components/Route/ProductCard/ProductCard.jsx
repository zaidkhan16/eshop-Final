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
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
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
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const discountPercent =
    data.originalPrice && data.discountPrice && data.originalPrice > data.discountPrice
      ? Math.round(((data.originalPrice - data.discountPrice) / data.originalPrice) * 100)
      : null;

  return (
    <>
      <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 p-4 relative cursor-pointer flex flex-col justify-between group">
        
        {/* Discount Badge */}
        {discountPercent ? (
          <span className="absolute top-4 left-4 z-10 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
            {discountPercent}% OFF
          </span>
        ) : null}

        {/* Floating Side Quick Action Buttons */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
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
              className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-pink-500 shadow-md flex items-center justify-center hover:scale-110 transition-all"
              title="Add to wishlist"
            >
              <AiOutlineHeart size={18} />
            </button>
          )}
          
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-slate-600 hover:text-indigo-600 shadow-md flex items-center justify-center hover:scale-110 transition-all"
            title="Quick view"
          >
            <AiOutlineEye size={18} />
          </button>
        </div>

        {/* Product Image Frame */}
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <div className="w-full h-[180px] rounded-2xl bg-slate-50 flex items-center justify-center p-3 overflow-hidden relative mb-3">
            <img
              src={`${data.images && data.images[0]?.url}`}
              alt={data.name}
              className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
            />
          </div>
        </Link>

        {/* Shop Name */}
        <Link to={`/shop/preview/${data?.shop?._id}`}>
          <span className="text-[12px] font-bold text-indigo-500 hover:text-indigo-600 tracking-wide uppercase">
            {data?.shop?.name || "Verified Store"}
          </span>
        </Link>

        {/* Title */}
        <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
          <h4 className="font-bold text-slate-800 text-sm leading-snug hover:text-indigo-600 transition-colors my-1 line-clamp-2 min-h-[40px]">
            {data.name}
          </h4>
        </Link>

        {/* Ratings & Sold */}
        <div className="flex items-center justify-between my-2">
          <Ratings rating={data?.ratings} />
          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            {data?.sold_out || 0} sold
          </span>
        </div>

        {/* Price & Add to Cart Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900">
              ${data.discountPrice || data.originalPrice}
            </span>
            {data.originalPrice && data.discountPrice < data.originalPrice ? (
              <span className="text-xs text-slate-400 font-medium line-through">
                ${data.originalPrice}
              </span>
            ) : null}
          </div>

          <button
            onClick={() => addToCartHandler(data._id)}
            className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
            title="Add to cart"
          >
            <AiOutlineShoppingCart size={18} />
          </button>
        </div>

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </>
  );
};

export default ProductCard;
