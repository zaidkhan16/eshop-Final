import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Layout/Loader";
import {
  HiOutlineShoppingBag,
  HiOutlineArrowLeft,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineReceiptRefund,
  HiOutlineMapPin,
  HiOutlineCreditCard,
  HiOutlineUser,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineChevronRight,
  HiOutlineClipboardDocument,
  HiOutlineCheck,
  HiOutlineArrowPath,
} from "react-icons/hi2";

const OrderDetails = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const data = orders && orders.find((item) => item._id === id);

  useEffect(() => {
    if (data?.status) {
      setStatus(data.status);
    }
  }, [data]);

  const handleCopyId = () => {
    if (data?._id) {
      navigator.clipboard.writeText(data._id);
      setCopiedId(true);
      toast.info("Order ID copied to clipboard!");
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const orderUpdateHandler = async () => {
    if (!status || status === data?.status) {
      toast.info("Please select a new order status to update.");
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Order status updated successfully!");
      if (seller?._id) {
        dispatch(getAllOrdersOfShop(seller._id));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status!"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const refundOrderUpdateHandler = async () => {
    if (!status || status === data?.status) {
      toast.info("Please select a new refund status to update.");
      return;
    }

    setIsUpdating(true);
    try {
      await axios.put(
        `${server}/order/order-refund-success/${id}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Refund status updated successfully!");
      if (seller?._id) {
        dispatch(getAllOrdersOfShop(seller._id));
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update refund status!"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!data) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
          <HiOutlineShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm">
          The order #{id} could not be located in your store orders list.
        </p>
        <Link
          to="/dashboard-orders"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
        >
          <HiOutlineArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>
    );
  }

  const isRefund =
    data.status === "Processing refund" || data.status === "Refund Success";
  const isDelivered = data.status === "Delivered";
  const isShipping =
    data.status === "Shipping" ||
    data.status === "Transferred to delivery partner" ||
    data.status === "On the way";

  // Standard status progression list
  const standardStatuses = [
    "Processing",
    "Transferred to delivery partner",
    "Shipping",
    "Received",
    "On the way",
    "Delivered",
  ];

  const refundStatuses = ["Processing refund", "Refund Success"];

  const availableStatuses = isRefund
    ? refundStatuses.slice(refundStatuses.indexOf(data.status))
    : standardStatuses.slice(Math.max(0, standardStatuses.indexOf(data.status)));

  const totalItemsCount =
    data.cart?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Breadcrumb & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
            <Link
              to="/dashboard"
              className="hover:text-indigo-600 transition-colors"
            >
              Dashboard
            </Link>
            <HiOutlineChevronRight className="w-3 h-3 text-slate-400" />
            <Link
              to="/dashboard-orders"
              className="hover:text-indigo-600 transition-colors"
            >
              Orders
            </Link>
            <HiOutlineChevronRight className="w-3 h-3 text-slate-400" />
            <span className="font-semibold text-slate-800">
              #{data._id.slice(0, 8)}...
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
              <HiOutlineShoppingBag className="w-5 h-5" />
            </div>
            <span>Order #{data._id.slice(0, 8)}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard-orders"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
          >
            <HiOutlineArrowLeft className="w-3.5 h-3.5" />
            <span>All Orders</span>
          </Link>
          <button
            onClick={handleCopyId}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
          >
            {copiedId ? (
              <>
                <HiOutlineCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <HiOutlineClipboardDocument className="w-4 h-4 text-slate-500" />
                <span>Copy Order ID</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Status Banner */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isDelivered
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : isRefund
                ? "bg-rose-50 text-rose-600 border border-rose-200"
                : isShipping
                ? "bg-indigo-50 text-indigo-600 border border-indigo-200"
                : "bg-amber-50 text-amber-600 border border-amber-200"
            }`}
          >
            {isDelivered ? (
              <HiOutlineCheckCircle className="w-6 h-6" />
            ) : isRefund ? (
              <HiOutlineReceiptRefund className="w-6 h-6" />
            ) : isShipping ? (
              <HiOutlineTruck className="w-6 h-6" />
            ) : (
              <HiOutlineClock className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Current Status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isDelivered
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : isRefund
                    ? "bg-rose-50 text-rose-800 border border-rose-200"
                    : isShipping
                    ? "bg-indigo-50 text-indigo-800 border border-indigo-200"
                    : "bg-amber-50 text-amber-800 border border-amber-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isDelivered
                      ? "bg-emerald-500"
                      : isRefund
                      ? "bg-rose-500"
                      : isShipping
                      ? "bg-indigo-500"
                      : "bg-amber-500 animate-pulse"
                  }`}
                />
                {data.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on{" "}
              {new Date(data.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Status Update Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:self-center">
          <label className="text-xs font-semibold text-slate-700 hidden md:inline-block">
            Update Status:
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={isUpdating || data.status === "Delivered"}
            className="px-3 py-2 bg-slate-50 border border-slate-200 text-xs font-semibold rounded-xl text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all disabled:opacity-50"
          >
            {availableStatuses.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            onClick={isRefund ? refundOrderUpdateHandler : orderUpdateHandler}
            disabled={isUpdating || status === data.status || data.status === "Delivered"}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            {isUpdating ? (
              <>
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <HiOutlineArrowPath className="w-3.5 h-3.5" />
                <span>Save Status</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main 2-Column Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Items Ordered & Summary) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Purchased Products Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HiOutlineShoppingBag className="w-4 h-4 text-indigo-600" />
                <span>Items in Order</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">
                {totalItemsCount} total item{totalItemsCount > 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {data.cart?.map((item, index) => {
                const imgUrl =
                  item.images?.[0]?.url ||
                  item.image_Url?.[0]?.url ||
                  "https://via.placeholder.com/100";
                const itemTotal = (
                  (Number(item.discountPrice) || 0) * (item.qty || 1)
                ).toFixed(2);

                return (
                  <div
                    key={index}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={imgUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-slate-50 flex-shrink-0 shadow-xs"
                      />
                      <div className="min-w-0 space-y-0.5">
                        <Link
                          to={`/product/${item._id}`}
                          className="font-bold text-xs sm:text-sm text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <p className="text-[11px] text-slate-500 font-medium">
                          ${Number(item.discountPrice || 0).toFixed(2)} × {item.qty} unit
                          {item.qty > 1 ? "s" : ""}
                        </p>
                        {item._id && (
                          <span className="text-[10px] text-slate-400 font-mono block">
                            SKU / ID: #{item._id.slice(0, 8)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right sm:self-center">
                      <span className="text-sm sm:text-base font-extrabold text-slate-900">
                        ${itemTotal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Payment & Financial Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <HiOutlineCreditCard className="w-4 h-4 text-emerald-600" />
              <span>Payment & Price Breakdown</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-slate-900">
                  ${data.totalPrice ? Number(data.totalPrice).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping & Handling:</span>
                <span className="font-semibold text-emerald-600">Free ($0.00)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Method:</span>
                <span className="font-semibold text-slate-900">
                  {data.paymentInfo?.type || "Online Card Payment"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Payment Status:</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <HiOutlineCheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  {data.paymentInfo?.status || "Paid"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
                <span className="font-bold text-slate-900">Total Order Amount:</span>
                <span className="text-lg font-black text-slate-900">
                  ${data.totalPrice ? Number(data.totalPrice).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Customer & Shipping Details) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <HiOutlineUser className="w-4 h-4 text-indigo-600" />
              <span>Customer Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm flex-shrink-0 border border-indigo-100">
                  {data.user?.name ? data.user.name[0] : "C"}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">
                    {data.user?.name || "Customer"}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Buyer Account
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-slate-600">
                {data.user?.email && (
                  <div className="flex items-center gap-2">
                    <HiOutlineEnvelope className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{data.user.email}</span>
                  </div>
                )}
                {data.user?.phoneNumber && (
                  <div className="flex items-center gap-2">
                    <HiOutlinePhone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{data.user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <HiOutlineMapPin className="w-4 h-4 text-indigo-600" />
              <span>Delivery Address</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-900">
                {data.shippingAddress?.address1 || ""}{" "}
                {data.shippingAddress?.address2 || ""}
              </p>
              <p>
                {data.shippingAddress?.city || ""},{" "}
                {data.shippingAddress?.country || ""}
              </p>
              {data.shippingAddress?.zipCode && (
                <p className="font-mono text-slate-500">
                  Postal Code: {data.shippingAddress.zipCode}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
