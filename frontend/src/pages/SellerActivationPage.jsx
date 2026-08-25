import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { server } from "../server";
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";
import { HiOutlineBuildingStorefront, HiArrowRight, HiOutlineSparkles } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { loadSeller } from "../redux/actions/user";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [countdown, setCountdown] = useState(5);
  const calledRef = React.useRef(false);

  useEffect(() => {
    if (activation_token && !calledRef.current) {
      calledRef.current = true;
      const sendRequest = async () => {
        try {
          const res = await axios.post(`${server}/shop/activation`, {
            activation_token,
          });
          if (res.data?.token) {
            localStorage.setItem("seller_token", res.data.token);
          }
          setStatus("success");
        } catch (err) {
          setStatus("error");
        }
      };
      sendRequest();
    }
  }, [activation_token]);

  useEffect(() => {
    let timer;
    if (status === "success" && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (status === "success" && countdown === 0) {
      dispatch(loadSeller());
      navigate("/dashboard");
    }
    return () => clearInterval(timer);
  }, [status, countdown, navigate, dispatch]);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-Poppins">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          {status === "verifying" && (
            <div className="relative flex items-center justify-center w-24 h-24 bg-emerald-500/10 rounded-3xl border border-emerald-500/30 shadow-2xl shadow-emerald-500/20">
              <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/40 animate-ping opacity-25" />
              <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent border-r-emerald-400 rounded-full animate-spin" />
            </div>
          )}

          {status === "success" && (
            <div className="relative flex items-center justify-center w-20 h-20 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/10 animate-bounce">
              <RxCheckCircled size={48} />
              <div className="absolute -top-1 -right-1 text-emerald-300">
                <HiOutlineSparkles size={22} />
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center justify-center w-20 h-20 bg-rose-500/10 rounded-2xl border border-rose-500/30 text-rose-500 shadow-lg shadow-rose-500/10">
              <RxCrossCircled size={48} />
            </div>
          )}
        </div>

        {/* Dynamic Header & Body Content */}
        {status === "verifying" && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-3">
              <HiOutlineBuildingStorefront size={14} /> Storefront Activation
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Verifying Shop Email</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Please wait while we validate your shop activation token and initialize your seller dashboard.
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <HiOutlineSparkles size={14} /> Shop Live & Ready
            </span>
            <h2 className="text-2xl font-extrabold text-white mb-2">Shop Activated! 🏪</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Your seller account has been verified successfully. You can now login and start listing your products!
            </p>

            {/* Countdown notice */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 mb-6 flex items-center justify-between text-xs text-slate-300">
              <span>Redirecting to Shop Login...</span>
              <span className="font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                00:0{countdown}s
              </span>
            </div>

            <Link
              to="/shop-login"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:opacity-95 transition-all text-sm"
            >
              Sign In to Shop Dashboard <HiArrowRight size={16} />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
              Token Expired
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Activation Link Expired</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              This seller activation link is invalid or has expired. Please register your shop again.
            </p>

            <div className="space-y-3">
              <Link
                to="/shop-create"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold shadow-lg hover:opacity-95 transition-all text-sm"
              >
                Register Shop Again
              </Link>
              <Link
                to="/shop-login"
                className="block text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors pt-2"
              >
                Back to Shop Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerActivationPage;
