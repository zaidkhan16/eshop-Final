import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineSparkles,
  HiOutlineBuildingStorefront,
  HiOutlinePlus,
  HiOutlineBell,
  HiOutlineArrowRightOnRectangle,
  HiOutlineCog6Tooth,
  HiOutlineBanknotes,
  HiOutlineCheckBadge,
  HiOutlineEnvelope,
  HiOutlineMagnifyingGlass,
  HiChevronDown,
} from "react-icons/hi2";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { AiOutlineGift } from "react-icons/ai";
import LuminaLogo from "../../Layout/LuminaLogo";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);
  const { orders } = useSelector((state) => state.order);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      localStorage.removeItem("seller_token");
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  const pendingOrdersCount = orders ? orders.filter((o) => o.status === "Processing" || o.status === "Transferred to delivery partner").length : 0;
  const availableBalance = seller?.availableBalance ? Number(seller.availableBalance).toFixed(2) : "0.00";

  return (
    <header className="w-full h-20 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 left-0 z-40 px-4 sm:px-6 lg:px-8 transition-all">
      <div className="h-full flex items-center justify-between max-w-[1800px] mx-auto gap-4">
        {/* Left: Brand & Portal Badge */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <LuminaLogo />
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Seller Studio
            </span>
          </Link>
        </div>

        {/* Center: Quick Storefront Preview / Fast Stats */}
        <div className="hidden md:flex items-center gap-3">
          {seller?._id && (
            <Link
              to={`/shop/preview/${seller._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-medium transition-all shadow-sm hover:border-slate-600 group"
            >
              <HiOutlineBuildingStorefront className="text-emerald-400 group-hover:scale-110 transition-transform" size={16} />
              <span>Live Storefront</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
            </Link>
          )}

          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400">
            <span>Available Balance:</span>
            <span className="font-bold text-emerald-400">${availableBalance}</span>
          </div>
        </div>

        {/* Right: Actions, Badges & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Product Button */}
          <Link
            to="/dashboard-create-product"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <HiOutlinePlus size={15} className="stroke-[2.5]" />
            <span>Add Product</span>
          </Link>

          {/* Quick Icon Links */}
          <div className="flex items-center gap-1 sm:gap-1.5 text-slate-400">
            {/* Orders */}
            <Link
              to="/dashboard-orders"
              className="relative p-2.5 rounded-xl hover:bg-slate-800/80 hover:text-slate-200 transition-colors"
              title="All Orders"
            >
              <FiShoppingBag size={19} />
              {pendingOrdersCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-emerald-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-pulse">
                  {pendingOrdersCount > 9 ? "9+" : pendingOrdersCount}
                </span>
              )}
            </Link>

            {/* Products */}
            <Link
              to="/dashboard-products"
              className="p-2.5 rounded-xl hover:bg-slate-800/80 hover:text-slate-200 transition-colors hidden sm:inline-flex"
              title="Inventory & Products"
            >
              <FiPackage size={19} />
            </Link>

            {/* Coupons */}
            <Link
              to="/dashboard-coupouns"
              className="p-2.5 rounded-xl hover:bg-slate-800/80 hover:text-slate-200 transition-colors hidden md:inline-flex"
              title="Promotions & Coupons"
            >
              <AiOutlineGift size={20} />
            </Link>

            {/* Inbox */}
            <Link
              to="/dashboard-messages"
              className="relative p-2.5 rounded-xl hover:bg-slate-800/80 hover:text-slate-200 transition-colors"
              title="Customer Messages"
            >
              <BiMessageSquareDetail size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
            </Link>
          </div>

          <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Seller Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-2xl hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all text-left"
            >
              <div className="relative">
                <img
                  src={seller?.avatar?.url || "https://res.cloudinary.com/demo/image/upload/v1578330767/sample.jpg"}
                  alt={seller?.name || "Seller"}
                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-emerald-500/40 shadow-md"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div className="hidden lg:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-100 max-w-[110px] truncate">
                    {seller?.name || "Merchant"}
                  </span>
                  <HiOutlineCheckBadge className="text-emerald-400 flex-shrink-0" size={14} />
                </div>
                <span className="text-[10px] font-medium text-slate-400 block leading-none mt-0.5">
                  Verified Store
                </span>
              </div>
              <HiChevronDown size={14} className={`text-slate-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-3 border-b border-slate-800/80 mb-1">
                  <p className="text-xs font-bold text-slate-100 truncate">{seller?.name}</p>
                  <p className="text-[11px] text-slate-400 truncate">{seller?.email}</p>
                  <div className="mt-2.5 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Balance:</span>
                    <span className="font-bold text-emerald-400">${availableBalance}</span>
                  </div>
                </div>

                <div className="space-y-0.5 text-xs">
                  <Link
                    to={`/shop/${seller?._id}`}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <HiOutlineBuildingStorefront size={16} className="text-emerald-400" />
                    <span>View Public Storefront</span>
                  </Link>

                  <Link
                    to="/dashboard-withdraw-money"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <HiOutlineBanknotes size={16} className="text-teal-400" />
                    <span>Withdraw Funds</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors"
                  >
                    <HiOutlineCog6Tooth size={16} className="text-indigo-400" />
                    <span>Shop Settings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors mt-1 pt-2 border-t border-slate-800/60"
                  >
                    <HiOutlineArrowRightOnRectangle size={16} />
                    <span className="font-semibold">Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
