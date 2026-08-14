import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineMail, AiOutlineLock, AiOutlineShop, AiOutlinePhone, AiOutlineHome, AiOutlineNumber, AiOutlineCamera } from "react-icons/ai";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import LuminaLogo from "../Layout/LuminaLogo";

const ShopCreate = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${server}/shop/create-shop`, {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      })
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar(null);
        setZipCode("");
        setAddress("");
        setPhoneNumber("");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || error.message || "Failed to create shop!");
      })
      .finally(() => setLoading(false));
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Ambient Glowing Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Main Glassmorphic Auth Card */}
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 sm:p-10 z-10 my-8">
        
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <LuminaLogo className="mb-4" />
          <span className="px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
            Become a Seller
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register Your Shop</h2>
          <p className="text-slate-500 text-xs mt-1">
            Start selling your products to thousands of shoppers on Lumina Market
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Shop Avatar */}
          <div className="flex flex-col items-center mb-2">
            <div className="relative group cursor-pointer">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-indigo-500/30 flex items-center justify-center overflow-hidden shadow-md group-hover:border-indigo-500 transition-all">
                {avatar ? (
                  <img src={avatar} alt="Shop Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <RxAvatar className="w-12 h-12 text-slate-400" />
                )}
              </div>
              <label
                htmlFor="file-input"
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md cursor-pointer transition-colors"
                title="Upload Shop Logo"
              >
                <AiOutlineCamera size={14} />
                <input
                  type="file"
                  name="avatar"
                  id="file-input"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="sr-only"
                />
              </label>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 font-medium">Shop Logo / Avatar</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Shop Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Shop Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Lumina Store"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <AiOutlineShop className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <AiOutlinePhone className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Business Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seller@store.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              <AiOutlineMail className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Business Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Market St"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <AiOutlineHome className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              </div>
            </div>

            {/* Zip Code */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Zip Code
              </label>
              <div className="relative">
                <input
                  type="number"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <AiOutlineNumber className="absolute left-3.5 top-3.5 text-slate-400" size={18} />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
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
            className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-sm rounded-2xl shadow-xl shadow-indigo-600/30 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Registering Shop & Sending Email...</span>
              </>
            ) : (
              "Register Shop"
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500 font-medium">
            Already have a seller account?{" "}
            <Link to="/shop-login" className="font-bold text-indigo-600 hover:text-indigo-700">
              Sign In to Shop
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ShopCreate;
