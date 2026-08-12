import React from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import {
  footercompanyLinks,
  footerProductLinks,
  footerSupportLinks,
} from "../../static/data";
import LuminaLogo from "./LuminaLogo";

const Footer = () => {
  return (
    <div className="bg-slate-950 text-white border-t border-slate-900">
      {/* Newsletter Subscribe Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 py-10 px-6 sm:px-12 border-b border-indigo-500/10">
        <div className="max-w-7xl mx-auto md:flex md:justify-between md:items-center gap-6">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Stay Updated</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-snug">
              Subscribe to <span className="text-indigo-400">Lumina Market</span> for exclusive flash deals & offers
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="email"
              required
              placeholder="Enter your email address..."
              className="bg-slate-900/80 border border-slate-700 text-white placeholder-slate-400 sm:w-80 px-4 py-3 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm transition-all"
            />
            <button className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 font-bold px-6 py-3 rounded-xl text-white text-sm shadow-md shadow-indigo-600/30 transition-all duration-300">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 px-6 sm:px-12 py-16">
        {/* Brand & Socials Column */}
        <div className="lg:col-span-2 flex flex-col items-start">
          <LuminaLogo light={true} />
          <p className="text-slate-400 text-sm mt-4 leading-relaxed max-w-sm">
            Your premium destination for curated fashion, trending tech, and verified quality products delivered straight to your doorstep.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <a href="#facebook" className="p-2.5 bg-slate-900 hover:bg-indigo-600 rounded-xl text-slate-300 hover:text-white transition-all">
              <AiFillFacebook size={20} />
            </a>
            <a href="#twitter" className="p-2.5 bg-slate-900 hover:bg-indigo-600 rounded-xl text-slate-300 hover:text-white transition-all">
              <AiOutlineTwitter size={20} />
            </a>
            <a href="#instagram" className="p-2.5 bg-slate-900 hover:bg-indigo-600 rounded-xl text-slate-300 hover:text-white transition-all">
              <AiFillInstagram size={20} />
            </a>
            <a href="#youtube" className="p-2.5 bg-slate-900 hover:bg-indigo-600 rounded-xl text-slate-300 hover:text-white transition-all">
              <AiFillYoutube size={20} />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Company</h3>
          <ul className="flex flex-col gap-2.5">
            {footerProductLinks.map((link, index) => (
              <li key={index}>
                <Link
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Shop</h3>
          <ul className="flex flex-col gap-2.5">
            {footercompanyLinks.map((link, index) => (
              <li key={index}>
                <Link
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4">Support</h3>
          <ul className="flex flex-col gap-2.5">
            {footerSupportLinks.map((link, index) => (
              <li key={index}>
                <Link
                  className="text-slate-400 hover:text-indigo-400 text-sm transition-colors"
                  to={link.link}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-slate-900 py-6 px-6 sm:px-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>© {new Date().getFullYear()} Lumina Market Inc. All rights reserved.</span>
          <div className="flex gap-6 font-medium">
            <Link to="/privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">Terms of Service</Link>
            <Link to="/security" className="hover:text-slate-400 transition-colors">Security</Link>
          </div>
          <div className="flex items-center">
            <img
              src="https://hamart-shop.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ffooter-payment.a37c49ac.png&w=640&q=75"
              alt="Payment Methods"
              className="h-6 object-contain opacity-75 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
