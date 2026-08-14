import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { server } from "../server";
import { RxCheckCircled, RxCrossCircled } from "react-icons/rx";
import { HiOutlineShieldCheck, HiArrowRight, HiOutlineSparkles } from "react-icons/hi2";

const ActivationPage = () => {
  const { activation_token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // "verifying" | "success" | "error"
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          await axios.post(`${server}/user/activation`, {
            activation_token,
          });
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
      navigate("/login");
    }
    return () => clearInterval(timer);
  }, [status, countdown, navigate]);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-Poppins">
      {/* Background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center">
        {/* Top Icon */}
        <div className="flex justify-center mb-6">
          {status === "verifying" && (
            <div className="relative flex items-center justify-center w-20 h-20 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 shadow-inner">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <HiOutlineShieldCheck size={14} /> Security Check
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Verifying Your Email</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Please wait while we validate your activation token and setup your account.
            </p>
          </div>
        )}

        {status === "success" && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
              <HiOutlineSparkles size={14} /> Verified & Active
            </span>
            <h2 className="text-2xl font-extrabold text-white mb-2">Welcome Aboard! 🎉</h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Your account has been successfully authenticated. You are all set to explore Eshop!
            </p>

            {/* Countdown notice */}
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 mb-6 flex items-center justify-between text-xs text-slate-300">
              <span>Redirecting to Login...</span>
              <span className="font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                00:0{countdown}s
              </span>
            </div>

            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 transition-all text-sm"
            >
              Sign In to Your Account <HiArrowRight size={16} />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-3">
              Token Expired
            </span>
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Activation Failed</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              This activation token is invalid or has expired. Please sign up again or request a new activation link.
            </p>

            <div className="space-y-3">
              <Link
                to="/sign-up"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:opacity-95 transition-all text-sm"
              >
                Create New Account
              </Link>
              <Link
                to="/login"
                className="block text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors pt-2"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;
