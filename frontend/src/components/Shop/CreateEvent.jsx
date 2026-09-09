import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import { toast } from "react-toastify";
import { createevent } from "../../redux/actions/event";
import {
  HiOutlineSparkles,
  HiOutlineCalendarDays,
  HiOutlinePhoto,
  HiOutlineTrash,
  HiOutlineCurrencyDollar,
  HiOutlineArchiveBox,
  HiOutlineTag,
  HiOutlineArrowLeft,
  HiOutlineEye,
  HiOutlineCheck,
  HiOutlineBolt,
  HiOutlineClock,
} from "react-icons/hi2";

const CreateEvent = () => {
  const { seller } = useSelector((state) => state.seller);
  const { success, error, isLoading } = useSelector((state) => state.events);
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
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const minEndDateStr = useMemo(() => {
    if (!startDate) return todayStr;
    const minEnd = new Date(startDate.getTime() + 1 * 24 * 60 * 60 * 1000);
    return minEnd.toISOString().slice(0, 10);
  }, [startDate, todayStr]);

  const handleStartDateChange = (e) => {
    if (!e.target.value) {
      setStartDate(null);
      return;
    }
    const newStart = new Date(e.target.value);
    setStartDate(newStart);
    if (endDate && endDate <= newStart) {
      setEndDate(null);
    }
  };

  const handleEndDateChange = (e) => {
    if (!e.target.value) {
      setEndDate(null);
      return;
    }
    const newEnd = new Date(e.target.value);
    setEndDate(newEnd);
  };

  // Calculate event duration in days
  const eventDurationDays = useMemo(() => {
    if (!startDate || !endDate) return null;
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : null;
  }, [startDate, endDate]);

  // Calculate discount percent
  const discountPercent =
    originalPrice && discountPrice && Number(originalPrice) > Number(discountPrice)
      ? Math.round(
          ((Number(originalPrice) - Number(discountPrice)) /
            Number(originalPrice)) *
            100
        )
      : null;

  useEffect(() => {
    if (error) {
      toast.error(error);
      setIsSubmitting(false);
    }
    if (success) {
      toast.success("Event promotion created successfully!");
      setIsSubmitting(false);
      navigate("/dashboard-events");
      window.location.reload();
    }
  }, [dispatch, error, success, navigate]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter an event product title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter event terms and description");
      return;
    }
    if (!category || category === "Choose a category") {
      toast.error("Please select a product category");
      return;
    }
    if (!discountPrice || Number(discountPrice) <= 0) {
      toast.error("Please enter a valid promotional event price");
      return;
    }
    if (!stock || Number(stock) <= 0) {
      toast.error("Please specify promotional event stock allocation");
      return;
    }
    if (!startDate) {
      toast.error("Please select an event start date");
      return;
    }
    if (!endDate) {
      toast.error("Please select an event end date");
      return;
    }
    if (endDate <= startDate) {
      toast.error("Event end date must be after start date");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least 1 image for the event");
      return;
    }

    setIsSubmitting(true);

    const eventData = {
      name,
      description,
      category,
      tags,
      originalPrice: originalPrice ? Number(originalPrice) : Number(discountPrice),
      discountPrice: Number(discountPrice),
      stock: Number(stock),
      images,
      shopId: seller._id,
      start_Date: startDate.toISOString(),
      Finish_Date: endDate.toISOString(),
    };

    dispatch(createevent(eventData));
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Bar / Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <Link
              to="/dashboard"
              className="hover:text-amber-600 transition-colors"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              to="/dashboard-events"
              className="hover:text-amber-600 transition-colors"
            >
              Events
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">New Event</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Create Promotional Event</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              <HiOutlineBolt className="w-3.5 h-3.5 text-amber-600" />
              Flash Deal
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard-events"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
          >
            <HiOutlineArrowLeft className="w-3.5 h-3.5" />
            <span>Discard</span>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm shadow-amber-200 hover:shadow-md"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Publishing Event...</span>
              </>
            ) : (
              <>
                <HiOutlineCheck className="w-4 h-4" />
                <span>Launch Event Promotion</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Primary Form) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Event Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <HiOutlineSparkles className="w-4 h-4 text-amber-500" />
              <span>Event Details</span>
            </div>

            {/* Event Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Event Title / Product Name <span className="text-rose-500">*</span>
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
                placeholder="e.g. Mega Weekend Flash Sale: Premium Smart Watch Ultra"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
              />
            </div>

            {/* Event Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Event Description & Promo Terms <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {description.length} chars
                </span>
              </div>
              <textarea
                rows={5}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the promotional offer, limited quantities, warranty, and special bundle conditions..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all leading-relaxed"
              ></textarea>
            </div>
          </div>

          {/* Card 2: Schedule & Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <HiOutlineCalendarDays className="w-4 h-4 text-amber-500" />
                <span>Event Schedule & Countdown Window</span>
              </div>
              {eventDurationDays && (
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-0.5 rounded-full flex items-center gap-1">
                  <HiOutlineClock className="w-3.5 h-3.5" />
                  {eventDurationDays} Day{eventDurationDays > 1 ? "s" : ""} Duration
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Event Start Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  id="event-start-date"
                  min={todayStr}
                  value={startDate ? startDate.toISOString().slice(0, 10) : ""}
                  onChange={handleStartDateChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">When the flash deal becomes active</p>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Event Finish Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  id="event-end-date"
                  min={minEndDateStr}
                  value={endDate ? endDate.toISOString().slice(0, 10) : ""}
                  onChange={handleEndDateChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                />
                <p className="text-[10px] text-slate-400 mt-1">When promotional pricing expires</p>
              </div>
            </div>
          </div>

          {/* Card 3: Event Media Upload */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <HiOutlinePhoto className="w-4 h-4 text-amber-500" />
                <span>Event Promotional Images</span>
              </div>
              <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                {images.length} uploaded
              </span>
            </div>

            {/* Dropzone */}
            <label
              htmlFor="event-images-upload"
              className="flex flex-col items-center justify-center p-6 sm:p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:border-amber-500 hover:bg-amber-50/20 cursor-pointer transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all shadow-xs">
                <HiOutlinePhoto className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-3">
                Click to upload event product photos
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PNG, JPG, JPEG, WEBP up to 5MB (Multiple images supported)
              </p>
              <input
                id="event-images-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {/* Preview Grid */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {images.map((imgUrl, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 aspect-square shadow-xs"
                  >
                    <img
                      src={imgUrl}
                      alt={`Event preview ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {index === 0 && (
                      <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        Cover
                      </span>
                    )}

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

          {/* Card 4: Event Pricing & Stock */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <HiOutlineCurrencyDollar className="w-4 h-4 text-amber-500" />
              <span>Event Pricing & Limited Deal Stock</span>
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
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Regular non-sale price</p>
              </div>

              {/* Flash Event Price */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Event Promo Price ($) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-amber-600">
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
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Special promotional rate</p>
              </div>

              {/* Limited Event Stock */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Allocated Stock <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineArchiveBox className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    required
                    min="1"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="e.g. 25"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Units allocated for this sale</p>
              </div>
            </div>

            {/* Discount calculations */}
            {discountPercent !== null && discountPercent > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs text-amber-900">
                <span className="font-semibold flex items-center gap-1.5">
                  <HiOutlineBolt className="w-4 h-4 text-amber-600" />
                  Flash Deal Discount: <strong>{discountPercent}% OFF</strong>
                </span>
                <span className="font-bold text-amber-800">
                  Customers save ${(Number(originalPrice) - Number(discountPrice)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Category, Tags & Live Event Preview) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Category & Tags */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <HiOutlineTag className="w-4 h-4 text-amber-500" />
              <span>Category & Promotion Tags</span>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 text-xs sm:text-sm rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:border-amber-500 transition-all"
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

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Event Tags & Keywords
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. flashdeal, weekendpromo, clearance"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-amber-500 transition-all"
              />
              <p className="text-[10px] text-slate-400 mt-1">Comma-separated promotional keywords</p>
            </div>
          </div>

          {/* Card: Live Event Card Mockup */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <HiOutlineEye className="w-4 h-4 text-slate-500" />
                <span>Flash Sale Preview</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Live Mockup
              </span>
            </div>

            {/* Event Card Mock */}
            <div className="rounded-xl border border-amber-200/70 p-3 bg-gradient-to-b from-amber-50/30 to-white shadow-xs space-y-3">
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
                    <span className="text-[11px] mt-1">Event Image</span>
                  </div>
                )}

                {/* Promo Badge */}
                <span className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                  <HiOutlineBolt className="w-3 h-3" />
                  FLASH SALE
                </span>

                {discountPercent !== null && discountPercent > 0 && (
                  <span className="absolute bottom-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Countdown Preview Bar */}
              <div className="bg-slate-900 text-white p-2 rounded-lg text-center">
                <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">
                  Deal Ends In:
                </p>
                <div className="flex items-center justify-center gap-2 mt-0.5 font-mono text-xs font-bold text-amber-400">
                  <span>03d</span>:<span>14h</span>:<span>45m</span>:<span>20s</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
                  {category || "Category"}
                </p>
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                  {name || "Flash Sale Event Product"}
                </h4>

                <div className="flex items-baseline gap-2 mt-1.5">
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
                    Promo Units: <strong className="text-slate-800">{stock || "0"}</strong>
                  </span>
                  <span className="text-amber-600 font-semibold">Limited Quantity</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Launch Button */}
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting || isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Launching Event Promotion...</span>
              </>
            ) : (
              <>
                <HiOutlineBolt className="w-5 h-5" />
                <span>Launch Flash Event</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
