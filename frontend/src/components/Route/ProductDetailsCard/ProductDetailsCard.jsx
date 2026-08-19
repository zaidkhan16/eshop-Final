import React, { useEffect, useState } from "react";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  //   const [select, setSelect] = useState(false);

  const handleMessageSubmit = () => {};

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl relative p-4 sm:p-8 border border-slate-100">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 z-50 p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              aria-label="Close modal"
            >
              <RxCross1 size={20} />
            </button>

            <div className="grid grid-cols-1 800px:grid-cols-2 gap-6 sm:gap-8 items-start pt-4 sm:pt-0">
              {/* Product Image & Shop Details */}
              <div className="flex flex-col gap-4">
                <div className="w-full h-[240px] sm:h-[320px] bg-slate-50 rounded-2xl flex items-center justify-center p-4 border border-slate-100 overflow-hidden">
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
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Link to={`/shop/preview/${data.shop?._id}`} className="flex items-center gap-3">
                    <img
                      src={
                        data?.shop?.avatar?.url ||
                        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop"
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop";
                      }}
                      alt={data.shop?.name || "Shop"}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        {data.shop?.name || "Official Store"}
                      </h3>
                      <h5 className="text-[11px] text-slate-500 font-medium">{data?.ratings || 5} ⭐ Ratings</h5>
                    </div>
                  </Link>

                  <button
                    onClick={handleMessageSubmit}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Message</span>
                    <AiOutlineMessage size={14} />
                  </button>
                </div>
              </div>

              {/* Product Details & Actions */}
              <div className="flex flex-col justify-between h-full space-y-4">
                <div>
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 leading-snug mb-2">
                    {data.name}
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-4 mb-4">
                    {data.description}
                  </p>

                  <div className="flex items-baseline gap-2 py-3 border-y border-slate-100">
                    <span className="text-2xl sm:text-3xl font-black text-indigo-600">
                      ${data.discountPrice || data.originalPrice}
                    </span>
                    {data.originalPrice && data.discountPrice < data.originalPrice ? (
                      <span className="text-sm sm:text-base text-slate-400 font-medium line-through">
                        ${data.originalPrice}
                      </span>
                    ) : null}
                    <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                      {data?.sold_out || 0} Sold
                    </span>
                  </div>
                </div>

                {/* Quantity & Wishlist */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Quantity</span>
                    <div className="flex items-center border border-slate-200 rounded-2xl overflow-hidden bg-slate-50">
                      <button
                        className="px-3.5 py-2 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                        onClick={decrementCount}
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-sm font-extrabold text-slate-900">
                        {count}
                      </span>
                      <button
                        className="px-3.5 py-2 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                        onClick={incrementCount}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Add to Cart & Wishlist Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
                      onClick={() => addToCartHandler(data._id)}
                    >
                      <AiOutlineShoppingCart size={18} />
                      <span>Add To Cart</span>
                    </button>

                    {click ? (
                      <button
                        onClick={() => removeFromWishlistHandler(data)}
                        className="p-3.5 rounded-2xl bg-pink-50 text-pink-500 border border-pink-200 shadow-sm hover:scale-105 transition-transform"
                        title="Remove from wishlist"
                      >
                        <AiFillHeart size={20} />
                      </button>
                    ) : (
                      <button
                        onClick={() => addToWishlistHandler(data)}
                        className="p-3.5 rounded-2xl bg-slate-50 text-slate-600 border border-slate-200 shadow-sm hover:text-pink-500 hover:scale-105 transition-all"
                        title="Add to wishlist"
                      >
                        <AiOutlineHeart size={20} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
