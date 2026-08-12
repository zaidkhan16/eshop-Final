import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import LuminaLogo from "./LuminaLogo";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-300 text-xs py-2 px-4 hidden 800px:block border-b border-indigo-500/10">
        <div className={`${styles.section} flex justify-between items-center`}>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              ⚡ Flash Deal
            </span>
            <span>Free Express Shipping on orders over $99 — Use Code: <strong className="text-white">LUMINA10</strong></span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link to="/faq" className="hover:text-white transition-colors">Help Center</Link>
            <Link to="/order/track" className="hover:text-white transition-colors">Track Order</Link>
            <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`} className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold">
              {isSeller ? "Seller Dashboard" : "Become a Seller"} →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Desktop */}
      <div className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-100 shadow-xs">
        <div className={`${styles.section}`}>
          <div className="hidden 800px:h-[76px] 800px:flex items-center justify-between gap-8 py-3">
            {/* Logo */}
            <div>
              <LuminaLogo />
            </div>

            {/* Search Box */}
            <div className="w-[45%] relative">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search products, brands and categories..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-[46px] w-full pl-4 pr-12 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200"
                />
                <button className="absolute right-1.5 p-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl hover:opacity-95 transition-opacity">
                  <AiOutlineSearch size={18} />
                </button>
              </div>

              {searchData && searchData.length !== 0 ? (
                <div className="absolute top-[52px] left-0 w-full bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 p-3 max-h-[60vh] overflow-y-auto">
                  {searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`} key={index} onClick={() => setSearchTerm("")}>
                        <div className="w-full flex items-center p-2.5 hover:bg-indigo-50/60 rounded-xl transition-colors gap-3 group">
                          <img
                            src={`${i.images[0]?.url}`}
                            alt=""
                            className="w-[44px] h-[44px] rounded-lg object-cover bg-slate-100"
                          />
                          <div className="flex flex-col">
                            <h1 className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{i.name}</h1>
                            <span className="text-xs font-bold text-indigo-600">${i.discountPrice || i.originalPrice}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>

            {/* Seller Action & Navigation Icons */}
            <div className="flex items-center gap-4">
              <Link
                to={`${isSeller ? "/dashboard" : "/shop-create"}`}
                className="hidden xl:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 shadow-sm transition-all"
              >
                <span>{isSeller ? "Seller Portal" : "Start Selling"}</span>
                <IoIosArrowForward size={14} className="text-indigo-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Category & Nav Bar */}
        <div
          className={`${
            active === true ? "shadow-md fixed top-0 left-0 z-40 bg-slate-900/95 backdrop-blur-md" : "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900"
          } transition-all duration-300 hidden 800px:flex items-center justify-between w-full h-[60px] border-t border-white/10`}
        >
          <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
            {/* All Categories Dropdown */}
            <div onClick={() => setDropDown(!dropDown)}>
              <div className="relative h-[60px] w-[250px] hidden 1000px:block">
                <button
                  className={`h-full w-full flex justify-between items-center px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-t-xl transition-colors cursor-pointer`}
                >
                  <span className="flex items-center gap-2">
                    <BiMenuAltLeft size={22} />
                    All Categories
                  </span>
                  <IoIosArrowDown size={18} className={`transition-transform duration-200 ${dropDown ? "rotate-180" : ""}`} />
                </button>
                {dropDown ? (
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown}
                  />
                ) : null}
              </div>
            </div>

            {/* Nav items */}
            <div className={`${styles.noramlFlex}`}>
              <Navbar active={activeHeading} />
            </div>

            {/* Icons Action Area */}
            <div className="flex items-center gap-5">
              {/* Wishlist Icon */}
              <div
                className="relative cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setOpenWishlist(true)}
                title="Wishlist"
              >
                <AiOutlineHeart size={24} className="text-white" />
                <span className="absolute -top-0.5 -right-0.5 rounded-full bg-pink-500 w-5 h-5 flex items-center justify-center text-white font-bold text-[11px] shadow-xs">
                  {wishlist && wishlist.length}
                </span>
              </div>

              {/* Cart Icon */}
              <div
                className="relative cursor-pointer p-2 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setOpenCart(true)}
                title="Shopping Cart"
              >
                <AiOutlineShoppingCart size={24} className="text-white" />
                <span className="absolute -top-0.5 -right-0.5 rounded-full bg-emerald-500 w-5 h-5 flex items-center justify-center text-white font-bold text-[11px] shadow-xs">
                  {cart && cart.length}
                </span>
              </div>

              {/* User Profile */}
              <div className="flex items-center pl-2 border-l border-white/15">
                {isAuthenticated ? (
                  <Link to="/profile" className="flex items-center gap-2 group">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[36px] h-[36px] rounded-full object-cover ring-2 ring-indigo-500/50 group-hover:ring-indigo-400 transition-all"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login" className="flex items-center gap-2 text-white hover:text-indigo-300 text-sm font-semibold transition-colors px-2 py-1">
                    <CgProfile size={22} />
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>

            {/* Cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* Wishlist popup */}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

      {/* Mobile Header Bar */}
      <div
        className={`${
          active === true ? "shadow-md fixed top-0 left-0 z-50 bg-white/95 backdrop-blur-md" : "bg-white"
        } w-full h-[64px] z-50 top-0 left-0 border-b border-slate-100 800px:hidden px-4 flex items-center justify-between`}
      >
        <button
          onClick={() => setOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-800"
        >
          <BiMenuAltLeft size={28} />
        </button>

        <LuminaLogo />

        <div className="flex items-center gap-2">
          <div
            className="relative cursor-pointer p-2 text-slate-800"
            onClick={() => setOpenCart(true)}
          >
            <AiOutlineShoppingCart size={24} />
            <span className="absolute top-0 right-0 rounded-full bg-emerald-500 w-4 h-4 flex items-center justify-center text-white font-bold text-[10px]">
              {cart && cart.length}
            </span>
          </div>
        </div>

        {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
        {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 800px:hidden">
          <div className="fixed inset-y-0 left-0 w-[85%] max-w-[340px] bg-white shadow-2xl z-50 overflow-y-auto flex flex-col justify-between p-5">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <LuminaLogo />
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
                >
                  <RxCross1 size={20} />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="my-5 relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="h-[42px] w-full px-3 pl-9 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <AiOutlineSearch size={18} className="absolute left-3 top-3 text-slate-400" />
                {searchData && (
                  <div className="absolute bg-white z-50 shadow-xl border border-slate-100 rounded-xl w-full left-0 mt-1 p-2 max-h-[40vh] overflow-y-auto">
                    {searchData.map((i, idx) => (
                      <Link to={`/product/${i._id}`} key={idx} onClick={() => { setOpen(false); setSearchTerm(""); }}>
                        <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg">
                          <img src={i.images[0]?.url} alt="" className="w-8 h-8 rounded object-cover" />
                          <span className="text-xs font-medium text-slate-800 line-clamp-1">{i.name}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Items */}
              <Navbar active={activeHeading} />

              <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-3">
                <div
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl cursor-pointer"
                  onClick={() => { setOpenWishlist(true); setOpen(false); }}
                >
                  <AiOutlineHeart size={22} className="text-pink-500" />
                  <span className="text-sm font-semibold text-slate-800">Wishlist ({wishlist?.length || 0})</span>
                </div>

                <Link
                  to="/shop-create"
                  onClick={() => setOpen(false)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md shadow-indigo-500/20"
                >
                  <span>Become a Seller</span>
                  <IoIosArrowForward size={16} />
                </Link>
              </div>
            </div>

            {/* Mobile User Profile Footer */}
            <div className="pt-6 border-t border-slate-100">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl"
                >
                  <img
                    src={`${user?.avatar?.url}`}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">{user?.name}</span>
                    <span className="text-xs text-slate-500">View Profile</span>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-sm"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
