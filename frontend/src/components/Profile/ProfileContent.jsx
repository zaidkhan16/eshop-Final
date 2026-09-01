import React, { useState, useEffect, useMemo } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLock,
} from "react-icons/ai";
import {
  FiUser,
  FiPhone,
  FiTruck,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiArrowRight,
} from "react-icons/fi";
import {
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineLockClosed,
  HiOutlineMail,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { DataGrid } from "@mui/x-data-grid";
import { Button } from "@mui/material";

import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
} from "../../redux/actions/user";
import { Country, State, City } from "country-state-city";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import Loader from "../Layout/Loader";

const ProfileContent = ({ active }) => {
  const { user, error, successMessage } = useSelector((state) => state.user);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      setUpdateLoading(false);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      setUpdateLoading(false);
      setPassword("");
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter your current password to authorize changes.");
      return;
    }
    setUpdateLoading(true);
    dispatch(updateUserInformation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    setAvatarLoading(true);

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/user/update-avatar`,
            { avatar: reader.result },
            {
              withCredentials: true,
            }
          )
          .then((response) => {
            dispatch(loadUser());
            toast.success("Profile avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response?.data?.message || error.message || "Failed to update avatar");
          })
          .finally(() => {
            setAvatarLoading(false);
          });
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <div className="w-full max-w-4xl mx-auto space-y-6">
          {/* 1. Profile Hero Identity Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl">
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar with glowing ring & upload button */}
              <div className="relative group">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden ring-4 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20 bg-slate-800">
                  <img
                    src={avatar || user?.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80"}
                    alt={user?.name || "Profile"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <label
                  htmlFor="profile-avatar-upload"
                  className="absolute -bottom-2 -right-2 p-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-all"
                  title="Update Profile Picture"
                >
                  {avatarLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <AiOutlineCamera size={18} />
                  )}
                </label>
                <input
                  type="file"
                  id="profile-avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImage}
                />
              </div>

              {/* User Quick Info */}
              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {user?.name || "Nexus Member"}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <HiOutlineShieldCheck size={14} /> Verified Account
                  </span>
                </div>

                <p className="text-slate-400 text-xs sm:text-sm font-mono mb-4 flex items-center justify-center sm:justify-start gap-1.5">
                  <HiOutlineMail className="text-indigo-400" /> {user?.email}
                </p>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 font-medium">
                    Role: <strong className="text-indigo-400">{user?.role || "Customer"}</strong>
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300 font-medium">
                    Joined: <strong className="text-slate-200">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Main Profile Edit Form Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your display username and delivery contact phone number.
                </p>
              </div>
              <span className="text-xs px-3 py-1 bg-indigo-50 text-indigo-700 font-semibold rounded-full border border-indigo-100">
                Account Settings
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* USERNAME / FULL NAME (EDITABLE - UNIQUE MODERN CARD) */}
                <div className="relative group bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-500/50 hover:bg-indigo-50/20 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <FiUser className="text-indigo-600" size={15} />
                      Username / Full Name
                    </label>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-100/80 text-indigo-700 rounded-md">
                      Editable
                    </span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                    <HiOutlineSparkles className="text-indigo-500" size={13} />
                    Public name displayed on your account & reviews
                  </p>
                </div>

                {/* EMAIL ADDRESS (LOCKED / PROTECTED - CANNOT CHANGE) */}
                <div className="relative bg-slate-100/80 p-4 rounded-2xl border border-slate-200 text-slate-500">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                      <HiOutlineMail className="text-slate-500" size={16} />
                      Email Address
                    </label>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md flex items-center gap-1">
                      <HiOutlineLockClosed size={12} /> Locked
                    </span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="email"
                      disabled
                      value={email || ""}
                      readOnly
                      className="w-full bg-slate-200/60 border border-slate-300/80 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 cursor-not-allowed select-none opacity-80"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                    <HiOutlineShieldCheck className="text-slate-500" size={13} />
                    Primary security ID • Locked for account safety
                  </p>
                </div>

                {/* PHONE NUMBER (EDITABLE - UNIQUE MODERN CARD) */}
                <div className="relative group bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-500/50 hover:bg-indigo-50/20 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <FiPhone className="text-indigo-600" size={15} />
                      Phone Number
                    </label>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-indigo-100/80 text-indigo-700 rounded-md">
                      Editable
                    </span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type="tel"
                      required
                      value={phoneNumber || ""}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs transition-all"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                    <HiOutlineSparkles className="text-indigo-500" size={13} />
                    Used for delivery notifications and SMS alerts
                  </p>
                </div>

                {/* SECURITY PASSWORD CONFIRMATION */}
                <div className="relative group bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 hover:border-indigo-500/50 hover:bg-indigo-50/20 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                      <AiOutlineLock className="text-indigo-600" size={16} />
                      Confirm Password
                    </label>
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-rose-50 text-rose-600 rounded-md">
                      Required
                    </span>
                  </div>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full bg-white border border-slate-200 rounded-xl pl-4 pr-11 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 shadow-xs transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <AiOutlineEye size={18} /> : <AiOutlineEyeInvisible size={18} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1">
                    <HiOutlineShieldCheck className="text-indigo-500" size={13} />
                    Enter password to securely authorize profile updates
                  </p>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                <p className="text-xs text-slate-500 text-center sm:text-left">
                  🔒 All profile updates are encrypted and verified in real-time.
                </p>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setName(user?.name || "");
                      setPhoneNumber(user?.phoneNumber || "");
                      setPassword("");
                    }}
                    className="px-5 py-3 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all w-full sm:w-auto"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="px-7 py-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform active:scale-95 transition-all flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-50"
                  >
                    {updateLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineSparkles size={16} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders, isLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pl-8 pt-1">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders, isLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Delivered"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "US$ " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="pl-8 pt-1">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            autoHeight
            disableSelectionOnClick
          />
        </div>
      )}
    </>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders, isLoading } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user]);

  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    if (!searchTerm.trim()) return orders;
    const q = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        o._id.toLowerCase().includes(q) ||
        o.status?.toLowerCase().includes(q) ||
        o.cart?.some((item) => item.name?.toLowerCase().includes(q))
    );
  }, [orders, searchTerm]);

  const stats = useMemo(() => {
    if (!orders) return { total: 0, active: 0, delivered: 0 };
    const total = orders.length;
    const delivered = orders.filter((o) => o.status === "Delivered").length;
    const active = total - delivered;
    return { total, active, delivered };
  }, [orders]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return {
          bg: "bg-emerald-50 text-emerald-600 border-emerald-200",
          dot: "bg-emerald-500",
          percent: 100,
        };
      case "On the way":
        return {
          bg: "bg-purple-50 text-purple-600 border-purple-200",
          dot: "bg-purple-500",
          percent: 85,
        };
      case "Shipping":
      case "Received":
        return {
          bg: "bg-blue-50 text-blue-600 border-blue-200",
          dot: "bg-blue-500",
          percent: 60,
        };
      case "Transferred to delivery partner":
        return {
          bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
          dot: "bg-indigo-500",
          percent: 35,
        };
      case "Processing refund":
      case "Refund Success":
        return {
          bg: "bg-amber-50 text-amber-600 border-amber-200",
          dot: "bg-amber-500",
          percent: 50,
        };
      case "Processing":
      default:
        return {
          bg: "bg-indigo-50 text-indigo-600 border-indigo-200",
          dot: "bg-indigo-500",
          percent: 15,
        };
    }
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Status",
      minWidth: 140,
      flex: 0.7,
      renderCell: (params) => {
        const badge = getStatusBadge(params.value);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
            {params.value}
          </span>
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 100,
      flex: 0.5,
    },
    {
      field: "total",
      headerName: "Total Amount",
      type: "number",
      minWidth: 120,
      flex: 0.6,
    },
    {
      field: "action",
      flex: 0.8,
      minWidth: 140,
      headerName: "Action",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link
            to={`/user/track/order/${params.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-colors"
          >
            <MdTrackChanges size={16} /> Track
          </Link>
        );
      },
    },
  ];

  const row = [];
  filteredOrders &&
    filteredOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "$" + item.totalPrice,
        status: item.status,
      });
    });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full pl-0 sm:pl-6 space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 block mb-1">
              Live Logistics Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Track Your Shipments
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md">
              Follow real-time courier updates, estimated delivery dates, and package transit stages.
            </p>
          </div>

          {/* Quick Stat Pills */}
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total</span>
              <span className="text-xl font-extrabold text-white">{stats.total}</span>
            </div>
            <div className="bg-indigo-500/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-indigo-400/30 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-indigo-300 block">Active</span>
              <span className="text-xl font-extrabold text-indigo-200">{stats.active}</span>
            </div>
            <div className="bg-emerald-500/20 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-emerald-400/30 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">Delivered</span>
              <span className="text-xl font-extrabold text-emerald-200">{stats.delivered}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Toggles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search by Order ID or product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
          />
          <FiSearch className="absolute left-3 top-3 text-slate-400 text-sm" />
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-end sm:self-auto">
          <button
            onClick={() => setViewMode("cards")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "cards"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Cards View
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "table"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Shipment Content Views */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 text-2xl">
            <FiTruck />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">No Orders Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchTerm
              ? "No orders match your search query. Try searching with a different order ID."
              : "You haven't placed any orders yet."}
          </p>
        </div>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOrders.map((ord) => {
            const badge = getStatusBadge(ord.status);
            return (
              <div
                key={ord._id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-indigo-200 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-900 block">
                      Order #{ord._id.slice(0, 10)}...
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(ord.createdAt || Date.now()).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${badge.bg}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                    {ord.status}
                  </span>
                </div>

                {/* Progress bar preview */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                    <span>Tracking Progress</span>
                    <span className="font-bold text-indigo-600">{badge.percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
                      style={{ width: `${badge.percent}%` }}
                    />
                  </div>
                </div>

                {/* Items preview */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <div className="flex -space-x-2 overflow-hidden py-1">
                    {ord.cart?.slice(0, 4).map((item, idx) => {
                      const img =
                        item?.images && item.images[0]?.url
                          ? item.images[0].url
                          : item.image ||
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100";
                      return (
                        <img
                          key={idx}
                          src={img}
                          alt={item.name}
                          className="inline-block h-9 w-9 rounded-xl ring-2 ring-white object-cover bg-slate-100"
                          title={item.name}
                        />
                      );
                    })}
                    {ord.cart?.length > 4 && (
                      <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-slate-100 ring-2 ring-white text-[10px] font-bold text-slate-600">
                        +{ord.cart.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total</span>
                    <span className="text-sm font-black text-slate-900">${ord.totalPrice}</span>
                  </div>
                </div>

                {/* Action button */}
                <Link
                  to={`/user/track/order/${ord._id}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <MdTrackChanges size={16} /> Track Live Shipment <FiArrowRight />
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
        </div>
      )}
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.success);
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || error.message || "Failed to update password!");
      });
  };
  return (
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className=" w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a24db] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleZipCodeChange = async (val) => {
    setZipCode(val);
    const cleanPin = val ? val.toString().trim() : "";
    if (cleanPin.length < 5) return;

    try {
      if (/^\d{6}$/.test(cleanPin)) {
        const res = await axios.get(`https://api.postalpincode.in/pincode/${cleanPin}`);
        if (res.data && res.data[0]?.Status === "Success" && res.data[0].PostOffice?.length) {
          const po = res.data[0].PostOffice[0];
          const detectedState = po.State;
          const detectedCity = po.District || po.Block || po.Name;
          
          setCountry("IN");
          const statesList = State.getStatesOfCountry("IN");
          const matchedSt = statesList.find(
            (s) => s.name.toLowerCase() === detectedState.toLowerCase()
          );
          if (matchedSt) {
            setState(matchedSt.isoCode);
            setCity(detectedCity);
            toast.success(`PIN Code Analyzed: ${detectedCity}, ${detectedState}`);
          }
        }
      } else if (/^\d{5}$/.test(cleanPin)) {
        const cCode = country || "US";
        const res = await axios.get(`https://api.zippopotam.us/${cCode.toLowerCase()}/${cleanPin}`);
        if (res.data && res.data.places && res.data.places[0]) {
          const place = res.data.places[0];
          const placeName = place["place name"];
          const stateName = place["state"];
          const stateAbbr = place["state abbreviation"];
          
          const statesList = State.getStatesOfCountry(cCode);
          const matchedSt = statesList.find(
            (s) => s.name.toLowerCase() === stateName.toLowerCase() || s.isoCode === stateAbbr
          );
          if (matchedSt) {
            setState(matchedSt.isoCode);
          }
          setCity(placeName);
          toast.success(`Zip Code Analyzed: ${placeName}, ${stateName}`);
        }
      }
    } catch (err) {
      console.log("Pincode lookup error:", err);
    }
  };

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === "" || country === "" || city === "") {
      toast.error("Please fill all the fields!");
    } else {
      dispatch(
        updatUserAddress(
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType
        )
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode(null);
      setAddressType("");
    }
  };

  const handleDelete = (item) => {
    const id = item._id;
    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">
              Add New Address
            </h1>
            <div className="w-full">
              <form aria-required onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block pb-2 text-xs font-bold uppercase tracking-wider text-slate-700">Country</label>
                    <select
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setState("");
                        setCity("");
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="">Choose Country</option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2 text-xs font-bold uppercase tracking-wider text-slate-700">State / Province</label>
                    <select
                      value={state}
                      onChange={(e) => {
                        setState(e.target.value);
                        setCity("");
                      }}
                      disabled={!country}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all cursor-pointer"
                    >
                      <option value="">Choose State</option>
                      {country &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2 text-xs font-bold uppercase tracking-wider text-slate-700">City</label>
                    {country && state && City.getCitiesOfState(country, state).length > 0 ? (
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="">Choose City</option>
                        {City.getCitiesOfState(country, state).map((item) => (
                          <option key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter City"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all"
                      />
                    )}
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>
                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2 text-xs font-bold uppercase tracking-wider text-slate-700">Zip Code / PIN Code</label>
                    <input
                      type="text"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-500 transition-all"
                      required
                      placeholder="Type PIN code to auto-analyze"
                      value={zipCode}
                      onChange={(e) => handleZipCodeChange(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type</label>
                    <select
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-[95%] border h-[40px] rounded-[5px]"
                    >
                      <option value="" className="block border pb-2">
                        Choose your Address Type
                      </option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option
                            className="block pb-2"
                            key={item.name}
                            value={item.name}
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className=" w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer`}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          My Addresses
        </h1>
        <div
          className={`${styles.button} !rounded-md`}
          onClick={() => setOpen(true)}
        >
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
            key={index}
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {item.address1} {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {user && user.phoneNumber}
              </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}

      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">
          You not have any saved address!
        </h5>
      )}
    </div>
  );
};
export default ProfileContent;
