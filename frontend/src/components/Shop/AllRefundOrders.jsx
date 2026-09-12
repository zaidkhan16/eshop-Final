import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import {
  HiOutlineReceiptRefund,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineShieldCheck,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineArrowPath,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi2";

const AllRefundOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
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

  // Extract all refund orders
  const allRefundOrders = useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    return orders.filter(
      (item) =>
        item.status === "Processing refund" || item.status === "Refund Success"
    );
  }, [orders]);

  // Metrics
  const metrics = useMemo(() => {
    const processing = allRefundOrders.filter(
      (o) => o.status === "Processing refund"
    ).length;
    const resolved = allRefundOrders.filter(
      (o) => o.status === "Refund Success"
    ).length;
    const totalAmount = allRefundOrders
      .filter((o) => o.status === "Refund Success")
      .reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);
    const totalOrdersCount = orders?.length || 1;
    const returnRate = ((allRefundOrders.length / totalOrdersCount) * 100).toFixed(1);

    return { processing, resolved, totalAmount, total: allRefundOrders.length, returnRate };
  }, [allRefundOrders, orders]);

  // Filtered
  const filteredRefunds = useMemo(() => {
    return allRefundOrders.filter((order) => {
      if (statusFilter !== "All" && order.status !== statusFilter) {
        return false;
      }
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
    });
  }, [allRefundOrders, statusFilter, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage) || 1;
  const paginatedRefunds = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRefunds.slice(start, start + itemsPerPage);
  }, [filteredRefunds, currentPage]);

  const tabs = [
    { label: "All Refund Inquiries", key: "All", count: allRefundOrders.length },
    {
      label: "Pending Review",
      key: "Processing refund",
      count: metrics.processing,
    },
    {
      label: "Refund Completed",
      key: "Refund Success",
      count: metrics.resolved,
    },
  ];

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
              <HiOutlineReceiptRefund className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Refunds & Returns
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage dispute cases, process customer return requests, and track refund settlements
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
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Requests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineClock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-2">
            {metrics.processing}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Requires seller decision</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Resolved Refunds</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineCheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-2">
            {metrics.resolved}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Closed successfully</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Refunded</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <HiOutlineCurrencyDollar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            ${metrics.totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Returned to customers</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Return Rate</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {metrics.returnRate}%
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Within healthy range</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.key
                  ? "bg-purple-50 text-purple-700 border border-purple-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  statusFilter === tab.key
                    ? "bg-purple-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search refund by Order ID, customer, item..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
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
      </div>

      {/* Refunds Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-slate-500">Loading refund records...</p>
          </div>
        ) : filteredRefunds.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
              <HiOutlineShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Refund Requests</h3>
            <p className="text-xs text-slate-500">
              {searchTerm || statusFilter !== "All"
                ? "No refund requests match your current search criteria."
                : "Great news! You have zero open return inquiries or unresolved customer refund disputes."}
            </p>
            {(searchTerm || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("All");
                }}
                className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all"
              >
                Clear filters
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
                  <th className="py-3.5 px-4">Returned Product</th>
                  <th className="py-3.5 px-4">Refund Amount</th>
                  <th className="py-3.5 px-4">Refund Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedRefunds.map((order) => {
                  const firstItem = order.cart?.[0];
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
                      {/* Order ID */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-semibold text-slate-900">
                            #{order._id?.slice(0, 8)}...
                          </span>
                          <button
                            onClick={() => handleCopyId(order._id)}
                            title="Copy full Order ID"
                            className="text-slate-400 hover:text-purple-600 p-1 rounded hover:bg-slate-100 transition-all"
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
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 text-white font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                            {order.user?.name
                              ? order.user.name.charAt(0).toUpperCase()
                              : "C"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate max-w-[140px]">
                              {order.user?.name || "Customer"}
                            </p>
                            <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                              {order.user?.email || "Direct Order"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Returned Product */}
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
                              Qty: {firstItem?.qty || 1}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Refund Amount */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-sm">
                          ${Number(order.totalPrice || 0).toFixed(2)}
                        </p>
                        <span className="text-[10px] text-slate-400 font-normal">
                          Full Refund
                        </span>
                      </td>

                      {/* Refund Status */}
                      <td className="py-3.5 px-4">
                        {order.status === "Refund Success" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Refund Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Review Required
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <Link
                          to={`/order/${order._id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 bg-purple-50 hover:bg-purple-600 hover:text-white transition-all shadow-xs"
                        >
                          <span>Manage Refund</span>
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

        {/* Pagination */}
        {filteredRefunds.length > 0 && (
          <div className="py-3 px-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * itemsPerPage, filteredRefunds.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredRefunds.length}
              </span>{" "}
              refunds
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
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100 border border-transparent"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
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

export default AllRefundOrders;
