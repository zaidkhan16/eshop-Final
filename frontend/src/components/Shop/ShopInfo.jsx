import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { server } from "../../server";
import Loader from "../Layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { toast } from "react-toastify";
import {
  HiOutlineBuildingStorefront,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftRight,
  HiOutlineShare,
  HiOutlineCheck,
  HiOutlineShieldCheck,
  HiOutlineArrowRightOnRectangle,
  HiOutlinePencilSquare,
  HiOutlineHeart,
  HiOutlineTruck,
  HiOutlineCheckBadge,
} from "react-icons/hi2";
import { AiFillStar, AiFillHeart } from "react-icons/ai";

const ShopInfo = ({ isOwner }) => {
  const [data, setData] = useState({});
  const { products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      dispatch(getAllProductsShop(id));
      setIsLoading(true);
      axios
        .get(`${server}/shop/get-shop-info/${id}`)
        .then((res) => {
          setData(res.data.shop || {});
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false);
        });
    }
  }, [dispatch, id]);

  const logoutHandler = async () => {
    localStorage.removeItem("seller_token");
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      toast.success("Logged out successfully");
      navigate("/shop-login");
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success("Storefront link copied to clipboard!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleContactSeller = () => {
    if (!user) {
      toast.error("Please login to message this seller!");
      navigate("/login");
      return;
    }
    navigate(`/inbox?shopId=${id}`);
  };

  // Review & Rating calculations
  const totalReviewsLength =
    products &&
    products.reduce(
      (acc, product) => acc + (product.reviews ? product.reviews.length : 0),
      0
    );

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc +
        (product.reviews
          ? product.reviews.reduce((sum, review) => sum + review.rating, 0)
          : 0),
      0
    );

  const averageRating = totalReviewsLength
    ? (totalRatings / totalReviewsLength).toFixed(1)
    : "5.0";

  const memberSince = data?.createdAt
    ? new Date(data.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : "Active Merchant";

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-400 text-center mt-3 font-medium">
          Loading storefront profile...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col font-Poppins transition-all">
      {/* Store Cover Banner */}
      <div className="h-32 sm:h-36 bg-gradient-to-r from-indigo-600 via-purple-600 to-slate-900 relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button
            onClick={handleShare}
            title="Share Storefront"
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all shadow-xs"
          >
            {copiedLink ? (
              <HiOutlineCheck className="w-4 h-4 text-emerald-300" />
            ) : (
              <HiOutlineShare className="w-4 h-4" />
            )}
          </button>
          {!isOwner && (
            <button
              onClick={() => {
                setIsFollowing(!isFollowing);
                toast.success(
                  isFollowing
                    ? "Unfollowed shop"
                    : "Added shop to your favorites!"
                );
              }}
              title="Follow Shop"
              className="p-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white transition-all shadow-xs"
            >
              {isFollowing ? (
                <AiFillHeart className="w-4 h-4 text-rose-400" />
              ) : (
                <HiOutlineHeart className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Profile Header & Avatar */}
      <div className="px-5 sm:px-6 pb-6 pt-0 relative">
        <div className="flex flex-col items-center text-center -mt-16 mb-4">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white shadow-lg bg-slate-100 overflow-hidden">
              <img
                src={
                  data.avatar?.url ||
                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80"
                }
                alt={data.name || "Store Avatar"}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs"
              title="Seller Online"
            ></span>
          </div>

          {/* Shop Name & Verification */}
          <div className="mt-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center justify-center gap-1.5">
              <span>{data.name || "Official Store"}</span>
              <HiOutlineCheckBadge className="w-5 h-5 text-indigo-600 flex-shrink-0" />
            </h2>
            <p className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full inline-block mt-1">
              Top Rated Verified Merchant
            </p>
          </div>

          {/* Star Rating summary */}
          <div className="flex items-center gap-1.5 mt-2 text-xs">
            <div className="flex items-center text-amber-400">
              <AiFillStar className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">{averageRating}</span>
            <span className="text-slate-400">
              ({totalReviewsLength || 0} reviews)
            </span>
          </div>

          {/* Shop Description */}
          {data.description && (
            <p className="text-xs text-slate-600 mt-3 leading-relaxed max-w-sm">
              "{data.description}"
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {!isOwner ? (
            <button
              onClick={handleContactSeller}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <HiOutlineChatBubbleLeftRight className="w-4 h-4" />
              <span>Contact & Message Seller</span>
            </button>
          ) : (
            <div className="space-y-2">
              <Link
                to="/dashboard"
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <HiOutlineBuildingStorefront className="w-4 h-4" />
                <span>Seller Dashboard</span>
              </Link>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/settings"
                  className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <HiOutlinePencilSquare className="w-3.5 h-3.5" />
                  <span>Edit Shop</span>
                </Link>
                <button
                  onClick={logoutHandler}
                  className="py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <HiOutlineArrowRightOnRectangle className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Performance Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5 pt-4 mt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Products</span>
            <p className="text-base font-bold text-slate-900 mt-1">
              {products?.length || 0}
            </p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Satisfaction</span>
            <p className="text-base font-bold text-emerald-600 mt-1">
              99.4%
            </p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Response</span>
            <p className="text-base font-bold text-indigo-600 mt-1">
              &lt; 1 Hour
            </p>
          </div>

          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col justify-between">
            <span className="text-[11px] text-slate-400 font-medium">Member</span>
            <p className="text-base font-bold text-slate-900 mt-1 truncate">
              {memberSince}
            </p>
          </div>
        </div>

        {/* Location & Contact Details */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[11px]">
            Store Information
          </h4>

          {data.address && (
            <div className="flex items-start gap-2.5">
              <HiOutlineMapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Location</p>
                <p className="font-semibold text-slate-800">{data.address}</p>
              </div>
            </div>
          )}

          {data.phoneNumber && (
            <div className="flex items-start gap-2.5">
              <HiOutlinePhone className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Phone Support</p>
                <p className="font-semibold text-slate-800">{data.phoneNumber}</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2.5">
            <HiOutlineCalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] text-slate-400 font-medium">Joined Marketplace</p>
              <p className="font-semibold text-slate-800">
                {data.createdAt ? new Date(data.createdAt).toDateString() : "Active Seller"}
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-5 p-3.5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100/60 space-y-2 text-[11px] text-slate-700">
          <div className="flex items-center gap-2 font-medium">
            <HiOutlineShieldCheck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>100% Guaranteed Authentic Items</span>
          </div>
          <div className="flex items-center gap-2 font-medium">
            <HiOutlineTruck className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>Fast Express Dispatch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopInfo;
