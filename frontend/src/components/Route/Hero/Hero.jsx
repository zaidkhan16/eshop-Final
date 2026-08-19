import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import { IoIosArrowForward } from "react-icons/io";
import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineTruck } from "react-icons/hi";

const Hero = () => {
  return (
    <div className="relative min-h-[65vh] 800px:min-h-[85vh] w-full bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center overflow-hidden py-8 sm:py-12 800px:py-0">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className={`${styles.section} relative z-10 w-full`}>
        <div className="grid grid-cols-1 800px:grid-cols-12 gap-8 items-center">
          
          {/* Left Content Column */}
          <div className="800px:col-span-7 flex flex-col items-start text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] sm:text-xs font-bold tracking-wide uppercase mb-4 sm:mb-6 backdrop-blur-md">
              <HiOutlineSparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span>Next-Gen E-Commerce Experience</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] sm:leading-[1.1] mb-4 sm:mb-6">
              Elevate Your Everyday <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-pink-400 bg-clip-text text-transparent">
                With Nexus Next-Gen Market.
              </span>
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-lg font-normal leading-relaxed max-w-xl mb-6 sm:mb-8">
              Explore curated premium collections, trending tech, luxury fashion, and exclusive daily flash sales with guaranteed fast express delivery.
            </p>

            {/* Mobile Feature Visual Banner */}
            <div className="w-full 800px:hidden mb-6 relative rounded-2xl overflow-hidden shadow-xl border border-white/15">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200"
                alt="Nexus Feature"
                className="w-full h-[180px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                <div>
                  <span className="px-2.5 py-0.5 bg-indigo-600 text-white font-bold text-[10px] rounded-full uppercase tracking-wider">Featured</span>
                  <h3 className="text-white text-sm font-bold mt-1">Spring & Summer Trends</h3>
                </div>
                <span className="px-2.5 py-1 bg-white/90 text-slate-900 font-extrabold text-xs rounded-xl shadow-md">Up to 50% OFF</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-8 sm:mb-10 w-full sm:w-auto">
              <Link to="/products" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 group transition-all duration-300 transform hover:-translate-y-0.5">
                  <span>Explore Shop</span>
                  <IoIosArrowForward className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>

              <Link to="/events" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-sm sm:text-base rounded-2xl border border-white/20 backdrop-blur-md transition-all duration-300">
                  Daily Offers & Events
                </button>
              </Link>
            </div>

            {/* Trust Highlights Bar */}
            <div className="pt-4 sm:pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-slate-300 text-[11px] sm:text-xs font-semibold w-full">
              <div className="flex items-center gap-2">
                <HiOutlineTruck className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
                <span>Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <HiOutlineShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0" />
                <span>100% Authentic</span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping shrink-0"></span>
                <span>50,000+ Customers</span>
              </div>
            </div>
          </div>

          {/* Right Image Feature Card Column (Desktop) */}
          <div className="800px:col-span-5 relative hidden 800px:flex justify-center items-center">
            <div className="relative w-full max-w-md">
              {/* Glassmorphic Main Image Frame */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
                <img
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200"
                  alt="Nexus Next-Gen Market Feature"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="px-3 py-1 bg-indigo-600 text-white font-bold text-xs rounded-full uppercase tracking-wider">Featured Collection</span>
                  <h3 className="text-white text-xl font-bold mt-2">Spring & Summer Trends</h3>
                </div>
              </div>

              {/* Floating Discount Pill Badge */}
              <div className="absolute -top-6 -left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 animate-bounce-slow">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-500 to-violet-600 flex items-center justify-center text-white font-black text-lg">
                  50%
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500 font-medium">Limited Deal</span>
                  <span className="text-sm font-bold text-slate-900">Up to 50% OFF</span>
                </div>
              </div>

              {/* Floating Verified Badge */}
              <div className="absolute -bottom-6 -right-6 bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-indigo-500/30 flex items-center gap-3 text-white">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  ✓
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Guaranteed</span>
                  <span className="text-xs font-bold text-slate-100">Top Verified Sellers</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;
