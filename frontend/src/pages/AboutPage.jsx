import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  HiOutlineSparkles,
  HiOutlineShieldCheck,
  HiOutlineTruck,
  HiOutlineUserGroup,
  HiOutlineGlobeAlt,
  HiOutlineCube,
  HiOutlineShoppingBag,
  HiOutlineBadgeCheck,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineLocationMarker,
  HiOutlineCheckCircle,
  HiOutlineLightBulb,
} from "react-icons/hi";
import {
  FiArrowRight,
  FiCheckCircle,
  FiSend,
  FiUsers,
  FiTrendingUp,
  FiAward,
  FiZap,
} from "react-icons/fi";
import {
  AiFillStar,
  AiOutlineTwitter,
  AiFillLinkedin,
  AiFillGithub,
} from "react-icons/ai";

const AboutPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen font-sans antialiased text-slate-800">
      <Header activeHeading={6} />
      <AboutContent />
      <Footer />
    </div>
  );
};

const AboutContent = () => {
  // State for active audience tab (Shoppers, Sellers, Partners)
  const [audienceTab, setAudienceTab] = useState("shoppers");

  // State for Contact Form
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your message has been sent to our team.");
      setContactForm({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: "",
      });
    }, 1000);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-950 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-slate-900">
        {/* Glowing background circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className={`${styles.section} relative z-10 text-center max-w-4xl mx-auto`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs sm:text-sm font-semibold mb-6">
            <HiOutlineSparkles className="w-4 h-4 text-indigo-400" />
            <span>Redefining Multi-Vendor E-Commerce</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6">
            Connecting People through <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Extraordinary Shopping</span>
          </h1>

          <p className="text-slate-300 text-base sm:text-xl font-normal leading-relaxed max-w-3xl mx-auto mb-10">
            Nexus Next-Gen Market is a vibrant global ecosystem connecting millions of buyers with verified independent sellers, global brands, and artisan creators in one seamless marketplace.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold px-7 py-3.5 rounded-2xl text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition-all transform hover:-translate-y-0.5"
            >
              <HiOutlineShoppingBag className="w-5 h-5" />
              <span>Explore Marketplace</span>
            </Link>
            <Link
              to="/shop-create"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 font-semibold px-7 py-3.5 rounded-2xl text-sm sm:text-base transition-all transform hover:-translate-y-0.5"
            >
              <span>Become a Seller</span>
              <FiArrowRight className="w-5 h-5 text-indigo-400" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. METRICS & STATS TICKER */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          <div className="flex flex-col items-center text-center p-2">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-3">
              <FiUsers className="w-7 h-7" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">1.2M+</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Active Monthly Shoppers</span>
          </div>

          <div className="flex flex-col items-center text-center p-2 pt-6 sm:pt-2">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl mb-3">
              <HiOutlineGlobeAlt className="w-7 h-7" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">15K+</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Verified Sellers & Boutiques</span>
          </div>

          <div className="flex flex-col items-center text-center p-2 pt-6 sm:pt-2">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-3">
              <HiOutlineCube className="w-7 h-7" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">4.8M+</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Orders Successfully Delivered</span>
          </div>

          <div className="flex flex-col items-center text-center p-2 pt-6 sm:pt-2">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl mb-3">
              <FiAward className="w-7 h-7" />
            </div>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">99.4%</span>
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-1">Customer Satisfaction Rate</span>
          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION DUAL CARDS */}
      <section className={`${styles.section} py-16 sm:py-24`}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">What Drives Us</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Our Purpose & Ambition
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            We are building a transparent, user-centric marketplace where innovation meets everyday accessibility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                <HiOutlineLightBulb className="w-4 h-4 text-indigo-300" />
                <span>Our Mission</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-4 leading-snug">
                Democratize Commerce for Small Sellers & Consumers Worldwide
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                To empower independent merchants, artisans, and retailers by giving them cutting-edge digital store tools, while guaranteeing shoppers access to authentic products, transparent pricing, and instant customer service.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <HiOutlineCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>Fair seller onboarding with zero hidden fees</span>
                </li>
                <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <HiOutlineCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>100% Buyer Protection & verified seller reviews</span>
                </li>
                <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                  <HiOutlineCheckCircle className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span>Integrated real-time order tracking & live support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Vision Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl shadow-slate-100">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6">
                <FiTrendingUp className="w-4 h-4 text-purple-600" />
                <span>Our Vision</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-4 leading-snug">
                Becoming the World's Most Trusted Multi-Vendor Ecosystem
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                We envision a future where shopping is effortless, personalized, and sustainable. By combining next-gen marketplace technology with hyper-reliable fulfillment networks, Nexus empowers communities everywhere.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <HiOutlineCheckCircle className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>Global seller expansion with localized payments</span>
                </li>
                <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <HiOutlineCheckCircle className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>AI-driven product recommendations tailored to you</span>
                </li>
                <li className="flex items-center gap-3 text-xs sm:text-sm text-slate-700">
                  <HiOutlineCheckCircle className="w-5 h-5 text-purple-600 shrink-0" />
                  <span>Sustainable logistics & eco-friendly packaging partners</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES GRID */}
      <section className="bg-slate-100/70 py-16 sm:py-24 border-y border-slate-200/80">
        <div className={`${styles.section}`}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Guided By Principles</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              Our Core Values
            </h2>
            <p className="text-slate-600 mt-3 text-sm sm:text-base">
              The fundamental beliefs that shape how we operate, build, and support our global community every day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <ValueCard
              icon={<HiOutlineShieldCheck className="w-6 h-6 text-indigo-600" />}
              bg="bg-indigo-50"
              title="Trust & Transparency"
              description="Every item, seller rating, and customer review is authenticated. We maintain complete transparency in order processing, fees, and return policies."
            />
            <ValueCard
              icon={<HiOutlineTruck className="w-6 h-6 text-emerald-600" />}
              bg="bg-emerald-50"
              title="Express Speed & Reliability"
              description="From single-item orders to multi-vendor bundles, our logistics engine guarantees quick dispatches and real-time step-by-step order tracking."
            />
            <ValueCard
              icon={<FiZap className="w-6 h-6 text-amber-600" />}
              bg="bg-amber-50"
              title="Continuous Innovation"
              description="We pioneer intuitive dashboard tools for merchants and responsive, friction-free checkout experiences for shoppers across all devices."
            />
            <ValueCard
              icon={<HiOutlineUserGroup className="w-6 h-6 text-purple-600" />}
              bg="bg-purple-50"
              title="Merchant Empowerment"
              description="We champion small businesses, providing them with zero-friction store setup tools, coupon creators, and instant sales analytics."
            />
            <ValueCard
              icon={<HiOutlineGlobeAlt className="w-6 h-6 text-sky-600" />}
              bg="bg-sky-50"
              title="Sustainability & Ethics"
              description="We prioritize eco-friendly packaging standards and encourage vendors to adopt sustainable manufacturing and shipping practices."
            />
            <ValueCard
              icon={<HiOutlineBadgeCheck className="w-6 h-6 text-rose-600" />}
              bg="bg-rose-50"
              title="Customer-First Delight"
              description="Our dedicated support team is available 24/7 to resolve inquiries, assist with refunds, and ensure an extraordinary shopping journey."
            />
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE AUDIENCE SPOTLIGHT (Who We Serve) */}
      <section className={`${styles.section} py-16 sm:py-24`}>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">Tailored Experiences</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Built for Everyone in the Commerce Journey
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Select a perspective to discover how Nexus elevates your experience.
          </p>
        </div>

        {/* Audience Selector Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl gap-1">
            <button
              onClick={() => setAudienceTab("shoppers")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                audienceTab === "shoppers"
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Shoppers
            </button>
            <button
              onClick={() => setAudienceTab("sellers")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                audienceTab === "sellers"
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Sellers & Stores
            </button>
            <button
              onClick={() => setAudienceTab("brands")}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                audienceTab === "brands"
                  ? "bg-white text-indigo-600 shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              For Global Brands
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-xl shadow-slate-100 max-w-4xl mx-auto">
          {audienceTab === "shoppers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Unrivaled Selection</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2 mb-4">
                  Shop Millions of Verified Products with Complete Peace of Mind
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Discover top tech, trendy fashion, accessories, beauty, and home essentials from trusted sellers around the globe.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Multiple payment gateways (Stripe, PayPal, Cash on Delivery)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Real-time order tracking & instant order status alerts</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Direct messaging with verified store owners</span>
                  </div>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Start Browsing Products</span>
                  <FiArrowRight />
                </Link>
              </div>
              <div className="bg-gradient-to-tr from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100/50">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                      <HiOutlineShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Buyer Protection Guarantee</h4>
                      <p className="text-xs text-slate-500">100% money back if items are not as described</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                      <HiOutlineTruck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Express Global Delivery</h4>
                      <p className="text-xs text-slate-500">Dispatched within 24-48 hours with full tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {audienceTab === "sellers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Merchant Growth</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2 mb-4">
                  Launch & Scale Your Online Store in Minutes
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Nexus gives independent merchants and store owners an all-in-one suite to list products, create custom promotional coupons, process payments, and track revenue.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Instant storefront setup with custom shop avatars & profile</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Real-time seller analytics, withdraw management & order inbox</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Event creation engine for flash sales & promotional discounts</span>
                  </div>
                </div>
                <Link
                  to="/shop-create"
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Register Your Shop Now</span>
                  <FiArrowRight />
                </Link>
              </div>
              <div className="bg-gradient-to-tr from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                      <FiTrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Zero Upfront Setup Fees</h4>
                      <p className="text-xs text-slate-500">Pay only when you make a successful sale</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-pink-100 text-pink-600 rounded-lg">
                      <HiOutlineUserGroup className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Instant Customer Messaging</h4>
                      <p className="text-xs text-slate-500">Chat directly with buyers to close sales faster</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {audienceTab === "brands" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest">Enterprise Brands</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-2 mb-4">
                  Amplify Brand Presence with Premium Storefronts & Co-Marketing
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                  Partner with Nexus to showcase official product lines to millions of active, high-intent shoppers with brand-verification badges and featured event placements.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Verified Official Brand Badges & dedicated store URLs</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Priority homepage banner placement & featured product spotlights</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                    <FiCheckCircle className="text-indigo-600 w-5 h-5 shrink-0" />
                    <span>Dedicated account management & automated inventory API integration</span>
                  </div>
                </div>
                <a
                  href="#contact-form"
                  className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700"
                >
                  <span>Contact Brand Partnerships Team</span>
                  <FiArrowRight />
                </a>
              </div>
              <div className="bg-gradient-to-tr from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100/50">
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                      <FiAward className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Brand Authentication</h4>
                      <p className="text-xs text-slate-500">Protect your intellectual property & brand catalog</p>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-xs border border-slate-100 flex items-center gap-4">
                    <div className="p-3 bg-sky-100 text-sky-600 rounded-lg">
                      <HiOutlineGlobeAlt className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Omnichannel Reach</h4>
                      <p className="text-xs text-slate-500">Distribute globally across desktop & mobile users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. OUR STORY / TIMELINE */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 border-y border-slate-800">
        <div className={`${styles.section}`}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Our Journey</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Milestones That Shaped Nexus
            </h2>
            <p className="text-slate-400 mt-3 text-sm sm:text-base">
              From a vision to solve local commerce challenges to a global marketplace powering thousands of businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <TimelineCard
              year="2021"
              title="The Spark"
              description="Founded with a mission to create a clean, modern multi-vendor platform where small independent sellers could compete on equal footing with major online retailers."
            />
            <TimelineCard
              year="2022"
              title="1,000+ Stores"
              description="Crossed 1,000 active seller storefronts, introduced direct buyer-to-seller live messaging, and launched the seller analytics dashboard."
            />
            <TimelineCard
              year="2023"
              title="Payment Expansion"
              description="Integrated seamless multi-currency checkouts with Stripe, PayPal, and Cash-on-Delivery, while introducing automated discount coupon features."
            />
            <TimelineCard
              year="2024+"
              title="Next-Gen Scaling"
              description="Reached over 1.2M monthly active shoppers, launched flash sales events module, and expanded express logistics coverage globally."
            />
          </div>
        </div>
      </section>

      {/* 7. LEADERSHIP TEAM */}
      <section className={`${styles.section} py-16 sm:py-24`}>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">The Minds Behind Nexus</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
            Meet Our Leadership
          </h2>
          <p className="text-slate-600 mt-3 text-sm sm:text-base">
            Passionate innovators, engineers, and commerce experts dedicated to building the future of shopping.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <TeamMemberCard
            name="Zaid Khan"
            role="Founder & Chief Executive Officer"
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            bio="Visionary entrepreneur with over 8 years in e-commerce architecture and marketplace innovation."
          />
          <TeamMemberCard
            name="Sarah Jenkins"
            role="Head of Customer Experience"
            avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
            bio="Dedicated to maintaining 99%+ customer satisfaction scores and seamless 24/7 global support."
          />
          <TeamMemberCard
            name="Alex Rivera"
            role="Lead Marketplace Architect"
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
            bio="Pioneers ultra-fast microservices, real-time inventory synchronization, and secure checkouts."
          />
          <TeamMemberCard
            name="Priya Patel"
            role="VP of Seller Ecosystem"
            avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80"
            bio="Empowers over 15,000 merchants with store setup resources, growth strategies, and seller tools."
          />
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="bg-indigo-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className={`${styles.section} relative z-10`}>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Community Voices</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">
              Loved by Shoppers & Sellers Alike
            </h2>
            <p className="text-indigo-200 mt-3 text-sm sm:text-base">
              See what our community members have to say about their experience on Nexus.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="Nexus transformed my small handmade accessory business into a global storefront. I quadrupled my sales in just 6 months!"
              author="Elena Rostova"
              title="Founder, Rostova Leather Crafts"
              avatar="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80"
              rating={5}
            />
            <TestimonialCard
              quote="The checkout is blazingly fast, and order tracking is spot on. Anytime I had a question, customer support resolved it in minutes."
              author="David Miller"
              title="Verified Buyer"
              avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
              rating={5}
            />
            <TestimonialCard
              quote="As an electronics seller, managing inventory and discounts used to be a nightmare. Nexus's seller dashboard made it effortless."
              author="Marcus Vance"
              title="Owner, Vance Tech Store"
              avatar="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* 9. WORKING CONTACT & INQUIRY FORM */}
      <section id="contact-form" className={`${styles.section} py-16 sm:py-24`}>
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-5">
          {/* Left info column */}
          <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-8 sm:p-12 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">Get In Touch</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-4">
                We'd Love to Hear From You
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-8">
                Have questions about our marketplace, interested in seller partnerships, or need assistance with an order? Drop us a message!
              </p>

              <div className="space-y-6 text-xs sm:text-sm">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <HiOutlineMail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px] font-medium uppercase">Email Us</span>
                    <span className="font-semibold text-white">support@nexus-market.com</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <HiOutlinePhone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px] font-medium uppercase">Call Us</span>
                    <span className="font-semibold text-white">+1 (800) 555-NEXUS</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
                    <HiOutlineLocationMarker className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-slate-400 text-[11px] font-medium uppercase">Global HQ</span>
                    <span className="font-semibold text-white">Marketplace Tower, San Francisco, CA</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 mt-8 border-t border-slate-800 flex gap-3 text-slate-400">
              <a href="#twitter" className="p-2.5 bg-slate-800/60 rounded-xl hover:text-white hover:bg-indigo-600 transition-colors">
                <AiOutlineTwitter className="w-5 h-5" />
              </a>
              <a href="#linkedin" className="p-2.5 bg-slate-800/60 rounded-xl hover:text-white hover:bg-indigo-600 transition-colors">
                <AiFillLinkedin className="w-5 h-5" />
              </a>
              <a href="#github" className="p-2.5 bg-slate-800/60 rounded-xl hover:text-white hover:bg-indigo-600 transition-colors">
                <AiFillGithub className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-3 p-8 sm:p-12">
            <h4 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h4>

            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Your Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="alex@example.com"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Inquiry Topic
                </label>
                <select
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none cursor-pointer"
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Become a Seller">Become a Seller / Store Registration</option>
                  <option value="Order & Shipping Support">Order & Shipping Support</option>
                  <option value="Brand Partnership">Brand Partnership</option>
                  <option value="Media & Press">Media & Press</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder="How can we assist you today? Provide any relevant order numbers or details..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-3.5 px-6 rounded-xl text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <FiSend className="w-4 h-4" />
                <span>{isSubmitting ? "Sending Message..." : "Submit Inquiry"}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 10. CALL TO ACTION BANNER */}
      <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to Join the Next Generation of E-Commerce?
          </h2>
          <p className="text-indigo-200 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            Whether you're looking for unique handcrafted goods, cutting-edge technology, or seeking to launch your brand online, Nexus is your gateway.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-indigo-950 hover:bg-slate-100 font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-lg transition-all"
            >
              Shop All Products
            </Link>
            <Link
              to="/shop-create"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm border border-indigo-400/30 shadow-lg transition-all"
            >
              Start Selling Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

