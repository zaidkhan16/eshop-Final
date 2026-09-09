import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlineRectangleStack,
  HiOutlinePlusCircle,
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlineBanknotes,
  HiOutlineChatBubbleLeftRight,
  HiOutlineTicket,
  HiOutlineArrowPathRoundedSquare,
  HiOutlineCog6Tooth,
  HiOutlineBuildingStorefront,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

const DashboardSideBar = ({ active }) => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const pendingOrdersCount = orders ? orders.filter((o) => o.status === "Processing" || o.status === "Transferred to delivery partner").length : 0;
  const refundsCount = orders ? orders.filter((o) => o.status === "Processing refund").length : 0;
  const availableBalance = seller?.availableBalance ? Number(seller.availableBalance).toFixed(2) : "0.00";

  const navigationSections = [
    {
      title: "Overview",
      items: [
        {
          id: 1,
          name: "Dashboard",
          to: "/dashboard",
          icon: HiOutlineSquares2X2,
        },
      ],
    },
    {
      title: "Orders & Sales",
      items: [
        {
          id: 2,
          name: "All Orders",
          to: "/dashboard-orders",
          icon: HiOutlineShoppingBag,
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : null,
          badgeColor: "bg-emerald-500 text-slate-950",
        },
        {
          id: 10,
          name: "Refunds",
          to: "/dashboard-refunds",
          icon: HiOutlineArrowPathRoundedSquare,
          badge: refundsCount > 0 ? refundsCount : null,
          badgeColor: "bg-rose-500 text-white",
        },
      ],
    },
    {
      title: "Store Catalog",
      items: [
        {
          id: 3,
          name: "All Products",
          to: "/dashboard-products",
          icon: HiOutlineRectangleStack,
          badge: products?.length ? products.length : null,
          badgeColor: "bg-slate-800 text-slate-300",
        },
        {
          id: 4,
          name: "Create Product",
          to: "/dashboard-create-product",
          icon: HiOutlinePlusCircle,
          highlight: true,
        },
        {
          id: 5,
          name: "All Events",
          to: "/dashboard-events",
          icon: HiOutlineCalendarDays,
        },
        {
          id: 6,
          name: "Create Event",
          to: "/dashboard-create-event",
          icon: HiOutlineSparkles,
        },
      ],
    },
    {
      title: "Finances & Marketing",
      items: [
        {
          id: 7,
          name: "Withdraw Money",
          to: "/dashboard-withdraw-money",
          icon: HiOutlineBanknotes,
        },
        {
          id: 9,
          name: "Discount Codes",
          to: "/dashboard-coupouns",
          icon: HiOutlineTicket,
        },
      ],
    },
    {
      title: "Shop & Settings",
      items: [
        {
          id: 8,
          name: "Shop Inbox",
          to: "/dashboard-messages",
          icon: HiOutlineChatBubbleLeftRight,
          dot: true,
        },
        {
          id: 11,
          name: "Settings",
          to: "/settings",
          icon: HiOutlineCog6Tooth,
        },
      ],
    },
  ];

  return (
    <aside className="w-full h-[calc(100vh-80px)] sticky top-20 left-0 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800/80 flex flex-col justify-between py-6 px-3 800px:px-4 overflow-y-auto custom-scrollbar select-none z-30 transition-all">
      {/* Navigation Menu Groups */}
      <div className="space-y-6">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h6 className="hidden 800px:block px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 mb-2">
              {section.title}
            </h6>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <Link
                    key={item.id}
                    to={item.to}
                    className={`group relative flex items-center justify-center 800px:justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/20 via-purple-500/15 to-transparent text-white border border-indigo-500/30 shadow-md shadow-indigo-500/10"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-indigo-400 to-purple-400" />
                    )}

                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          isActive
                            ? "text-indigo-400"
                            : item.highlight
                            ? "text-pink-400"
                            : "text-slate-400 group-hover:text-slate-200"
                        }`}
                      />
                      <span className="hidden 800px:inline-block tracking-wide">
                        {item.name}
                      </span>
                    </div>

                    {/* Right side Badge / Dot */}
                    <div className="hidden 800px:flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.dot && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Merchant Balance & Store Preview Widget */}
      <div className="mt-8 pt-4 border-t border-slate-800/80 hidden 800px:block">
        <div className="rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/60 p-3.5 shadow-xl relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <HiOutlineArrowTrendingUp className="text-emerald-400" /> Payout Balance
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
              Live
            </span>
          </div>

          <h4 className="text-lg font-black text-white tracking-tight mb-2.5">
            ${availableBalance}
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/dashboard-withdraw-money"
              className="py-1.5 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 font-bold text-[11px] text-center border border-emerald-500/30 transition-all"
            >
              Withdraw
            </Link>
            {seller?._id && (
              <Link
                to={`/shop/preview/${seller._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 font-bold text-[11px] text-center border border-slate-600/40 transition-all flex items-center justify-center gap-1"
              >
                <span>Store</span>
                <HiOutlineBuildingStorefront size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
