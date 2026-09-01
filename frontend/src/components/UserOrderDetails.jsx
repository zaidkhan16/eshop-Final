import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import {
  FiArrowLeft,
  FiPrinter,
  FiCopy,
  FiCheck,
  FiPackage,
  FiRefreshCw,
  FiHelpCircle,
  FiStar,
} from "react-icons/fi";
import {
  HiOutlineShoppingBag,
  HiOutlineLocationMarker,
  HiOutlineReceiptTax,
  HiOutlineCreditCard,
  HiOutlinePhone,
  HiOutlineUser,
  HiOutlineSparkles,
} from "react-icons/hi";
import { MdTrackChanges } from "react-icons/md";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "./Layout/Loader";

const UserOrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [copied, setCopied] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = orders && orders.find((item) => item._id === id);

  const handleCopyId = () => {
    if (!data?._id) return;
    navigator.clipboard.writeText(data._id);
    setCopied(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const reviewHandler = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.warning("Please provide a rating");
      return;
    }
    setSubmittingReview(true);
    await axios
      .put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message || "Review submitted successfully!");
        dispatch(getAllOrdersOfUser(user._id));
        setComment("");
        setRating(5);
        setOpen(false);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to submit review"
        );
      })
      .finally(() => {
        setSubmittingReview(false);
      });
  };

  const refundHandler = async () => {
    if (
      window.confirm(
        "Are you sure you want to request a refund for this order? Our support team will verify your return request."
      )
    ) {
      await axios
        .put(`${server}/order/order-refund/${id}`, {
          status: "Processing refund",
        })
        .then((res) => {
          toast.success(res.data.message || "Refund request submitted!");
          dispatch(getAllOrdersOfUser(user._id));
        })
        .catch((error) => {
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Failed to process refund!"
          );
        });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
          dot: "bg-emerald-500",
          label: "Delivered",
        };
      case "On the way":
        return {
          bg: "bg-purple-50 text-purple-600 border-purple-200",
          dot: "bg-purple-500 animate-pulse",
          label: "Out for Delivery",
        };
      case "Shipping":
      case "Received":
        return {
          bg: "bg-blue-50 text-blue-600 border-blue-200",
          dot: "bg-blue-500 animate-pulse",
          label: "In Transit",
        };
      case "Transferred to delivery partner":
        return {
          bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
          dot: "bg-indigo-500",
          label: "Handed to Courier",
        };
      case "Processing refund":
        return {
          bg: "bg-amber-50 text-amber-600 border-amber-200",
          dot: "bg-amber-500 animate-pulse",
          label: "Refund In Progress",
        };
      case "Refund Success":
        return {
          bg: "bg-rose-50 text-rose-600 border-rose-200",
          dot: "bg-rose-500",
          label: "Refund Credited",
        };
      case "Processing":
      default:
        return {
          bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
          dot: "bg-indigo-500 animate-pulse",
          label: "Processing in Hub",
        };
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 text-2xl">
          <HiOutlineShoppingBag />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mb-6">
          We could not locate this order in your account history.
        </p>
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <FiArrowLeft /> Back to My Orders
        </Link>
      </div>
    );
  }

  const statusBadge = getStatusBadge(data.status);
  const isRefunded =
    data.status === "Processing refund" || data.status === "Refund Success";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50/80 to-slate-100/90 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              <Link
                to="/profile"
                className="hover:text-indigo-600 transition-colors flex items-center gap-1"
              >
                <FiArrowLeft className="inline" /> Account Dashboard
              </Link>
              <span>/</span>
              <span className="text-indigo-600">Order #{data._id?.slice(0, 8)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              Order Details & Receipt
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                <HiOutlineSparkles className="text-indigo-500" /> Verified
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/user/track/order/${data._id}`}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <MdTrackChanges size={16} /> Track Shipment
            </Link>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors print:hidden"
              title="Print Invoice"
            >
              <FiPrinter className="text-slate-500 text-sm" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

        {/* Refund Status Banner (if active) */}
        {isRefunded && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              data.status === "Refund Success"
                ? "bg-rose-50 border-rose-200 text-rose-900"
                : "bg-amber-50 border-amber-200 text-amber-900"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                  data.status === "Refund Success"
                    ? "bg-rose-600 text-white"
                    : "bg-amber-500 text-white"
                }`}
              >
                <FiRefreshCw />
              </div>
              <div>
                <h4 className="text-sm font-extrabold">
                  {data.status === "Refund Success"
                    ? "Refund Credited Successfully"
                    : "Refund Request in Processing"}
                </h4>
                <p className="text-xs opacity-85 mt-0.5">
                  {data.status === "Refund Success"
                    ? "Your full payment of $" +
                      data.totalPrice +
                      " has been successfully credited back to your account."
                    : "Our merchant team is processing your refund request. Funds will be returned upon verification."}
                </p>
              </div>
            </div>

            <Link
              to={`/user/track/order/${data._id}`}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs whitespace-nowrap ${
                data.status === "Refund Success"
                  ? "bg-rose-600 text-white hover:bg-rose-700"
                  : "bg-amber-600 text-white hover:bg-amber-700"
              }`}
            >
              View Refund Timeline →
            </Link>
          </div>
        )}

        {/* Top Order Information Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${statusBadge.bg}`}
                >
                  <span className={`w-2 h-2 rounded-full ${statusBadge.dot}`} />
                  {statusBadge.label}
                </span>

                <span className="text-xs font-medium text-slate-400">
                  Placed on:{" "}
                  <strong className="text-slate-700 font-semibold">
                    {new Date(data.createdAt || Date.now()).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </strong>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                  #{data._id}
                </h2>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-sm"
                  title="Copy full Order ID"
                >
                  {copied ? (
                    <FiCheck className="text-emerald-500" />
                  ) : (
                    <FiCopy />
                  )}
                </button>
              </div>
            </div>

            {/* Total Paid Highlight Box */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:px-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20">
                <HiOutlineReceiptTax />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Total Order Amount
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  ${data.totalPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Details Sub-Bar */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Payment Status</span>
              <span className="font-bold text-slate-800 capitalize">
                {data.paymentInfo?.status || "Paid"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Payment Method</span>
              <span className="font-bold text-slate-800">
                {data.paymentInfo?.type || "Online Payment"}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Items Count</span>
              <span className="font-bold text-slate-800">
                {data.cart?.length || 0} product(s)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Delivery Guarantee</span>
              <span className="font-bold text-emerald-600">Free Express</span>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Left Products List & Right Address/Payment */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (2 Cols): Products List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 text-lg">
                    <FiPackage />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      Purchased Products
                    </h3>
                    <span className="text-xs text-slate-500">
                      {data.cart?.length || 0} item(s) in this order
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  Verified Order
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {data.cart &&
                  data.cart.map((item, index) => {
                    const imgUrl =
                      item?.images && item.images.length > 0
                        ? item.images[0]?.url
                        : item.image ||
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300";

                    const itemPrice =
                      item.discountPrice || item.originalPrice || 0;
                    const lineTotal = (itemPrice * (item.qty || 1)).toFixed(2);

                    return (
                      <div
                        key={index}
                        className="py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200 overflow-hidden flex-shrink-0 p-1 group-hover:border-indigo-200 transition-colors">
                            <img
                              src={imgUrl}
                              alt={item.name}
                              className="w-full h-full object-contain rounded-xl"
                            />
                          </div>
                          <div className="space-y-1">
                            <Link
                              to={`/product/${item._id}`}
                              className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                              <span>
                                Qty:{" "}
                                <strong className="text-slate-800 font-bold">
                                  {item.qty || 1}
                                </strong>
                              </span>
                              <span>•</span>
                              <span>
                                Price:{" "}
                                <strong className="text-slate-800 font-bold">
                                  ${itemPrice}
                                </strong>
                              </span>
                            </div>
                            {item.shop && (
                              <span className="inline-block text-[11px] font-semibold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-md">
                                Sold by: {item.shop.name}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                          <span className="text-base font-black text-slate-900">
                            ${lineTotal}
                          </span>

                          {!item.isReviewed && data?.status === "Delivered" && (
                            <button
                              onClick={() => {
                                setSelectedItem(item);
                                setOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors"
                            >
                              <FiStar size={13} /> Write Review
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Right Column (1 Col): Shipping, Payment & Support */}
          <div className="space-y-6">
            {/* Delivery Address Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <HiOutlineLocationMarker className="text-indigo-600 text-lg" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Shipping Address
                </h3>
              </div>

              <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                  <HiOutlineUser className="text-slate-400" />
                  {data.user?.name || "Customer"}
                </div>

                <div className="pl-6 space-y-0.5">
                  <p className="text-slate-800 font-medium">
                    {data.shippingAddress?.address1}
                    {data.shippingAddress?.address2
                      ? `, ${data.shippingAddress.address2}`
                      : ""}
                  </p>
                  <p className="text-slate-600">
                    {data.shippingAddress?.city},{" "}
                    {data.shippingAddress?.state || ""}{" "}
                    {data.shippingAddress?.zipCode}
                  </p>
                  <p className="text-slate-600 font-semibold">
                    {data.shippingAddress?.country}
                  </p>
                </div>

                {data.user?.phoneNumber && (
                  <div className="pt-2 flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <HiOutlinePhone className="text-indigo-500 text-sm" />
                    <span>{data.user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial & Payment Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <HiOutlineReceiptTax className="text-indigo-600 text-lg" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Payment Summary
                </h3>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
                <div className="flex justify-between">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    ${data.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping & Handling</span>
                  <span className="font-semibold text-emerald-600">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Gateway</span>
                  <span className="font-semibold text-slate-900 flex items-center gap-1">
                    <HiOutlineCreditCard className="text-slate-400" />
                    {data.paymentInfo?.type || "Online Payment"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-sm font-bold text-slate-900">
                  Total Paid
                </span>
                <span className="text-xl font-black text-indigo-600">
                  ${data.totalPrice}
                </span>
              </div>

              {/* Refund Request Button if Delivered and not already refunded */}
              {data.status === "Delivered" && (
                <button
                  onClick={refundHandler}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FiRefreshCw /> Request Order Return / Refund
                </button>
              )}
            </div>

            {/* Need Help Card */}
            <div className="bg-gradient-to-br from-indigo-50 via-violet-50 to-indigo-50/60 rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
                  <FiHelpCircle />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Questions About This Order?
                  </h4>
                  <span className="text-xs text-slate-500">
                    24/7 customer assistance
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Contact our support team anytime for inquiries regarding
                shipping, returns, or seller communication.
              </p>
              <div className="flex gap-2.5 pt-1">
                <Link
                  to="/faq"
                  className="flex-1 text-center py-2 px-3 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                >
                  FAQ Help
                </Link>
                <Link
                  to="/inbox"
                  className="flex-1 text-center py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  Live Chat
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal Popup */}
      {open && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <RxCross1 size={18} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3 text-xl">
                <FiStar />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Rate & Review Product
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Share your experience to help other buyers.
              </p>
            </div>

            {/* Selected Product Preview */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100 mb-5">
              <img
                src={
                  selectedItem?.images && selectedItem.images[0]?.url
                    ? selectedItem.images[0].url
                    : selectedItem?.image ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
                }
                alt={selectedItem?.name}
                className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {selectedItem?.name}
                </h4>
                <span className="text-[11px] text-slate-500">
                  Qty: {selectedItem?.qty || 1} • $
                  {selectedItem?.discountPrice || selectedItem?.originalPrice}
                </span>
              </div>
            </div>

            <form onSubmit={reviewHandler} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Your Rating <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      type="button"
                      key={i}
                      onClick={() => setRating(i)}
                      className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                    >
                      {rating >= i ? (
                        <AiFillStar className="text-amber-400" />
                      ) : (
                        <AiOutlineStar className="text-slate-300" />
                      )}
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">
                    {rating === 5
                      ? "Excellent!"
                      : rating === 4
                      ? "Good"
                      : rating === 3
                      ? "Average"
                      : rating === 2
                      ? "Poor"
                      : "Terrible"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Your Review / Comments
                </label>
                <textarea
                  rows="4"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="How was the product quality, packaging, and delivery? Share your thoughts..."
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