// Helper Components
const ValueCard = ({ icon, bg, title, description }) => (
  <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md shadow-slate-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 transform hover:-translate-y-1">
    <div className={`p-4 ${bg} rounded-2xl w-fit mb-6`}>{icon}</div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{description}</p>
  </div>
);

const TimelineCard = ({ year, title, description }) => (
  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 relative flex flex-col justify-between">
    <div>
      <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-lg text-xs font-bold mb-4">
        {year}
      </span>
      <h4 className="text-lg font-bold text-white mb-2">{title}</h4>
      <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
    </div>
  </div>
);

const TeamMemberCard = ({ name, role, avatar, bio }) => (
  <div className="bg-white rounded-3xl border border-slate-200 p-6 text-center shadow-md shadow-slate-100 hover:shadow-xl transition-all duration-300 group">
    <div className="relative w-28 h-28 mx-auto mb-5 rounded-2xl overflow-hidden shadow-md">
      <img
        src={avatar}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
      {name}
    </h3>
    <span className="block text-xs font-semibold text-indigo-600 mb-3">{role}</span>
    <p className="text-slate-500 text-xs leading-relaxed">{bio}</p>
  </div>
);

const TestimonialCard = ({ quote, author, title, avatar, rating }) => (
  <div className="bg-slate-900/80 border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-between relative shadow-lg">
    <div>
      <div className="flex items-center gap-1 text-amber-400 mb-4">
        {[...Array(rating)].map((_, i) => (
          <AiFillStar key={i} className="w-4 h-4" />
        ))}
      </div>
      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed italic mb-6">
        "{quote}"
      </p>
    </div>
    <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
      <img
        src={avatar}
        alt={author}
        className="w-10 h-10 rounded-full object-cover border border-indigo-400"
      />
      <div>
        <h4 className="text-xs font-bold text-white">{author}</h4>
        <span className="text-[11px] text-slate-400">{title}</span>
      </div>
    </div>
  </div>
);

export default AboutPage;
