import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllProductsShop, deleteProduct } from "../../redux/actions/product";
import { toast } from "react-toastify";
import {
  HiOutlineRectangleStack,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlineTrash,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineArchiveBox,
  HiOutlineCurrencyDollar,
  HiOutlineArrowTrendingUp,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineArrowPath,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

const AllProducts = () => {
  const { products, isLoading } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [copiedId, setCopiedId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller]);

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const confirmDelete = (id) => {
    dispatch(deleteProduct(id));
    toast.success("Product deleted successfully!");
    setDeleteModalId(null);
    setTimeout(() => {
      if (seller?._id) dispatch(getAllProductsShop(seller._id));
    }, 500);
  };

  // Metrics
  const metrics = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return { total: 0, inStock: 0, lowStock: 0, totalValue: 0 };
    }
    const total = products.length;
    const inStock = products.filter((p) => Number(p.stock) > 0).length;
    const lowStock = products.filter((p) => Number(p.stock) <= 5).length;
    const totalValue = products.reduce(
      (acc, p) => acc + (Number(p.discountPrice) || 0) * (Number(p.stock) || 0),
      0
    );

    return { total, inStock, lowStock, totalValue };
  }, [products]);

  // Categories list
  const categories = useMemo(() => {
    if (!products || !Array.isArray(products)) return ["All"];
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  // Filter and Sort
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];

    return products
      .filter((product) => {
        if (selectedCategory !== "All" && product.category !== selectedCategory) {
          return false;
        }
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchName = product.name?.toLowerCase().includes(q);
          const matchId = product._id?.toLowerCase().includes(q);
          const matchTags = product.tags?.toLowerCase().includes(q);
          return matchName || matchId || matchTags;
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
        if (sortBy === "highest_price") {
          return (Number(b.discountPrice) || 0) - (Number(a.discountPrice) || 0);
        }
        if (sortBy === "lowest_price") {
          return (Number(a.discountPrice) || 0) - (Number(b.discountPrice) || 0);
        }
        if (sortBy === "highest_stock") {
          return (Number(b.stock) || 0) - (Number(a.stock) || 0);
        }
        return 0;
      });
  }, [products, selectedCategory, searchTerm, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <HiOutlineRectangleStack className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Product Catalog
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Manage your store's inventory, prices, and product listings
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => seller?._id && dispatch(getAllProductsShop(seller._id))}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <HiOutlineArrowPath className="w-4 h-4 text-slate-500" />
            <span>Refresh</span>
          </button>
          <Link
            to="/dashboard-create-product"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200 hover:shadow-md"
          >
            <HiOutlinePlus className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Products</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineRectangleStack className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            {metrics.total}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Active catalog items</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">In Stock</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <HiOutlineArchiveBox className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-2">
            {metrics.inStock}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Ready for purchase</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Low Stock Alert</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <HiOutlineExclamationTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-2">
            {metrics.lowStock}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Below 5 units</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Inventory Value</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <HiOutlineCurrencyDollar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2">
            ${metrics.totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Based on selling price</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
        {/* Category Tabs */}
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
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                  selectedCategory === cat
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {cat === "All"
                  ? products?.length || 0
                  : products?.filter((p) => p.category === cat).length || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Sort */}
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
              placeholder="Search products by title, ID, tag..."
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
            <span className="text-xs text-slate-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl px-3 py-2 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
            >
              <option value="newest">Newest Listed</option>
              <option value="oldest">Oldest Listed</option>
              <option value="highest_price">Highest Price</option>
              <option value="lowest_price">Lowest Price</option>
              <option value="highest_stock">Highest Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-medium text-slate-500">Loading catalog items...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mx-auto">
              <HiOutlineRectangleStack className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No products found</h3>
            <p className="text-xs text-slate-500">
              {searchTerm || selectedCategory !== "All"
                ? "No items match your filter criteria. Try adjusting your search query."
                : "Your store does not have any products yet. Click below to add your first product."}
            </p>
            <Link
              to="/dashboard-create-product"
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Create Product</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  <th className="py-3.5 px-4 sm:px-6">Product</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4">Sold Units</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {paginatedProducts.map((product) => {
                  const coverImg = product.images?.[0]?.url;
                  const isLowStock = Number(product.stock) <= 5;
                  const isOutOfStock = Number(product.stock) === 0;

                  return (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Product Name & Image */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          {coverImg ? (
                            <img
                              src={coverImg}
                              alt={product.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0 shadow-xs"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 flex-shrink-0">
                              <HiOutlineRectangleStack className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-[280px]">
                              {product.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[11px] font-mono text-slate-400">
                                ID: #{product._id?.slice(0, 8)}
                              </span>
                              <button
                                onClick={() => handleCopyId(product._id)}
                                title="Copy ID"
                                className="text-slate-400 hover:text-indigo-600 p-0.5 rounded"
                              >
                                {copiedId === product._id ? (
                                  <HiOutlineCheck className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <HiOutlineClipboardDocument className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                          {product.category || "General"}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 text-sm">
                          ${Number(product.discountPrice || 0).toFixed(2)}
                        </p>
                        {product.originalPrice &&
                          Number(product.originalPrice) > Number(product.discountPrice) && (
                            <span className="text-[10px] text-slate-400 line-through">
                              ${Number(product.originalPrice).toFixed(2)}
                            </span>
                          )}
                      </td>

                      {/* Stock Status */}
                      <td className="py-3.5 px-4">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            Out of stock
                          </span>
                        ) : isLowStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Low: {product.stock} left
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {product.stock} units
                          </span>
                        )}
                      </td>

                      {/* Sold Units */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-700 font-semibold">
                          <HiOutlineArrowTrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{product.sold_out || 0}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/product/${product._id}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                            title="Preview product in storefront"
                          >
                            <HiOutlineEye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteModalId(product._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                            title="Delete product"
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
        {filteredProducts.length > 0 && (
          <div className="py-3 px-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div>
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-slate-700">
                {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {filteredProducts.length}
              </span>{" "}
              products
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
                        ? "bg-indigo-600 text-white shadow-xs"
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
                Delete Product?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to delete this product? This action cannot be undone and will remove it from all buyer carts.
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
