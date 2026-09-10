import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { createProduct } from "../../redux/actions/product";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { compressImage } from "../../utils/imageCompressor";
import {
  HiOutlinePlusCircle,
  HiOutlinePhoto,
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineArchiveBox,
  HiOutlineTag,
  HiOutlineArrowLeft,
  HiOutlineSparkles,
  HiOutlineInformationCircle,
  HiOutlineEye,
  HiOutlineCheck,
} from "react-icons/hi2";

const CreateProduct = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, isLoading } = useSelector((state) => state.products);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setIsSubmitting(false);
      dispatch({ type: "clearErrors" });
    }
    if (success) {
      toast.success("Product published successfully!");
      setIsSubmitting(false);
      navigate("/dashboard-products");
      window.location.reload();
    }
  }, [dispatch, error, success, navigate]);

  // Handle image upload and conversion to compressed base64
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const compressedList = await Promise.all(
        files.map((file) => compressImage(file))
      );
      setImages((old) => [...old, ...compressedList.filter(Boolean)]);
    } catch (err) {
      console.error("Image processing error:", err);
      toast.error("Failed to process selected image(s)");
    }
  };

  // Remove individual image
  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Calculate discount percentage
  const discountPercent =
    originalPrice && discountPrice && Number(originalPrice) > Number(discountPrice)
      ? Math.round(
          ((Number(originalPrice) - Number(discountPrice)) /
            Number(originalPrice)) *
            100
        )
      : null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!seller || !seller._id) {
      toast.error("Seller account session not found. Please log in to your shop account.");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter a product title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a product description");
      return;
    }
    if (!category || category === "Choose a category") {
      toast.error("Please select a product category");
      return;
    }
    if (!discountPrice || Number(discountPrice) <= 0) {
      toast.error("Please enter a valid selling price");
      return;
    }
    if (!stock || Number(stock) < 0) {
      toast.error("Please specify stock quantity");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least 1 product image");
      return;
    }

    setIsSubmitting(true);

    const productPayload = {
      name,
      description,
      category,
      tags,
      originalPrice: originalPrice ? Number(originalPrice) : Number(discountPrice),
      discountPrice: Number(discountPrice),
      stock: Number(stock),
      shopId: seller._id,
      images,
    };

    dispatch(createProduct(productPayload));
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Bar / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link
              to="/dashboard"
              className="hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              to="/dashboard-products"
              className="hover:text-indigo-600 transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">New Product</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Add New Product
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard-products"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
          >
            <HiOutlineArrowLeft className="w-3.5 h-3.5" />
            <span>Discard</span>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-indigo-200 hover:shadow-md"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <HiOutlineCheck className="w-4 h-4" />
                <span>Publish Product</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Form Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Primary Details) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <HiOutlineSparkles className="w-4 h-4 text-indigo-600" />
              <span>Basic Information</span>
            </div>

            {/* Product Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Product Name / Title <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {name.length}/120
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Wireless Noise-Cancelling Headphones Pro"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
              />
            </div>

            {/* Product Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Full Description <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {description.length} chars
                </span>
              </div>
              <textarea
                rows={6}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your product features, dimensions, materials, warranty, and special details..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
              ></textarea>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <HiOutlineInformationCircle className="w-3.5 h-3.5 text-slate-400" />
                Include key selling points, dimensions, and materials for better conversion.
              </p>
            </div>
          </div>

          {/* Card 2: Media Gallery & Upload */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <HiOutlinePhoto className="w-4 h-4 text-indigo-600" />
                <span>Product Media & Images</span>
              </div>
              <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {images.length} uploaded
              </span>
            </div>

            {/* Drop Zone */}
            <label
              htmlFor="product-images-upload"
              className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50/20 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-xs">
                <HiOutlinePhoto className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-3">
                Click to upload product images
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, JPEG, WEBP up to 5MB (Multiple files supported)
              </p>
              <input
                id="product-images-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square shadow-xs"
                  >
                    <img
                      src={imgUrl}
                      alt={`Product preview ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Cover Image Badge for 1st Image */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Cover
                      </span>
                    )}

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-rose-500 text-slate-700 hover:text-white rounded-lg shadow-sm backdrop-blur-xs transition-all opacity-0 group-hover:opacity-100"
                      title="Remove image"
                    >
                      <HiOutlineTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Card 3: Pricing & Inventory */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <HiOutlineCurrencyDollar className="w-4 h-4 text-indigo-600" />
              <span>Pricing & Stock Inventory</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Original Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Original Price ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Crossed-out regular retail price</p>
              </div>

              {/* Discount / Selling Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Selling Price ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Actual price charged to buyers</p>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Available Stock <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineArchiveBox className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Units available in warehouse</p>
              </div>
            </div>

            {/* Discount calculations banner */}
            {discountPercent !== null && discountPercent > 0 && (
              <div className="p-3 bg-emerald-50 border border-emerald-200/70 rounded-xl flex items-center justify-between text-xs text-emerald-800">
                <span className="font-medium">
                  🎉 Special Offer Discount: <strong className="font-bold">{discountPercent}% OFF</strong>
                </span>
                <span className="font-semibold">
                  Buyer saves ${(Number(originalPrice) - Number(discountPrice)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Category, Tags & Live Preview) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Category & Organization */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <HiOutlineTag className="w-4 h-4 text-indigo-600" />
              <span>Category & Tags</span>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
              >
                <option value="">Select a category</option>
                {categoriesData &&
                  categoriesData.map((cat) => (
                    <option value={cat.title} key={cat.title}>
                      {cat.title}
                    </option>
                  ))}
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Keywords & Tags
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. wireless, bluetooth, audio, gadget"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1">Separate keywords with commas for search optimization</p>
            </div>
          </div>

          {/* Card: Live Storefront Card Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <HiOutlineEye className="w-4 h-4 text-slate-500" />
                <span>Storefront Preview</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Live Mockup
              </span>
            </div>

            {/* Mock Product Card */}
            <div className="rounded-xl border border-slate-200/80 p-3 bg-white shadow-xs space-y-3">
              <div className="relative w-full aspect-square rounded-lg bg-slate-100 overflow-hidden flex items-center justify-center">
                {images.length > 0 ? (
                  <img
                    src={images[0]}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <HiOutlinePhoto className="w-8 h-8" />
                    <span className="text-[11px] mt-1">Image Preview</span>
                  </div>
                )}

                {discountPercent !== null && discountPercent > 0 && (
                  <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              <div>
                <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">
                  {category || "Category"}
                </p>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {name || "Your Product Title Here"}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Sold by: <span className="font-medium text-slate-600">{seller?.name || "Your Shop"}</span>
                </p>

                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-sm font-bold text-slate-900">
                    ${discountPrice ? Number(discountPrice).toFixed(2) : "0.00"}
                  </span>
                  {originalPrice && Number(originalPrice) > Number(discountPrice) && (
                    <span className="text-xs text-slate-400 line-through">
                      ${Number(originalPrice).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    Stock: <strong className="text-slate-800">{stock || "0"} units</strong>
                  </span>
                  <span className="text-emerald-600 font-medium">In Stock</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Submit Button for mobile/desktop */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Publishing Product...</span>
              </>
            ) : (
              <>
                <HiOutlinePlusCircle className="w-5 h-5" />
                <span>Publish Product to Store</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
