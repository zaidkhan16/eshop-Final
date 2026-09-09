import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import {
  HiOutlineBuildingStorefront,
  HiOutlinePencilSquare,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const ShopHomePage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-Poppins selection:bg-indigo-500 selection:text-white">
      {/* Seller Top Bar Notification */}
      <div className="bg-slate-900 text-white text-xs py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">
              You are currently viewing your <strong>Live Storefront Profile</strong> as visible to buyers.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all text-[11px] font-semibold"
            >
              <HiOutlinePencilSquare className="w-3.5 h-3.5" />
              <span>Edit Store Details</span>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all text-[11px] font-bold"
            >
              <HiOutlineBuildingStorefront className="w-3.5 h-3.5" />
              <span>Seller Dashboard</span>
            </Link>
          </div>
        </div>
      </div>

      <Header />

      {/* Main Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
            Seller Dashboard
          </Link>
          <HiOutlineChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">My Public Storefront</span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Store Profile */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <ShopInfo isOwner={true} />
          </div>

          {/* Right Column: Products, Deals, and Reviews */}
          <div className="lg:col-span-8 min-w-0">
            <ShopProfileData isOwner={true} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopHomePage;