import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import ShopInfo from "../../components/Shop/ShopInfo";
import ShopProfileData from "../../components/Shop/ShopProfileData";
import { HiOutlineChevronRight } from "react-icons/hi2";

const ShopPreviewPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-Poppins selection:bg-indigo-500 selection:text-white">
      <Header />

      {/* Storefront Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Link to="/" className="hover:text-indigo-600 transition-colors">
            Home
          </Link>
          <HiOutlineChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/products" className="hover:text-indigo-600 transition-colors">
            Stores & Marketplace
          </Link>
          <HiOutlineChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">Store Profile</span>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Store Profile & Trust Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <ShopInfo isOwner={false} />
          </div>

          {/* Right Column: Catalog, Flash Deals & Reviews */}
          <div className="lg:col-span-8 min-w-0">
            <ShopProfileData isOwner={false} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShopPreviewPage;