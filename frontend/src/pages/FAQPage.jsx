import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import {
  HiOutlineSparkles,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineArrowPath,
  HiOutlineUserCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineChatBubbleLeftRight,
  HiOutlineEnvelope,
  HiOutlineMagnifyingGlass,
  HiOutlinePlus,
  HiOutlineMinus,
} from "react-icons/hi2";
import {
  FiSearch,
  FiHelpCircle,
  FiArrowRight,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import { IoIosFlash } from "react-icons/io";
import { toast } from "react-toastify";

const FAQ_CATEGORIES = [
  { id: "all", name: "All Questions", icon: FiHelpCircle },
  { id: "shipping", name: "Orders & Shipping", icon: HiOutlineTruck },
  { id: "returns", name: "Returns & Refunds", icon: HiOutlineArrowPath },
  { id: "payments", name: "Payments & Pricing", icon: HiOutlineCreditCard },
  { id: "security", name: "Buyer Protection", icon: HiOutlineShieldCheck },
  { id: "account", name: "Account & Seller", icon: HiOutlineUserCircle },
];

const FAQ_DATA = [
  {
    id: 1,
    category: "returns",
    categoryLabel: "Returns & Refunds",
    badge: "Policy",
    question: "What is your return policy and how do I initiate a return?",
    answer:
      "We want you to be 100% delighted with every order! We accept returns within 30 days of delivery for all eligible, unused items in original packaging. To initiate a return, visit your Profile > Orders, select the product, and click 'Request Return'. You can also email us at support@lumina.com with your order ID for immediate assistance.",
    highlights: [
      "30-day hassle-free return window",
      "Full refund to your original payment method within 3-5 business days",
      "Prepaid return shipping label provided for defective or incorrect items",
    ],
  },
  {
    id: 2,
    category: "shipping",
    categoryLabel: "Orders & Shipping",
    badge: "Tracking",
    question: "How do I track my order in real-time?",
    answer:
      "Once your order has shipped, you will receive an instant email and SMS confirmation containing a verified carrier tracking link. You can also monitor your live package status anytime directly inside your Lumina Dashboard under 'My Orders'.",
    highlights: [
      "Real-time GPS delivery tracking & courier updates",
      "Direct carrier dispatch links (FedEx, DHL, USPS)",
      "Estimated delivery time displayed on order confirmation",
    ],
  },
  {
    id: 3,
    category: "payments",
    categoryLabel: "Payments & Pricing",
    badge: "Payments",
    question: "What payment methods and digital wallets do you accept?",
    answer:
      "We support all major payment providers with bank-grade 256-bit SSL encryption. You can checkout seamlessly using Visa, MasterCard, American Express, PayPal, Apple Pay, Google Pay, and Cash on Delivery (COD) in eligible regions.",
    highlights: [
      "Visa, MasterCard, Amex, Discover",
      "PayPal & 1-Click Digital Wallets",
      "Cash on Delivery (COD) supported in select areas",
    ],
  },
  {
    id: 4,
    category: "shipping",
    categoryLabel: "Orders & Shipping",
    badge: "Delivery",
    question: "Do you offer international shipping, and how long does it take?",
    answer:
      "Yes, we ship across North America, Europe, Australia, and select international destinations! Standard shipping typically takes 3–5 business days, while Express Priority shipping delivers within 1–2 business days. International orders generally arrive in 6–10 business days.",
    highlights: [
      "Free Standard Shipping on all orders over $50",
      "Express overnight courier option available at checkout",
      "Customs duties and taxes calculated upfront with zero surprise fees",
    ],
  },
  {
    id: 5,
    category: "shipping",
    categoryLabel: "Orders & Shipping",
    badge: "Orders",
    question: "Can I modify or cancel my order after it has been placed?",
    answer:
      "Because our automated fulfillment centers begin processing shipments immediately, orders can only be edited or canceled within 60 minutes of placement. If your order has already dispatched, you can simply use our free 30-day return policy upon arrival.",
    highlights: [
      "Instant 60-minute cancellation grace period via order dashboard",
      "Address changes possible before courier pickup",
      "Free return label if you decide not to keep the parcel",
    ],
  },
  {
    id: 6,
    category: "security",
    categoryLabel: "Buyer Protection",
    badge: "Guarantee",
    question: "How does the Lumina Buyer Protection Guarantee work?",
    answer:
      "Every purchase on Lumina is backed by our comprehensive Buyer Protection. If your package does not arrive, arrives damaged, or differs materially from the seller's description, you are guaranteed a 100% full refund or immediate replacement.",
    highlights: [
      "100% Money-Back Guarantee if goods don't match description",
      "Secure escrow payment release only upon verified delivery",
      "Dispute resolution team available 24/7",
    ],
  },
  {
    id: 7,
    category: "account",
    categoryLabel: "Account & Seller",
    badge: "Selling",
    question: "How do I become a verified seller on Lumina Marketplace?",
    answer:
      "Becoming a seller is fast and straightforward! Click 'Become a Seller' in the top navigation bar, submit your business or store details, and upload your product catalog. Our merchant onboarding team verifies new store applications within 24 hours.",
    highlights: [
      "Zero monthly listing fees for new merchant accounts",
      "Integrated vendor analytics, order management & payout system",
      "Instant seller dashboard access upon email verification",
    ],
  },
  {
    id: 8,
    category: "account",
    categoryLabel: "Account & Seller",
    badge: "Account",
    question: "How do I reset my account password or update my profile?",
    answer:
      "You can manage your contact info, shipping addresses, and payment preferences anytime in your Profile page. If you have forgotten your password, click 'Forgot Password' on the login screen to receive a secure password reset link via email.",
    highlights: [
      "Encrypted one-time secure password reset link",
      "Multi-address book management in user profile",
      "Instant notification toggles for order updates and flash sales",
    ],
  },
];

const FAQPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col justify-between selection:bg-indigo-600 selection:text-white">
      <Header activeHeading={5} />
      <FaqContent />
      <Footer />
    </div>
  );
};

const FaqContent = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [feedbackState, setFeedbackState] = useState({});

  const toggleTab = (id) => {
    setActiveTab((prev) => (prev === id ? null : id));
  };

  const handleFeedback = (faqId, isHelpful) => {
    setFeedbackState((prev) => ({ ...prev, [faqId]: isHelpful }));
    toast.success(
      isHelpful
        ? "Thank you for your feedback!"
        : "Thanks! We'll work on making this clearer."
    );
  };

  // Filtered FAQ list
  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        item.highlights.some((h) => h.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="py-10 sm:py-14">
      <div className={`${styles.section}`}>
        {/* Hero Header Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 md:p-14 mb-10 shadow-2xl border border-white/10">
          <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -top-20 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-indigo-300 text-xs font-semibold mb-4 border border-white/10 shadow-xs">
              <HiOutlineSparkles size={16} className="text-amber-300" />
              <span>Help Center & Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-slate-300 mb-8 font-normal leading-relaxed">
              Have questions about your order, shipping, refunds, or seller
              features? Find quick, comprehensive answers below or reach out to
              our 24/7 support team.
            </p>

            {/* Interactive Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <div className="relative flex items-center">
                <FiSearch
                  size={20}
                  className="absolute left-4 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  placeholder="Search questions by keyword (e.g. tracking, returns, PayPal)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 sm:h-14 pl-12 pr-10 bg-white/95 backdrop-blur-md text-slate-800 placeholder-slate-400 rounded-2xl text-sm font-medium border border-white/20 shadow-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-400 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {FAQ_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-102"
                    : "bg-white text-slate-700 hover:bg-slate-100 hover:text-indigo-600 border border-slate-200/80 shadow-xs"
                }`}
              >
                <Icon size={16} className={isSelected ? "text-white" : "text-indigo-600"} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Accordion Column */}
          <div className="lg:col-span-8 space-y-3.5">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const isOpen = activeTab === faq.id;
                const feedback = feedbackState[faq.id];

                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl transition-all duration-200 overflow-hidden border ${
                      isOpen
                        ? "bg-white border-indigo-300/80 shadow-lg ring-1 ring-indigo-100"
                        : "bg-white border-slate-200/80 hover:border-slate-300 shadow-xs hover:shadow-sm"
                    }`}
                  >
                    {/* Question Header */}
                    <button
                      onClick={() => toggleTab(faq.id)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none group"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                            isOpen
                              ? "bg-indigo-600 text-white"
                              : "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100"
                          }`}
                        >
                          <HiOutlineQuestionMarkCircle size={18} />
                        </div>
                        <div className="min-w-0">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-1">
                            {faq.categoryLabel}
                          </span>
                          <h3
                            className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
                              isOpen
                                ? "text-indigo-600"
                                : "text-slate-800 group-hover:text-indigo-600"
                            }`}
                          >
                            {faq.question}
                          </h3>
                        </div>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                          isOpen
                            ? "bg-indigo-50 text-indigo-600 rotate-180"
                            : "bg-slate-100 text-slate-400 group-hover:text-slate-700"
                        }`}
                      >
                        {isOpen ? <HiOutlineMinus size={14} /> : <HiOutlinePlus size={14} />}
                      </div>
                    </button>

                    {/* Answer Expanded Content */}
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-slate-100 animate-in fade-in-50 duration-200">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mb-3">
                          {faq.answer}
                        </p>

                        {/* Bullet Highlights */}
                        {faq.highlights && faq.highlights.length > 0 && (
                          <div className="bg-slate-50/80 rounded-xl p-3 sm:p-3.5 border border-slate-100 space-y-1.5 mb-4">
                            {faq.highlights.map((h, hIdx) => (
                              <div
                                key={hIdx}
                                className="flex items-center gap-2 text-xs font-medium text-slate-700"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0" />
                                <span>{h}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Helpful Feedback Buttons */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                          <span>Was this answer helpful?</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleFeedback(faq.id, true)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                                feedback === true
                                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                                  : "border-slate-200 hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              <FiThumbsUp size={12} />
                              <span>Yes</span>
                            </button>
                            <button
                              onClick={() => handleFeedback(faq.id, false)}
                              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                                feedback === false
                                  ? "bg-rose-50 border-rose-300 text-rose-700"
                                  : "border-slate-200 hover:bg-slate-100 text-slate-600"
                              }`}
                            >
                              <FiThumbsDown size={12} />
                              <span>No</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center">
                <HiOutlineMagnifyingGlass size={36} className="text-slate-300 mx-auto mb-2" />
                <h3 className="text-base font-bold text-slate-800">
                  No matching questions found
                </h3>
                <p className="text-xs text-slate-400 mt-1 mb-4">
                  We couldn't find anything matching "{searchQuery}". Try searching with a different term or clear filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 cursor-pointer shadow-sm transition-all"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Right Support Sidebar Card */}
          <div className="lg:col-span-4 space-y-4">
            {/* Quick Live Support Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 mb-4">
                <HiOutlineChatBubbleLeftRight size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                Still have questions?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                Can't find the answer you're looking for? Our live support agents
                are ready to assist you right now.
              </p>

              <div className="space-y-2.5">
                <Link
                  to="/live-chat"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all group"
                >
                  <span>Start Live Chat</span>
                  <FiArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>

                <a
                  href="mailto:support@lumina.com"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-200 transition-colors"
                >
                  <HiOutlineEnvelope size={15} className="text-slate-500" />
                  <span>support@lumina.com</span>
                </a>
              </div>
            </div>

            {/* Buyer Trust Guarantees */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-white/10 shadow-lg space-y-3.5">
              <div className="flex items-center gap-2">
                <IoIosFlash size={18} className="text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Lumina Promises
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <HiOutlineShieldCheck size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">100% Buyer Protection</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Guaranteed authentic items and automated refund protection.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <HiOutlineTruck size={18} className="text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Fast Nationwide Delivery</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Dispatched from local verified fulfillment centers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <HiOutlineArrowPath size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">30-Day Easy Returns</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Simple return requests handled in just 2 clicks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default FAQPage;
