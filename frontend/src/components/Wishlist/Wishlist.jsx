import React from "react";
import { RxCross1 } from "react-icons/rx";
import { IoHeartOutline, IoCartOutline, IoTrashOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
    toast.info("Item removed from wishlist");
  };

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      const newData = { ...data, qty: 1 };
      dispatch(addTocart(newData));
      toast.success("Item added to cart!");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex justify-end transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpenWishlist(false);
      }}
    >
      <div className="w-full sm:w-[420px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden relative border-l border-slate-100 transform transition-transform duration-300">
        
        {/* Wishlist Header */}
        <div className="p-5 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
              <IoHeartOutline size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Your Saved Wishlist</h2>
              <span className="text-xs font-semibold text-pink-500">
                {wishlist ? wishlist.length : 0} {wishlist && wishlist.length === 1 ? "item saved" : "items saved"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpenWishlist(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <RxCross1 size={18} />
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!wishlist || wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-pink-50 text-pink-400 flex items-center justify-center mb-4 animate-bounce-slow">
                <IoHeartOutline size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Your wishlist is empty</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs">
                Explore items you love and click the heart icon to save them for later!
              </p>
              <button
                onClick={() => setOpenWishlist(false)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
              >
                Explore Products
              </button>
            </div>
          ) : (
            wishlist.map((item, index) => (
              <WishlistSingle
                key={item._id || index}
                data={item}
                addToCartHandler={addToCartHandler}
                removeFromWishlistHandler={removeFromWishlistHandler}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
};

const WishlistSingle = ({ data, addToCartHandler, removeFromWishlistHandler }) => {
  const itemPrice = Number(data.discountPrice) || Number(data.originalPrice) || 0;

  return (
    <div className="bg-slate-50/70 hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-100 transition-colors flex items-center gap-3 relative group">
      {/* Product Image */}
      <img
        src={`${data?.images && data?.images[0]?.url}`}
        alt={data.name}
        className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-slate-100 flex-shrink-0"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-indigo-600 transition-colors">
          {data.name}
        </h4>
        <div className="text-xs font-extrabold text-indigo-600 mt-1">
          ${itemPrice.toFixed(2)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => addToCartHandler(data)}
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-sm hover:scale-105 transition-all"
          title="Move to cart"
        >
          <IoCartOutline size={18} />
        </button>

        <button
          onClick={() => removeFromWishlistHandler(data)}
          className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
          title="Remove item"
        >
          <IoTrashOutline size={18} />
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
