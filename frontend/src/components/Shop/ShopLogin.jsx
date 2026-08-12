import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import LuminaLogo from "../Layout/LuminaLogo";

const ShopLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    await axios
      .post(
        `${server}/shop/login-shop`,
        {
          email,
          password,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Seller Login Success!");
        navigate("/dashboard");
        window.location.reload(true);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || err.message || "Login failed!");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Ambient Glowing Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphic Auth Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 z-10 my-8">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-8">
          <LuminaLogo className="mb-4" />
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Seller Portal
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Login to Your Shop</h2>
          <p className="text-slate-500 text-xs mt-1">
            Access your seller dashboard, products & analytics
          </p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Seller Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@lumina.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              <AiOutlineMail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
              <a href="#forgot" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              <AiOutlineLock className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {visible ? <AiOutlineEye size={18} /> : <AiOutlineEyeInvisible size={18} />}
              </button>
            </div>
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? "Logging into Dashboard..." : "Login to Seller Dashboard"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Don't have a seller account?{" "}
            <Link to="/shop-create" className="font-bold text-indigo-600 hover:text-indigo-700">
              Register your Shop
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ShopLogin;
