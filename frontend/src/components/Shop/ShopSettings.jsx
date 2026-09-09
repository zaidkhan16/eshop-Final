import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { server } from "../../server";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";
import {
  HiOutlineBuildingStorefront,
  HiOutlineCamera,
  HiOutlineCheck,
  HiOutlineClipboardDocument,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineEnvelope,
  HiOutlineSparkles,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineShieldCheck,
  HiOutlineCalendarDays,
  HiOutlineInformationCircle,
} from "react-icons/hi2";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  const handleCopyId = () => {
    if (seller?._id) {
      navigator.clipboard.writeText(seller._id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        setIsUploadingAvatar(true);
        try {
          await axios.put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          );
          dispatch(loadSeller());
          toast.success("Shop avatar updated successfully!");
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to update avatar!"
          );
        } finally {
          setIsUploadingAvatar(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await axios.put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
        },
        { withCredentials: true }
      );
      toast.success("Shop information updated successfully!");
      dispatch(loadSeller());
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update shop info!"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const joinedDate = seller?.createdAt
    ? new Date(seller.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Verified Merchant";

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Top Header */}
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
            <span className="text-slate-800 font-semibold">Store Settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Store Profile & Settings</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <HiOutlineShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Shop
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/shop/preview/${seller?._id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
          >
            <span>View Public Storefront</span>
            <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5 text-slate-500" />
          </Link>
          <button
            onClick={updateHandler}
            disabled={isUpdating}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-sm shadow-indigo-200 hover:shadow-md"
          >
            {isUpdating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <HiOutlineCheck className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Main Settings Form) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Shop Avatar & Branding */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            {/* Store Cover Banner */}
            <div className="h-28 sm:h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 relative">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
            </div>

            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 mb-4">
                {/* Avatar with Upload */}
                <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-md bg-slate-100 overflow-hidden flex-shrink-0">
                  <img
                    src={avatar || seller?.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"}
                    alt={seller?.name || "Shop avatar"}
                    className="w-full h-full object-cover"
                  />
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  <label
                    htmlFor="shop-avatar-upload"
                    className="absolute inset-0 bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity backdrop-blur-2xs"
                  >
                    <HiOutlineCamera className="w-6 h-6" />
                    <span className="text-[10px] font-semibold mt-1">Change</span>
                  </label>
                  <input
                    type="file"
                    id="shop-avatar-upload"
                    accept="image/*"
                    onChange={handleImage}
                    className="hidden"
                  />
                </div>

                <div className="flex-1 min-w-0 sm:pb-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                      {name || seller?.name || "Your Store Name"}
                    </h2>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      Official
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    JPG, PNG, or WEBP. Max 2MB file size.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: General Store Information */}
          <form onSubmit={updateHandler} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
              <HiOutlineBuildingStorefront className="w-4 h-4 text-indigo-600" />
              <span>General Store Details</span>
            </div>

            {/* Store Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Shop Display Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <HiOutlineBuildingStorefront className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Apex Tech & Electronics"
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
            </div>

            {/* Store Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Shop Bio / Description
                </label>
                <span className="text-[11px] text-slate-400">
                  {description.length} chars
                </span>
              </div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Introduce your brand, key specialties, customer commitments, and shipping promises..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
              ></textarea>
              <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                <HiOutlineInformationCircle className="w-3.5 h-3.5 text-slate-400" />
                This description is displayed prominently on your public storefront page.
              </p>
            </div>

            {/* Card 3: Contact & Location */}
            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <HiOutlineMapPin className="w-4 h-4 text-indigo-600" />
                <span>Contact & Location Address</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Contact Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                    />
                  </div>
                </div>

                {/* Zip Code */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Zip / Postal Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipcode(e.target.value)}
                    placeholder="e.g. 10001"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Business / Warehouse Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <HiOutlineMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. 742 Evergreen Terrace, Suite 400"
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineCheck className="w-5 h-5" />
                    <span>Save Settings</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (Live Storefront Preview & Meta) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Live Store Preview Mockup */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <HiOutlineSparkles className="w-4 h-4 text-indigo-600" />
                <span>Storefront Card Preview</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Live Mockup
              </span>
            </div>

            {/* Mock Store Card */}
            <div className="rounded-xl border border-slate-200/90 p-4 bg-gradient-to-b from-slate-50/50 to-white shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={avatar || seller?.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"}
                  alt="Shop Preview"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs flex-shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {name || "Your Store Name"}
                  </h4>
                  <p className="text-[11px] text-slate-500 flex items-center gap-1 truncate mt-0.5">
                    <HiOutlineMapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{address || "Store location"}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed pt-1">
                {description || "No description provided yet. Add your shop bio to share your story with buyers."}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <HiOutlineCalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  Since {joinedDate}
                </span>
                <span className="text-indigo-600 font-semibold">Active Seller</span>
              </div>
            </div>
          </div>

          {/* Card: Account Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pb-2 border-b border-slate-100">
              <HiOutlineShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Merchant Account Info</span>
            </div>

            {/* Copyable Shop ID */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Unique Shop ID</span>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-mono text-slate-800 truncate max-w-[190px]">
                  {seller?._id || "N/A"}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="text-slate-400 hover:text-indigo-600 p-1"
                  title="Copy Shop ID"
                >
                  {copiedId ? (
                    <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <HiOutlineClipboardDocument className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1">Registered Email</span>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                <HiOutlineEnvelope className="w-4 h-4 text-slate-400" />
                <span className="truncate">{seller?.email || "seller@store.com"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSettings;
