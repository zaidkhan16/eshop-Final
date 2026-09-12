import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllEventsShop, deleteEvent } from "../../redux/actions/event";
import { toast } from "react-toastify";
import {
  HiOutlineSparkles,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineArchiveBox,
  HiOutlineCurrencyDollar,
  HiOutlineCalendarDays,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowPath,
  HiOutlineBolt,
} from "react-icons/hi2";

const AllEvents = () => {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllEventsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = (id) => {
    dispatch(deleteEvent(id));
    toast.success("Event deleted successfully!");
    setDeleteModalId(null);
    setTimeout(() => {
      if (seller?._id) dispatch(getAllEventsShop(seller._id));
    }, 500);
  };

  // Metrics
  const metrics = useMemo(() => {
    if (!events || !Array.isArray(events)) {
      return { total: 0, activeNow: 0, totalStock: 0, totalSold: 0 };
    }
    const now = new Date();
    const total = events.length;
    const activeNow = events.filter((e) => {
      const start = e.start_Date ? new Date(e.start_Date) : null;
      const end = e.Finish_Date ? new Date(e.Finish_Date) : null;
      return (!start || now >= start) && (!end || now <= end);
    }).length;
    const totalStock = events.reduce((acc, e) => acc + (Number(e.stock) || 0), 0);
    const totalSold = events.reduce((acc, e) => acc + (Number(e.sold_out) || 0), 0);

    return { total, activeNow, totalStock, totalSold };
  }, [events]);

  const categories = useMemo(() => {
    if (!events || !Array.isArray(events)) return ["All"];
    const cats = new Set(events.map((e) => e.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [events]);

  const filteredEvents = useMemo(() => {
    if (!events || !Array.isArray(events)) return [];

    return events.filter((evt) => {
      if (selectedCategory !== "All" && evt.category !== selectedCategory) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = evt.name?.toLowerCase().includes(q);
        const matchId = evt._id?.toLowerCase().includes(q);
        return matchName || matchId;
      }
      return true;
    });
  }, [events, selectedCategory, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredEvents.slice(start, start + itemsPerPage);
  }, [filteredEvents, currentPage]);

  const getEventStatusBadge = (evt) => {
    const now = new Date();
    const start = evt.start_Date ? new Date(evt.start_Date) : null;
    const end = evt.Finish_Date ? new Date(evt.Finish_Date) : null;

    if (end && now > end) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
          Ended
        </span>
      );
    }
    if (start && now < start) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Upcoming
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
        Live Flash Deal
      </span>
    );
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm">
              <HiOutlineSparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Promotions & Events
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage flash sales, promotional campaigns, and limited-time deals
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => seller?._id && dispatch(getAllEventsShop(seller._id))}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <HiOutlineArrowPath className="w-4 h-4 text-slate-500" />
            <span>Refresh</span>
          </button>
          <Link
            to="/dashboard-create-event"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm shadow-amber-200 hover:shadow-md"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Create Flash Event</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Events</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineSparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {metrics.total}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">All promotional deals</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Live Deals</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineBolt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-2">
            {metrics.activeNow}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Live in store now</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Promo Inventory</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineArchiveBox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {metrics.totalStock}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Allocated units</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Units Sold</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <HiOutlineCurrencyDollar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-2">
            {metrics.totalSold}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">From flash campaigns</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
        {/* Category Filter */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-slate-100 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {cat === "All"
                  ? events?.length || 0
                  : events?.filter((e) => e.category === cat).length || 0}
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
            placeholder="Search events by title, ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
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

      {/* Events Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-slate-500">Loading promotional events...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto">
              <HiOutlineSparkles className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Events Found</h3>
            <p className="text-xs text-slate-500">
              {searchTerm || selectedCategory !== "All"
                ? "No promotional events match your search."
                : "You haven't launched any promotional deals yet. Create a flash deal to boost conversions."}
            </p>
            <Link
              to="/dashboard-create-event"
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-all shadow-sm"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Create First Event</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Event Product</th>
                  <th className="py-3.5 px-4">Duration & Status</th>
                  <th className="py-3.5 px-4">Promo Price</th>
                  <th className="py-3.5 px-4">Promo Stock</th>
                  <th className="py-3.5 px-4">Sold Units</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedEvents.map((evt) => {
                  const coverImg = evt.images?.[0]?.url;
                  const discountPercent =
                    evt.originalPrice && evt.discountPrice && Number(evt.originalPrice) > Number(evt.discountPrice)
                      ? Math.round(
                          ((Number(evt.originalPrice) - Number(evt.discountPrice)) /
                            Number(evt.originalPrice)) *
                            100
                        )
                      : null;

                  return (
                    <tr
                      key={evt._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Product & Title */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {coverImg ? (
                            <img
                              src={coverImg}
                              alt={evt.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
                              <HiOutlineSparkles className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[260px]">
                              {evt.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-mono text-slate-400">
                                ID: #{evt._id?.slice(0, 8)}
                              </span>
                              <button
                                onClick={() => handleCopyId(evt._id)}
                                title="Copy ID"
                                className="text-slate-400 hover:text-amber-600 p-0.5 rounded"
                              >
                                {copiedId === evt._id ? (
                                  <HiOutlineCheck className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <HiOutlineClipboardDocument className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Duration & Status */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          {getEventStatusBadge(evt)}
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <HiOutlineCalendarDays className="w-3.5 h-3.5 text-slate-400" />
                            {evt.start_Date
                              ? new Date(evt.start_Date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Now"}{" "}
                            -{" "}
                            {evt.Finish_Date
                              ? new Date(evt.Finish_Date).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "Indefinite"}
                          </p>
                        </div>
                      </td>

                      {/* Price & Discount */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900 text-sm">
                            ${Number(evt.discountPrice || 0).toFixed(2)}
                          </p>
                          {discountPercent && (
                            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                        {evt.originalPrice && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ${Number(evt.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {evt.stock} units
                        </span>
                      </td>

                      {/* Sold */}
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800">
                          {evt.sold_out || 0} sold
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/product/${evt.name?.replace(/\s+/g, "-")}?isEvent=true`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                            title="Preview event"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteModalId(evt._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete event"
                          >
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {filteredEvents.length > 0 && (
          <div className="py-3 px-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * itemsPerPage, filteredEvents.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredEvents.length}
              </span>{" "}
              events
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
                        ? "bg-amber-500 text-white shadow-xs"
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

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <HiOutlineTrash className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete Flash Event?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to cancel and delete this event promotion? This will immediately remove special pricing for buyers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteModalId(null)}
                className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteModalId)}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-200 transition-all"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllEvents;
