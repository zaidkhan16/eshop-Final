import React from "react";
import { Link } from "react-router-dom";
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
  HiOutlineReceiptRefund,
  HiOutlineCog6Tooth,
  HiOutlineBuildingStorefront,
  HiOutlineArrowTrendingUp,
} from "react-icons/hi2";

const DashboardSideBar = ({ active }) => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const pendingOrdersCount = orders
    ? orders.filter(
        (o) =>
          o.status === "Processing" ||
          o.status === "Transferred to delivery partner"
      ).length
    : 0;
  const refundsCount = orders
    ? orders.filter((o) => o.status === "Processing refund").length
    : 0;
  const availableBalance = seller?.availableBalance
    ? Number(seller.availableBalance).toFixed(2)
    : "0.00";

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
          badgeColor: "bg-emerald-100 text-emerald-800 border border-emerald-200/60",
        },
        {
          id: 10,
          name: "Refunds",
          to: "/dashboard-refunds",
          icon: HiOutlineReceiptRefund,
          badge: refundsCount > 0 ? refundsCount : null,
          badgeColor: "bg-rose-100 text-rose-800 border border-rose-200/60",
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
          badgeColor: "bg-slate-100 text-slate-700 border border-slate-200",
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
    <aside className="w-full h-[calc(100vh-80px)] sticky top-20 left-0 bg-white/90 backdrop-blur-md border-r border-slate-200/80 flex flex-col justify-between py-6 px-3 800px:px-4 overflow-y-auto custom-scrollbar select-none z-30 transition-all">
      {/* Navigation Menu Groups */}
      <div className="space-y-6">
        {navigationSections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h6 className="hidden 800px:block px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
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
                        ? "bg-indigo-50/90 text-indigo-700 border border-indigo-100 shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                    }`}
                  >
                    {/* Active Accent Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-gradient-to-b from-indigo-600 to-purple-600" />
                    )}

                    <div className="flex items-center gap-3">
                      <Icon
                        size={20}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          isActive
                            ? "text-indigo-600"
                            : item.highlight
                            ? "text-purple-600"
                            : "text-slate-500 group-hover:text-slate-800"
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
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor}`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.dot && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Merchant Balance Widget */}
      <div className="mt-8 pt-4 border-t border-slate-200/80 hidden 800px:block">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-white border border-indigo-100/90 p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1">
              <HiOutlineArrowTrendingUp className="text-emerald-600" /> Payout Balance
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
              Live
            </span>
          </div>

          <h4 className="text-lg font-black text-slate-900 tracking-tight mb-3">
            ${availableBalance}
          </h4>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/dashboard-withdraw-money"
              className="py-1.5 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] text-center shadow-sm transition-all"
            >
              Withdraw
            </Link>
            {seller?._id && (
              <Link
                to={`/shop/preview/${seller._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] text-center border border-slate-200 transition-all flex items-center justify-center gap-1"
              >
                <span>Store</span>
                <HiOutlineBuildingStorefront size={13} className="text-emerald-600" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSideBar;
