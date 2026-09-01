import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import {
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiMapPin,
  FiHome,
  FiCopy,
  FiCheck,
  FiSearch,
  FiArrowLeft,
  FiPrinter,
  FiHelpCircle,
  FiClock,
  FiRefreshCw,
  FiShield,
  FiExternalLink,
} from "react-icons/fi";
import {
  HiOutlineCube,
  HiOutlineSparkles,
  HiOutlineLocationMarker,
  HiOutlineReceiptTax,
  HiOutlineCreditCard,
  HiOutlinePhone,
  HiOutlineUser,
} from "react-icons/hi";
import { toast } from "react-toastify";

const TrackOrder = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [copied, setCopied] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  // Determine current active order
  const activeOrder = useMemo(() => {
    if (!orders || orders.length === 0) return null;
    if (id) {
      return orders.find((item) => item._id === id) || null;
    }
    // If no ID param provided, default to most recent order
    return orders[0];
  }, [orders, id]);

  const handleCopyId = (orderId) => {
    if (!orderId) return;
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSearchOrder = (e) => {
    e.preventDefault();
    const cleanQuery = searchInput.trim();
    if (!cleanQuery) {
      toast.warning("Please enter an Order ID");
      return;
    }
    const matched = orders?.find(
      (o) =>
        o._id.toLowerCase() === cleanQuery.toLowerCase() ||
        o._id.toLowerCase().includes(cleanQuery.toLowerCase())
    );
    if (matched) {
      navigate(`/user/track/order/${matched._id}`);
      setSearchInput("");
    } else {
      toast.error("No order found matching that ID in your account");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Define tracking steps configuration based on order status
  const standardSteps = [
    {
      key: "Processing",
      title: "Order Placed & Verified",
      sub: "Seller is preparing items",
      icon: FiCheckCircle,
      description: "Payment has been confirmed and the seller is packaging your items for courier pickup.",
    },
    {
      key: "Transferred to delivery partner",
      title: "Handed to Logistics",
      sub: "Carrier pickup complete",
      icon: FiPackage,
      description: "Package has departed the seller hub and was handed over to the express logistics network.",
    },
    {
      key: "Shipping",
      title: "In Transit",
      sub: "Moving between hubs",
      icon: FiTruck,
      description: "Your parcel is traveling through regional transit sorting facilities towards your local city hub.",
    },
    {
      key: "Received",
      title: "Arrived at Local Hub",
      sub: "Sorted for destination",
      icon: FiMapPin,
      description: "Shipment reached your local sorting station and is being assigned to a delivery executive.",
    },
    {
      key: "On the way",
      title: "Out for Delivery",
      sub: "Courier en route to you",
      icon: HiOutlineLocationMarker,
      description: "The courier is currently on the delivery route. Please keep your phone accessible.",
    },
    {
      key: "Delivered",
      title: "Delivered Successfully",
      sub: "Signed & received",
      icon: FiHome,
      description: "Package was safely delivered to the destination address.",
    },
  ];

  const refundSteps = [
    {
      key: "Processing refund",
      title: "Refund Initiated",
      sub: "Request in verification",
      icon: FiRefreshCw,
      description: "Your refund request has been approved and is being processed with the merchant bank.",
    },
    {
      key: "Refund Success",
      title: "Refund Completed",
      sub: "Credited to account",
      icon: FiShield,
      description: "The full refund amount has been successfully returned to your original payment method.",
    },
  ];

  const isRefundFlow =
    activeOrder?.status === "Processing refund" ||
    activeOrder?.status === "Refund Success";

  // Calculate current active step index
  const getStepProgress = (status) => {
    if (isRefundFlow) {
      if (status === "Refund Success") return { currentStep: 1, total: 2, percent: 100 };
      return { currentStep: 0, total: 2, percent: 50 };
    }

    const stepMap = {
      Processing: 0,
      "Transferred to delivery partner": 1,
      Shipping: 2,
      Received: 3,
      "On the way": 4,
      Delivered: 5,
    };

    const idx = stepMap[status] !== undefined ? stepMap[status] : 0;
    const percent = Math.round((idx / (standardSteps.length - 1)) * 100);
    return { currentStep: idx, total: standardSteps.length, percent };
  };

  const progressInfo = activeOrder
    ? getStepProgress(activeOrder.status)
    : { currentStep: 0, total: 6, percent: 0 };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          dot: "bg-emerald-500",
          label: "Delivered",
        };
      case "On the way":
        return {
          bg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
          dot: "bg-purple-500 animate-ping",
          label: "Out for Delivery",
        };
      case "Shipping":
      case "Received":
        return {
          bg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          dot: "bg-blue-500 animate-pulse",
          label: "In Transit",
        };
      case "Transferred to delivery partner":
        return {
          bg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
          dot: "bg-indigo-500",
          label: "Handed to Courier",
        };
      case "Processing refund":
        return {
          bg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          dot: "bg-amber-500 animate-pulse",
          label: "Refund In Progress",
        };
      case "Refund Success":
        return {
          bg: "bg-rose-500/10 text-rose-600 border-rose-500/20",
          dot: "bg-rose-500",
          label: "Refund Completed",
        };
      case "Processing":
      default:
        return {
          bg: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20",
          dot: "bg-indigo-500 animate-pulse",
          label: "Processing in Hub",
        };
    }
  };

  // Estimate delivery date calculation
  const getEstimatedDelivery = (order) => {
    if (!order) return "3-5 Business Days";
    if (order.status === "Delivered") {
      const delDate = order.deliveredAt
        ? new Date(order.deliveredAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Recently Delivered";
      return `Delivered on ${delDate}`;
    }
    const orderDate = new Date(order.createdAt || Date.now());
    const estDate = new Date(orderDate);
    estDate.setDate(estDate.getDate() + 4);
    return estDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Simulated Courier ID
  const trackingNumber = useMemo(() => {
    if (!activeOrder) return "TRK-LUM-982341";
    const suffix = activeOrder._id.slice(-6).toUpperCase();
    return `LUM-${suffix}-EXP`;
  }, [activeOrder]);

  if (isLoading && (!orders || orders.length === 0)) {
    return <Loader />;
  }

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
              <span className="text-indigo-600">Track Shipment</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              Live Product Tracking
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                <HiOutlineSparkles className="text-indigo-500" /> Realtime
              </span>
            </h1>
          </div>

          {/* Search bar & Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <form
              onSubmit={handleSearchOrder}
              className="relative flex-1 sm:w-72"
            >
              <input
                type="text"
                placeholder="Track by Order ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all"
              />
              <FiSearch className="absolute left-3 top-3.5 text-slate-400 text-sm" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                Go
              </button>
            </form>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors print:hidden"
              title="Print Tracking Summary"
            >
              <FiPrinter className="text-slate-500 text-sm" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
          </div>
        </div>

        {/* Quick Order Switcher if User Has Multiple Orders */}
        {orders && orders.length > 1 && (
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between gap-4 mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <HiOutlineCube className="text-indigo-500 text-sm" /> Switch
                Shipment ({orders.length} Active Orders)
              </span>
              <span className="text-xs text-slate-400">
                Click any order to track
              </span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {orders.map((ord) => {
                const isSelected = ord._id === activeOrder?._id;
                const statusBadge = getStatusBadge(ord.status);
                return (
                  <button
                    key={ord._id}
                    onClick={() => navigate(`/user/track/order/${ord._id}`)}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all text-left flex items-center gap-2.5 ${
                      isSelected
                        ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/20"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    <span className="font-mono font-bold">
                      #{ord._id.slice(0, 8)}...
                    </span>
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        isSelected ? "bg-white" : statusBadge.dot.split(" ")[0]
                      }`}
                    />
                    <span
                      className={`text-[11px] ${
                        isSelected ? "text-indigo-100" : "text-slate-500"
                      }`}
                    >
                      ${ord.totalPrice}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Tracking Content Area */}
        {!activeOrder ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FiSearch />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No Active Order Selected
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Please enter your Order ID above or browse your order history to
              track your package status in real-time.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 transition-all"
            >
              <FiArrowLeft /> View All My Orders
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Status Hero Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10 pb-6 border-b border-slate-100">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                        getStatusBadge(activeOrder.status).bg
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          getStatusBadge(activeOrder.status).dot
                        }`}
                      />
                      {getStatusBadge(activeOrder.status).label}
                    </span>

                    <span className="text-xs font-medium text-slate-400">
                      Placed on:{" "}
                      <strong className="text-slate-700 font-semibold">
                        {new Date(
                          activeOrder.createdAt || Date.now()
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-mono">
                      #{activeOrder._id}
                    </h2>
                    <button
                      onClick={() => handleCopyId(activeOrder._id)}
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

                {/* Estimated Delivery Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:px-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-md shadow-indigo-500/20">
                    <FiClock />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      {activeOrder.status === "Delivered"
                        ? "Delivery Status"
                        : "Estimated Delivery"}
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-slate-900">
                      {getEstimatedDelivery(activeOrder)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Summary Bar */}
              <div className="pt-6">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
                  <span>Shipment Progress</span>
                  <span className="text-indigo-600 font-bold">
                    {progressInfo.percent}% Completed
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-600 transition-all duration-700 ease-out shadow-xs"
                    style={{ width: `${progressInfo.percent}%` }}
                  />
                </div>
              </div>

              {/* Visual Stepper Timeline */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
                  {(isRefundFlow ? refundSteps : standardSteps).map(
                    (step, index) => {
                      const isCompleted = index <= progressInfo.currentStep;
                      const isCurrent = index === progressInfo.currentStep;
                      const StepIcon = step.icon;

                      return (
                        <div
                          key={step.key}
                          className={`relative flex flex-col items-start lg:items-center text-left lg:text-center p-3.5 rounded-2xl transition-all ${
                            isCurrent
                              ? "bg-indigo-50/60 border border-indigo-100 shadow-xs"
                              : ""
                          }`}
                        >
                          {/* Step Icon & Connector */}
                          <div className="relative mb-3 flex items-center justify-center">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-all duration-300 ${
                                isCurrent
                                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110 ring-4 ring-indigo-100"
                                  : isCompleted
                                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
                                  : "bg-slate-100 text-slate-400 border border-slate-200"
                              }`}
                            >
                              <StepIcon />
                            </div>

                            {/* Status badge pill for mobile / compact */}
                            {isCurrent && (
                              <span className="absolute -top-2.5 -right-2 px-1.5 py-0.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-xs">
                                Live
                              </span>
                            )}
                          </div>

                          {/* Step Title & Subtitle */}
                          <h4
                            className={`text-xs sm:text-sm font-bold tracking-tight mb-0.5 ${
                              isCurrent
                                ? "text-indigo-950"
                                : isCompleted
                                ? "text-slate-900"
                                : "text-slate-400"
                            }`}
                          >
                            {step.title}
                          </h4>
                          <span
                            className={`text-[11px] font-medium leading-tight mb-2 ${
                              isCurrent
                                ? "text-indigo-600 font-semibold"
                                : isCompleted
                                ? "text-emerald-600"
                                : "text-slate-400"
                            }`}
                          >
                            {step.sub}
                          </span>

                          <p className="text-[11px] text-slate-500 leading-relaxed hidden lg:block">
                            {step.description}
                          </p>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* 2-Column Grid: Left Package Items & Right Logistics Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column (2 Cols): Package Items & Order Status Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Package Items Card */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 text-lg">
                        <FiPackage />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                          Package Contents
                        </h3>
                        <span className="text-xs text-slate-500">
                          {activeOrder.cart?.length || 0} item(s) in this
                          shipment
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/user/order/${activeOrder._id}`}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
                    >
                      View Order Invoice <FiExternalLink />
                    </Link>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {activeOrder.cart &&
                      activeOrder.cart.map((item, index) => {
                        const imgUrl =
                          item?.images && item.images.length > 0
                            ? item.images[0]?.url
                            : item.image ||
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300";

                        const itemPrice =
                          item.discountPrice || item.originalPrice || 0;
                        const lineTotal = (
                          itemPrice * (item.qty || 1)
                        ).toFixed(2);

                        return (
                          <div
                            key={index}
                            className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
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
                                    <strong className="text-slate-800">
                                      {item.qty || 1}
                                    </strong>
                                  </span>
                                  <span>•</span>
                                  <span>
                                    Unit Price:{" "}
                                    <strong className="text-slate-800">
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

                            <div className="sm:text-right flex sm:flex-col justify-between w-full sm:w-auto items-center sm:items-end">
                              <span className="text-base font-black text-slate-900">
                                ${lineTotal}
                              </span>
                              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                Verified
                              </span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Simulated Live Route Radar & Logistics Hubs */}
                <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-xl relative overflow-hidden">
                  {/* Decorative radar rings */}
                  <div className="absolute top-1/2 right-1/4 w-72 h-72 rounded-full border border-indigo-500/10 pointer-events-none animate-pulse" />
                  <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full border border-indigo-500/20 pointer-events-none" />

                  <div className="flex items-center justify-between pb-4 border-b border-indigo-500/20 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 text-lg border border-indigo-500/30">
                        <FiTruck />
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white tracking-tight">
                          Live Transit Route
                        </h3>
                        <span className="text-xs text-indigo-300">
                          Priority Carrier Network
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Active Dispatch
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                    <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block">
                        Origin Checkpoint
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        Global Distribution Center
                      </h4>
                      <p className="text-xs text-slate-400">
                        San Francisco Logistics Hub, CA
                      </p>
                    </div>

                    <div className="space-y-1 bg-indigo-500/10 p-4 rounded-2xl border border-indigo-500/30">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block">
                        Current Waypoint
                      </span>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                        Sorting Facility
                      </h4>
                      <p className="text-xs text-slate-300">
                        Regional Sorting Station
                      </p>
                    </div>

                    <div className="space-y-1 bg-white/5 p-4 rounded-2xl border border-white/10">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 block">
                        Final Destination
                      </span>
                      <h4 className="text-sm font-bold text-white">
                        {activeOrder.shippingAddress?.city ||
                          "Destination City"}
                        , {activeOrder.shippingAddress?.country || "USA"}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Postal Code:{" "}
                        {activeOrder.shippingAddress?.zipCode || "XXXXX"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column (1 Col): Carrier Info, Address, Payment & Help */}
              <div className="space-y-6">
                {/* Carrier & Tracking Number Card */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Carrier Information
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-slate-900">
                        Lumina Express Air
                      </h4>
                      <span className="text-xs text-slate-500">
                        Guaranteed Expedited Delivery
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                      Express
                    </span>
                  </div>

                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Tracking Number
                      </span>
                      <span className="font-mono font-bold text-xs sm:text-sm text-slate-800">
                        {trackingNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyId(trackingNumber)}
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-xl transition-all shadow-xs border border-transparent hover:border-slate-200"
                      title="Copy Tracking Number"
                    >
                      <FiCopy className="text-sm" />
                    </button>
                  </div>
                </div>

                {/* Delivery Recipient & Address */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <HiOutlineLocationMarker className="text-indigo-600 text-lg" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Delivery Address
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-600">
                    <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                      <HiOutlineUser className="text-slate-400" />
                      {activeOrder.user?.name || "Customer"}
                    </div>

                    <div className="pl-6 space-y-0.5">
                      <p className="text-slate-800 font-medium">
                        {activeOrder.shippingAddress?.address1}
                        {activeOrder.shippingAddress?.address2
                          ? `, ${activeOrder.shippingAddress.address2}`
                          : ""}
                      </p>
                      <p className="text-slate-600">
                        {activeOrder.shippingAddress?.city},{" "}
                        {activeOrder.shippingAddress?.state || ""}{" "}
                        {activeOrder.shippingAddress?.zipCode}
                      </p>
                      <p className="text-slate-600 font-semibold">
                        {activeOrder.shippingAddress?.country}
                      </p>
                    </div>

                    {activeOrder.shippingAddress?.phoneNumber && (
                      <div className="pt-2 flex items-center gap-2 text-xs text-slate-600 font-medium">
                        <HiOutlinePhone className="text-indigo-500 text-sm" />
                        <span>
                          {activeOrder.shippingAddress.phoneNumber}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <HiOutlineReceiptTax className="text-indigo-600 text-lg" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Payment & Summary
                    </h3>
                  </div>

                  <div className="space-y-2.5 text-xs text-slate-600 border-b border-slate-100 pb-3">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-semibold text-slate-900">
                        ${activeOrder.totalPrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span className="font-semibold text-emerald-600">
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method</span>
                      <span className="font-semibold text-slate-900 flex items-center gap-1">
                        <HiOutlineCreditCard className="text-slate-400" />
                        {activeOrder.paymentInfo?.type || "Online Payment"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <span className="text-sm font-bold text-slate-900">
                      Total Paid
                    </span>
                    <span className="text-xl font-black text-indigo-600">
                      ${activeOrder.totalPrice}
                    </span>
                  </div>
                </div>

                {/* Need Help / Live Support Card */}
                <div className="bg-gradient-to-br from-indigo-50 via-violet-50 to-indigo-50/60 rounded-3xl p-6 border border-indigo-100 shadow-xs space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-lg shadow-md shadow-indigo-500/20">
                      <FiHelpCircle />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Need Help With Delivery?
                      </h4>
                      <span className="text-xs text-slate-500">
                        24/7 dedicated support team
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Have questions about delayed parcels, delivery address
                    changes, or package instructions?
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
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
