import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { server } from "../../server";
import { toast } from "react-toastify";
import {
  HiOutlineTicket,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineMagnifyingGlass,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineReceiptPercent,
  HiOutlineShoppingBag,
  HiOutlineSparkles,
  HiOutlineXMark,
  HiOutlineArrowPath,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineBolt,
} from "react-icons/hi2";

const AllCoupons = () => {
  const [openModal, setOpenModal] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedProducts, setSelectedProducts] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  const fetchCoupons = async () => {
    if (!seller?._id) return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      });
      setCoupons(res.data.couponCodes || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [seller]);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const generateRandomCode = () => {
    const prefixes = ["SAVE", "FLASH", "DEAL", "SUMMER", "VIP", "OFF"];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = Math.floor(10 + Math.random() * 90);
    setName(`${randomPrefix}${randomNum}`);
    if (!value) setValue(randomNum.toString());
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      });
      toast.success("Coupon code deleted successfully!");
      setDeleteModalId(null);
      fetchCoupons();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to delete coupon"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a coupon code name");
      return;
    }
    if (!value || Number(value) <= 0 || Number(value) > 100) {
      toast.error("Please enter a valid discount percentage (1-100%)");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${server}/coupon/create-coupon-code`,
        {
          name: name.toUpperCase().trim(),
          minAmount: minAmount ? Number(minAmount) : null,
          maxAmount: maxAmount ? Number(maxAmount) : null,
          selectedProducts: selectedProducts || null,
          value: Number(value),
          shopId: seller._id,
        },
        { withCredentials: true }
      );
      toast.success("Coupon code created successfully!");
      setOpenModal(false);
      setName("");
      setValue("");
      setMinAmount("");
      setMaxAmount("");
      setSelectedProducts("");
      fetchCoupons();
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "Failed to create coupon!"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    if (!coupons || !Array.isArray(coupons)) {
      return { total: 0, avgDiscount: 0, highestDiscount: 0 };
    }
    const total = coupons.length;
    const totalDiscount = coupons.reduce(
      (acc, c) => acc + (Number(c.value) || 0),
      0
    );
    const avgDiscount = total > 0 ? Math.round(totalDiscount / total) : 0;
    const highestDiscount = coupons.reduce(
      (max, c) => Math.max(max, Number(c.value) || 0),
      0
    );

    return { total, avgDiscount, highestDiscount };
  }, [coupons]);

  // Filtered
  const filteredCoupons = useMemo(() => {
    if (!coupons || !Array.isArray(coupons)) return [];
    return coupons.filter((coupon) => {
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = coupon.name?.toLowerCase().includes(q);
        const matchProduct = coupon.selectedProducts?.toLowerCase().includes(q);
        return matchName || matchProduct;
      }
      return true;
    });
  }, [coupons, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredCoupons.length / itemsPerPage) || 1;
  const paginatedCoupons = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCoupons.slice(start, start + itemsPerPage);
  }, [filteredCoupons, currentPage]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
              <HiOutlineTicket className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Discount Codes & Coupons
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Create promotional discount vouchers and coupons for your customers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchCoupons}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <HiOutlineArrowPath className="w-4 h-4 text-slate-500" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setOpenModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all shadow-sm shadow-purple-200 hover:shadow-md"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Create Coupon Code</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Coupons</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <HiOutlineTicket className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {metrics.total}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Available at checkout</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Avg. Discount</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineReceiptPercent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-indigo-600 mt-2">
            {metrics.avgDiscount}%
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Across active vouchers</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Max Discount</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineBolt className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-2">
            {metrics.highestDiscount}% OFF
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Highest percentage deal</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Conversion Impact</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineSparkles className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            +35%
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Estimated sales lift</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <HiOutlineMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search coupons by code name or target product..."
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

      {/* Coupons Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-slate-500">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mx-auto">
              <HiOutlineTicket className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Coupon Codes Found</h3>
            <p className="text-xs text-slate-500">
              {searchTerm
                ? "No coupons match your search term."
                : "You have not created any discount codes yet. Create a promo voucher to incentivize buyers."}
            </p>
            <button
              onClick={() => setOpenModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition-all shadow-sm"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Create First Coupon</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount Rate</th>
                  <th className="py-3.5 px-4">Order Limits</th>
                  <th className="py-3.5 px-4">Applicable Scope</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedCoupons.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Code & Copy */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <span className="inline-block px-3 py-1 bg-purple-50 border border-purple-200 text-purple-800 font-mono font-bold text-xs rounded-lg tracking-wider">
                          {coupon.name}
                        </span>
                        <button
                          onClick={() => handleCopy(coupon.name)}
                          className="p-1 text-slate-400 hover:text-purple-600 rounded hover:bg-purple-50 transition-all"
                          title="Copy Code"
                        >
                          {copiedCode === coupon.name ? (
                            <HiOutlineCheck className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <HiOutlineClipboardDocument className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* Discount Value */}
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-sm font-bold text-slate-900">
                        <span className="text-purple-600">{coupon.value}%</span> OFF
                      </span>
                    </td>

                    {/* Order Limits */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-0.5 text-[11px] text-slate-600">
                        <p>
                          Min:{" "}
                          <span className="font-semibold text-slate-800">
                            {coupon.minAmount ? `$${coupon.minAmount}` : "None"}
                          </span>
                        </p>
                        {coupon.maxAmount && (
                          <p>
                            Max:{" "}
                            <span className="font-semibold text-slate-800">
                              ${coupon.maxAmount}
                            </span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Applicable Scope */}
                    <td className="py-3.5 px-4">
                      {coupon.selectedProducts ? (
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <HiOutlineShoppingBag className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
                          <span className="truncate max-w-[180px]">
                            {coupon.selectedProducts}
                          </span>
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-700 text-[11px] rounded-md">
                          All Store Products
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <button
                        onClick={() => setDeleteModalId(coupon._id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete coupon"
                      >
                        <HiOutlineTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {filteredCoupons.length > 0 && (
          <div className="py-3 px-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * itemsPerPage, filteredCoupons.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredCoupons.length}
              </span>{" "}
              coupons
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

      {/* Create Coupon Modal */}
      {openModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <HiOutlineTicket className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Create Discount Coupon
                </h3>
              </div>
              <button
                onClick={() => setOpenModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Ticket Live Mockup */}
            <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-white/10 [mask-image:radial-gradient(circle_at_right,transparent_8px,black_9px)]"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                    Store Promo Voucher
                  </span>
                  <h4 className="text-xl font-mono font-extrabold tracking-wider mt-0.5">
                    {name.toUpperCase() || "YOURCODE"}
                  </h4>
                  <p className="text-xs text-purple-100 mt-1">
                    {selectedProducts || "Valid on all store items"}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black">{value || "10"}%</span>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-purple-200">
                    OFF
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Coupon Code Name */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Coupon Code <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomCode}
                    className="text-[11px] font-semibold text-purple-600 hover:text-purple-700"
                  >
                    🎲 Generate Random
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER25, FLASHDEAL"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 font-mono font-bold text-xs sm:text-sm text-slate-800 uppercase focus:outline-none focus:bg-white focus:border-purple-500 rounded-xl"
                />
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Discount Percentage (%) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineReceiptPercent className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g. 20"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-purple-500 rounded-xl font-semibold"
                  />
                </div>
              </div>

              {/* Min & Max Amount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Min. Order Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-purple-500 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Max. Order Amount ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    placeholder="e.g. 500"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-purple-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Target Product */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applicable Product (Optional)
                </label>
                <select
                  value={selectedProducts}
                  onChange={(e) => setSelectedProducts(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:border-purple-500"
                >
                  <option value="">Apply to all store products</option>
                  {products &&
                    products.map((p) => (
                      <option value={p.name} key={p._id}>
                        {p.name}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-4 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-sm shadow-purple-200 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <HiOutlineTrash className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Delete Coupon Code?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this coupon? Customers will no longer be able to use it at checkout.
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
                onClick={() => handleDelete(deleteModalId)}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-200 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllCoupons;
