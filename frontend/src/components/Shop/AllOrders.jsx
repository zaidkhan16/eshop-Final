import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import {
  HiOutlineShoppingBag,
  HiOutlineMagnifyingGlass,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineArrowsUpDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowPath,
} from "react-icons/hi2";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Metrics Calculation
  const metrics = useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      return { total: 0, processing: 0, delivered: 0, revenue: 0 };
    }
    const total = orders.length;
    const processing = orders.filter(
      (o) =>
        o.status === "Processing" ||
        o.status === "Transferred to delivery partner" ||
        o.status === "Shipping" ||
        o.status === "On the way"
    ).length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const revenue = orders
      .filter((o) => o.status !== "Cancel" && o.status !== "Refund Success")
      .reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);

    return { total, processing, delivered, revenue };
  }, [orders]);

  // Filter and Sort logic
  const filteredOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];

    return orders
      .filter((order) => {
        // Status Filter
        if (statusFilter !== "All") {
          if (statusFilter === "Processing") {
            if (
              order.status !== "Processing" &&
              order.status !== "Transferred to delivery partner"
            )
              return false;
          } else if (statusFilter === "Shipping") {
            if (order.status !== "Shipping" && order.status !== "On the way")
              return false;
          } else if (statusFilter === "Delivered") {
            if (order.status !== "Delivered") return false;
          } else if (statusFilter === "Refunds") {
            if (
              order.status !== "Processing refund" &&
              order.status !== "Refund Success" &&
              order.status !== "Cancel"
            )
              return false;
          } else if (order.status !== statusFilter) {
            return false;
          }
        }

        // Search Term Filter (ID, customer name, items)
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchId = order._id?.toLowerCase().includes(q);
          const matchUser =
            order.user?.name?.toLowerCase().includes(q) ||
            order.user?.email?.toLowerCase().includes(q);
          const matchItems = order.cart?.some((item) =>
            item.name?.toLowerCase().includes(q)
          );
          return matchId || matchUser || matchItems;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        if (sortBy === "highest") {
          return (Number(b.totalPrice) || 0) - (Number(a.totalPrice) || 0);
        }
        if (sortBy === "lowest") {
          return (Number(a.totalPrice) || 0) - (Number(b.totalPrice) || 0);
        }
        return 0;
      });
  }, [orders, statusFilter, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Delivered
          </span>
        );
      case "Processing":
      case "Transferred to delivery partner":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Processing
          </span>
        );
      case "Shipping":
      case "On the way":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            In Transit
          </span>
        );
      case "Processing refund":
      case "Refund Success":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Refund {status === "Refund Success" ? "Done" : "Pending"}
          </span>
        );
      case "Cancel":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            {status}
          </span>
        );
    }
  };

  const statusTabs = [
    { label: "All Orders", key: "All", count: orders?.length || 0 },
    {
      label: "Processing",
      key: "Processing",
      count:
        orders?.filter(
          (o) =>
            o.status === "Processing" ||
            o.status === "Transferred to delivery partner"
        ).length || 0,
    },
    {
      label: "In Transit",
      key: "Shipping",
      count:
        orders?.filter(
          (o) => o.status === "Shipping" || o.status === "On the way"
        ).length || 0,
    },
    {
      label: "Delivered",
      key: "Delivered",
      count: orders?.filter((o) => o.status === "Delivered").length || 0,
    },
    {
      label: "Refunds & Cancelled",
      key: "Refunds",
      count:
        orders?.filter(
          (o) =>
            o.status === "Processing refund" ||
            o.status === "Refund Success" ||
            o.status === "Cancel"
        ).length || 0,
    },
  ];

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <HiOutlineShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Order Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Track, fulfill, and monitor customer orders across your store
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => seller?._id && dispatch(getAllOrdersOfShop(seller._id))}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <HiOutlineArrowPath className="w-4 h-4 text-slate-500" />
            <span>Refresh</span>
          </button>
          <Link
            to="/dashboard-create-product"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 hover:shadow-md"
          >
            <span>+ Add Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Orders</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {metrics.total}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Lifetime recorded</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Processing</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineClock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-2">
            {metrics.processing}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting fulfillment</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Delivered</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-2">
            {metrics.delivered}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Successfully fulfilled</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Gross Sales</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineCurrencyDollar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            ${metrics.revenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">From active orders</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  statusFilter === tab.key
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Sort controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by Order ID, customer, product..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <HiOutlineArrowsUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-slate-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <HiOutlineShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No orders found</h3>
            <p className="text-xs text-slate-500">
              {searchTerm || statusFilter !== "All"
                ? "No orders match your current filters. Try changing or clearing your search."
                : "Your shop hasn't received any orders yet. When customers make purchases, they'll appear here."}
            </p>
            {(searchTerm || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Order ID & Date</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Total Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedOrders.map((order) => {
                  const firstItem = order.cart?.[0];
                  const extraItems = (order.cart?.length || 0) - 1;
                  const dateStr = order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Order ID & Date */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-900">
                            #{order._id?.slice(0, 8)}...
                          </span>
                          <button
                            onClick={() => handleCopyId(order._id)}
                            title="Copy full Order ID"
                            className="text-slate-400 hover:text-indigo-600 p-1 rounded hover:bg-slate-100 transition-all"
                          >
                            {copiedId === order._id ? (
                              <HiOutlineCheck className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <HiOutlineClipboardDocument className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">{dateStr}</p>
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0 shadow-xs">
                            {order.user?.name
                              ? order.user.name.charAt(0).toUpperCase()
                              : "C"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[140px]">
                              {order.user?.name || "Customer"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              {order.shippingAddress?.city
                                ? `${order.shippingAddress.city}, ${order.shippingAddress.country || ""}`
                                : order.user?.email || "Direct Order"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {firstItem?.images?.[0]?.url && (
                            <img
                              src={firstItem.images[0].url}
                              alt={firstItem.name || "Product"}
                              className="w-9 h-9 rounded-lg object-cover border border-slate-200 flex-shrink-0 bg-slate-50"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 truncate max-w-[160px]">
                              {firstItem?.name || "Order Item"}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {order.cart?.length || 1} item
                              {(order.cart?.length || 1) > 1 ? "s" : ""}{" "}
                              {extraItems > 0 && `(+${extraItems} more)`}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-sm">
                          ${Number(order.totalPrice || 0).toFixed(2)}
                        </p>
                        <span className="inline-block text-[10px] text-emerald-600 font-medium">
                          {order.paymentInfo?.status || "Paid"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-600 bg-indigo-50/80 hover:bg-indigo-600 hover:text-white transition-all shadow-xs"
                        >
                          <span>Details</span>
                          <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredOrders.length > 0 && (
          <div className="py-3 px-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * itemsPerPage, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredOrders.length}
              </span>{" "}
              orders
            </div>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <HiOutlineChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => {
                  if (
                    totalPages > 5 &&
                    Math.abs(pageNum - currentPage) > 2 &&
                    pageNum !== 1 &&
                    pageNum !== totalPages
                  ) {
                    if (Math.abs(pageNum - currentPage) === 3) {
                      return (
                        <span key={pageNum} className="px-1 text-slate-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === pageNum
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "text-slate-600 hover:bg-slate-100 border border-transparent"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
              )}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <HiOutlineChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;
