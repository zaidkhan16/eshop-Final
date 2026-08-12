import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline, IoTrashOutline, IoCartOutline, IoArrowForward } from "react-icons/io5";
import { HiOutlineMinus, HiPlus, HiOutlineSparkles, HiOutlineTruck } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
    toast.info("Item removed from cart");
  };

  // Safe total price calculation handling missing or null discountPrice
  const totalPrice = (cart || []).reduce((acc, item) => {
    const itemPrice = Number(item.discountPrice) || Number(item.originalPrice) || 0;
    const itemQty = Number(item.qty) || 1;
    return acc + itemQty * itemPrice;
  }, 0);

  const freeShippingThreshold = 99;
  const progressToFreeShipping = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - totalPrice);

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex justify-end transition-opacity duration-300"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpenCart(false);
      }}
    >
      <div className="w-full sm:w-[450px] bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden relative border-l border-slate-100 transform transition-transform duration-300">
        
        {/* Cart Drawer Header */}
        <div className="p-5 border-b border-slate-100 bg-white/95 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <IoBagHandleOutline size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">Your Shopping Cart</h2>
              <span className="text-xs font-semibold text-indigo-600">
                {cart ? cart.length : 0} {cart && cart.length === 1 ? "item" : "items"}
              </span>
            </div>
          </div>

          <button
            onClick={() => setOpenCart(false)}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <RxCross1 size={18} />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        {cart && cart.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50 p-4 border-b border-indigo-100/60">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1.5">
              <HiOutlineTruck className="text-indigo-600 w-4 h-4" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="text-emerald-600 flex items-center gap-1">
                  🎉 Congratulations! Free Express Shipping Unlocked!
                </span>
              ) : (
                <span>
                  Add <strong className="text-indigo-600">${amountNeededForFreeShipping.toFixed(2)}</strong> more for FREE Shipping!
                </span>
              )}
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-600 to-violet-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressToFreeShipping}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!cart || cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-400 flex items-center justify-center mb-4 animate-bounce-slow">
                <IoCartOutline size={40} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Your cart is empty</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs">
                Looks like you haven't added any products to your cart yet.
              </p>
              <button
                onClick={() => setOpenCart(false)}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm rounded-2xl shadow-lg shadow-indigo-500/20 hover:scale-105 transition-all"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item, index) => (
              <CartSingle
                key={item._id || index}
                data={item}
                quantityChangeHandler={quantityChangeHandler}
                removeFromCartHandler={removeFromCartHandler}
              />
            ))
          )}
        </div>

        {/* Cart Drawer Footer / Checkout CTA */}
        {cart && cart.length > 0 && (
          <div className="p-5 bg-white border-t border-slate-100 shadow-2xl space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-emerald-600">
                  {amountNeededForFreeShipping === 0 ? "FREE" : "$9.99"}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                <span>Total Amount</span>
                <span className="text-xl text-indigo-600">${(totalPrice + (amountNeededForFreeShipping === 0 ? 0 : 9.99)).toFixed(2)}</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={() => setOpenCart(false)}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-base rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all duration-300"
            >
              <span>Proceed to Checkout</span>
              <IoArrowForward size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400 pt-1">
              <HiOutlineSparkles className="text-indigo-500" />
              <span>100% Guaranteed Safe & Secure Checkout</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const itemPrice = Number(data.discountPrice) || Number(data.originalPrice) || 0;
  const [value, setValue] = useState(data.qty || 1);
  const totalPrice = itemPrice * value;

  const increment = (item) => {
    if (item.stock && item.stock <= value) {
      toast.error("Maximum product stock limit reached!");
    } else {
      const newQty = value + 1;
      setValue(newQty);
      quantityChangeHandler({ ...item, qty: newQty });
    }
  };

  const decrement = (item) => {
    if (value > 1) {
      const newQty = value - 1;
      setValue(newQty);
      quantityChangeHandler({ ...item, qty: newQty });
    }
  };

  return (
    <div className="bg-slate-50/70 hover:bg-slate-50 p-3.5 rounded-2xl border border-slate-100 transition-colors flex items-center gap-3 relative group">
      {/* Product Image */}
      <img
        src={`${data?.images && data?.images[0]?.url}`}
        alt={data.name}
        className="w-20 h-20 object-contain rounded-xl bg-white p-1.5 border border-slate-100 flex-shrink-0"
      />

      {/* Details & Controls */}
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 hover:text-indigo-600 transition-colors">
          {data.name}
        </h4>
        <div className="text-xs text-slate-500 mt-0.5">
          ${itemPrice.toFixed(2)} each
        </div>

        <div className="flex items-center justify-between mt-2.5">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-xs">
            <button
              onClick={() => decrement(data)}
              className="w-5 h-5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors disabled:opacity-40"
              disabled={value <= 1}
            >
              <HiOutlineMinus size={12} />
            </button>
            <span className="text-xs font-bold text-slate-900 w-4 text-center">{value}</span>
            <button
              onClick={() => increment(data)}
              className="w-5 h-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors"
            >
              <HiPlus size={12} />
            </button>
          </div>

          {/* Subtotal */}
          <span className="text-sm font-extrabold text-indigo-600">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Delete Item Button */}
      <button
        onClick={() => removeFromCartHandler(data)}
        className="p-1.5 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors self-start"
        title="Remove item"
      >
        <IoTrashOutline size={18} />
      </button>
    </div>
  );
};

export default Cart;
