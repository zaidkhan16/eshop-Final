import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { server } from "../../server";
import { toast } from "react-toastify";
import { loadSeller } from "../../redux/actions/user";
import axios from "axios";
import {
  HiOutlineBanknotes,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlineShieldCheck,
  HiOutlineBuildingLibrary,
  HiOutlineCurrencyDollar,
  HiOutlineArrowPath,
  HiOutlineXMark,
  HiOutlineShoppingBag,
  HiOutlineClock,
} from "react-icons/hi2";

const WithdrawMoney = () => {
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openBankModal, setOpenBankModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [bankInfo, setBankInfo] = useState({
    bankName: "",
    bankCountry: "",
    bankSwiftCode: "",
    bankAccountNumber: "",
    bankHolderName: "",
    bankAddress: "",
  });

  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { orders } = useSelector((state) => state.order);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller]);

  const availableBalance = seller?.availableBalance
    ? Number(seller.availableBalance)
    : 0;
  const isEligibleToWithdraw = availableBalance >= 50;

  // Lifetime metrics
  const financialMetrics = useMemo(() => {
    if (!orders || !Array.isArray(orders)) {
      return { totalRevenue: 0, completedOrders: 0 };
    }
    const completed = orders.filter((o) => o.status === "Delivered");
    const totalRevenue = orders
      .filter((o) => o.status !== "Cancel" && o.status !== "Refund Success")
      .reduce((acc, o) => acc + (Number(o.totalPrice) || 0), 0);

    return { totalRevenue, completedOrders: completed.length };
  }, [orders]);

  // Handle Add Bank Account
  const handleBankSubmit = async (e) => {
    e.preventDefault();

    if (
      !bankInfo.bankName ||
      !bankInfo.bankCountry ||
      !bankInfo.bankAccountNumber ||
      !bankInfo.bankHolderName
    ) {
      toast.error("Please fill in all required bank fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.put(
        `${server}/shop/update-payment-methods`,
        { withdrawMethod: bankInfo },
        { withCredentials: true }
      );
      toast.success("Bank payout method added successfully!");
      dispatch(loadSeller());
      setOpenBankModal(false);
      setBankInfo({
        bankName: "",
        bankCountry: "",
        bankSwiftCode: "",
        bankAccountNumber: "",
        bankHolderName: "",
        bankAddress: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to add withdraw method"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Bank Account
  const handleDeleteMethod = async () => {
    try {
      await axios.delete(`${server}/shop/delete-withdraw-method`, {
        withCredentials: true,
      });
      toast.success("Withdraw method removed successfully!");
      setDeleteModalOpen(false);
      dispatch(loadSeller());
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete withdraw method"
      );
    }
  };

  // Handle Withdraw Request
  const handleWithdrawRequest = async () => {
    if (!seller?.withdrawMethod) {
      toast.error("Please add a bank payout method first!");
      setOpenWithdrawModal(false);
      setOpenBankModal(true);
      return;
    }

    const amount = Number(withdrawAmount);
    if (amount < 50) {
      toast.error("Minimum withdrawal amount is $50.00");
      return;
    }
    if (amount > availableBalance) {
      toast.error("Withdrawal amount cannot exceed your available balance!");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(
        `${server}/withdraw/create-withdraw-request`,
        { amount },
        { withCredentials: true }
      );
      toast.success("Withdrawal payout request submitted successfully!");
      setOpenWithdrawModal(false);
      dispatch(loadSeller());
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to process withdrawal"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Earnings & Payouts</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
              <HiOutlineBanknotes className="w-5 h-5" />
            </div>
            <span>Earnings & Payouts</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => dispatch(loadSeller())}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-xs"
          >
            <HiOutlineArrowPath className="w-4 h-4 text-slate-500" />
            <span>Refresh Balance</span>
          </button>
        </div>
      </div>

      {/* Hero Financial Balance Card + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Glassmorphic Gradient Balance Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <HiOutlineShieldCheck className="w-4 h-4 text-emerald-400" />
                Available Payout Balance
              </span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                {isEligibleToWithdraw ? "Ready for Payout" : "Min. $50.00 to Withdraw"}
              </span>
            </div>

            <div className="mt-4">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-Poppins">
                ${availableBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cleared funds available for immediate bank transfer
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Transfer Fee: <strong className="text-white">$0.00 (Free)</strong>
            </div>
            <button
              onClick={() => {
                if (!isEligibleToWithdraw) {
                  toast.error("Your balance must be at least $50.00 to request a payout.");
                  return;
                }
                setOpenWithdrawModal(true);
              }}
              disabled={!isEligibleToWithdraw}
              className="py-2.5 px-6 rounded-xl text-xs font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-emerald-950 flex items-center justify-center gap-2"
            >
              <HiOutlineBanknotes className="w-4 h-4" />
              <span>Withdraw Funds</span>
            </button>
          </div>
        </div>

        {/* Right: Quick KPI Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Gross Lifetime Sales</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <HiOutlineCurrencyDollar className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-slate-900">
                ${financialMetrics.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">All processed store orders</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Delivered Orders</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <HiOutlineShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-emerald-600">
                {financialMetrics.completedOrders}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">Orders successfully fulfilled</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between sm:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">Payout Speed</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <HiOutlineClock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-sm font-bold text-slate-900">
                Standard Direct Bank Deposit (1-2 Business Days)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Funds are dispatched directly into your verified bank account without intermediary holding fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payout Methods Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HiOutlineBuildingLibrary className="w-5 h-5 text-indigo-600" />
              <span>Connected Bank Payout Method</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Your primary bank account for receiving automated and on-demand merchant payouts
            </p>
          </div>

          {!seller?.withdrawMethod && (
            <button
              onClick={() => setOpenBankModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Link Bank Account</span>
            </button>
          )}
        </div>

        {seller?.withdrawMethod ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Bank Card Mockup */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-md border border-slate-700 space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <HiOutlineBuildingLibrary className="w-4 h-4 text-indigo-400" />
                  {seller.withdrawMethod.bankName || "Commercial Bank"}
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Active
                </span>
              </div>

              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-0.5 font-mono">Account Number</span>
                <span className="text-lg font-mono font-bold tracking-widest text-slate-100">
                  •••• •••• ••••{" "}
                  {seller.withdrawMethod.bankAccountNumber?.slice(-4) || "0000"}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-700/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Account Holder</span>
                  <span className="font-semibold text-slate-200">
                    {seller.withdrawMethod.bankHolderName || "Merchant Name"}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Country</span>
                  <span className="font-semibold text-slate-200">
                    {seller.withdrawMethod.bankCountry || "Global"}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Method Meta Details */}
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bank Name:</span>
                  <span className="font-semibold text-slate-900">
                    {seller.withdrawMethod.bankName}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">SWIFT / BIC:</span>
                  <span className="font-mono font-semibold text-slate-900">
                    {seller.withdrawMethod.bankSwiftCode || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Bank Country:</span>
                  <span className="font-semibold text-slate-900">
                    {seller.withdrawMethod.bankCountry}
                  </span>
                </div>
                {seller.withdrawMethod.bankAddress && (
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-slate-500">Bank Address:</span>
                    <span className="font-semibold text-slate-900 text-right">
                      {seller.withdrawMethod.bankAddress}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-all"
                >
                  <HiOutlineTrash className="w-3.5 h-3.5" />
                  <span>Remove Bank Method</span>
                </button>
                <button
                  onClick={() => setOpenWithdrawModal(true)}
                  disabled={!isEligibleToWithdraw}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-xs"
                >
                  <HiOutlineBanknotes className="w-4 h-4" />
                  <span>Withdraw to this account</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center max-w-md mx-auto space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
              <HiOutlineBuildingLibrary className="w-7 h-7" />
            </div>
            <h4 className="text-base font-bold text-slate-800">
              No Payout Method Connected
            </h4>
            <p className="text-xs text-slate-500">
              Connect your bank account to receive merchant withdrawals directly to your checking or business account.
            </p>
            <button
              onClick={() => setOpenBankModal(true)}
              className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
            >
              <HiOutlinePlus className="w-4 h-4" />
              <span>Connect Bank Account</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal 1: Request Withdrawal */}
      {openWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <HiOutlineBanknotes className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Request Payout
                </h3>
              </div>
              <button
                onClick={() => setOpenWithdrawModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Destination Bank Account */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Payout Destination
              </span>
              <p className="font-bold text-slate-900">
                {seller?.withdrawMethod?.bankName || "Linked Bank Account"}
              </p>
              <p className="font-mono text-slate-600 text-[11px]">
                •••• {seller?.withdrawMethod?.bankAccountNumber?.slice(-4) || "0000"} (
                {seller?.withdrawMethod?.bankHolderName || "Merchant"})
              </p>
            </div>

            {/* Amount Selection */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-xs">
                <label className="font-semibold text-slate-700">Withdraw Amount ($)</label>
                <span className="text-slate-500">
                  Max: <strong className="text-slate-900">${availableBalance.toFixed(2)}</strong>
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                  $
                </span>
                <input
                  type="number"
                  min="50"
                  max={availableBalance}
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex items-center gap-2 mt-2.5">
                {[50, 100, 250, availableBalance].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setWithdrawAmount(preset)}
                    className="flex-1 py-1 px-2 rounded-lg text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
                  >
                    {preset === availableBalance ? "All" : `$${preset}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setOpenWithdrawModal(false)}
                className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleWithdrawRequest}
                disabled={isSubmitting || Number(withdrawAmount) < 50 || Number(withdrawAmount) > availableBalance}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm shadow-emerald-200 transition-all disabled:opacity-50"
              >
                {isSubmitting ? "Processing..." : "Confirm Withdrawal"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Add Bank Method */}
      {openBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <HiOutlineBuildingLibrary className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Connect Bank Account
                </h3>
              </div>
              <button
                onClick={() => setOpenBankModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <HiOutlineXMark className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBankSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bankInfo.bankName}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bankName: e.target.value })
                  }
                  placeholder="e.g. JPMorgan Chase, HSBC, Bank of America"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bank Country <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bankInfo.bankCountry}
                    onChange={(e) =>
                      setBankInfo({ ...bankInfo, bankCountry: e.target.value })
                    }
                    placeholder="e.g. United States"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    SWIFT / BIC Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={bankInfo.bankSwiftCode}
                    onChange={(e) =>
                      setBankInfo({ ...bankInfo, bankSwiftCode: e.target.value })
                    }
                    placeholder="e.g. CHASUS33"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Account Number / IBAN <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bankInfo.bankAccountNumber}
                  onChange={(e) =>
                    setBankInfo({
                      ...bankInfo,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  placeholder="e.g. 123456789012"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Account Holder Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bankInfo.bankHolderName}
                  onChange={(e) =>
                    setBankInfo({
                      ...bankInfo,
                      bankHolderName: e.target.value,
                    })
                  }
                  placeholder="Name matching bank account registration"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Bank Physical Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={bankInfo.bankAddress}
                  onChange={(e) =>
                    setBankInfo({ ...bankInfo, bankAddress: e.target.value })
                  }
                  placeholder="e.g. 270 Park Ave, New York, NY 10017"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setOpenBankModal(false)}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Linking..." : "Save Bank Method"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <HiOutlineTrash className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Remove Bank Method?
              </h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to disconnect this bank account? You will need to link a payment method again to withdraw earnings.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="py-2.5 px-4 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMethod}
                className="py-2.5 px-4 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-200 transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
