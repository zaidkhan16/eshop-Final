import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { toast } from "react-toastify";
import {
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import {
  HiOutlineBadgeCheck,
  HiOutlineThumbUp,
  HiOutlineSearch,
  HiOutlineSparkles,
  HiOutlineUser,
  HiOutlineX,
  HiOutlinePencilAlt,
} from "react-icons/hi";
import { FiCheck, FiSend } from "react-icons/fi";

const initialReviews = [
  {
    id: 1,
    author: "Samantha Reed",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    role: "Verified Buyer",
    rating: 5,
    date: "Aug 20, 2026",
    item: "MacBook Pro M2 Space Gray",
    store: "Apple Inc.",
    title: "Blazing fast delivery and pristine packaging!",
    comment: "Ordered on Tuesday afternoon and received my laptop by Wednesday evening. The live order tracking updated every step of the way. 100% satisfied!",
    helpful: 48,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    author: "Elena Rostova",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    role: "Verified Merchant",
    rating: 5,
    date: "Aug 16, 2026",
    item: "Rostova Leather Storefront",
    store: "Independent Artisan Store",
    title: "Best multi-vendor platform for small business growth!",
    comment: "Setting up our store took less than 15 minutes. The seller dashboard gives us complete control over discount coupons and customer messaging. Sales are up 300%!",
    helpful: 62,
    image: null,
  },
  {
    id: 3,
    author: "Marcus Vance",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    role: "Verified Buyer",
    rating: 5,
    date: "Aug 11, 2026",
    item: "Asus ROG Gaming Headphone",
    store: "Asus Ltd",
    title: "Unbeatable sound quality and genuine product guarantee.",
    comment: "Was hesitant at first buying high-end electronics online, but Nexus's buyer protection gave me total peace of mind. Product is 100% authentic.",
    helpful: 29,
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    author: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    role: "Verified Buyer",
    rating: 4,
    date: "Aug 04, 2026",
    item: "Casual Men's Watch Collection",
    store: "Shahriar Watch House",
    title: "Great watch, fast customer service!",
    comment: "The watch looks even better in person. Customer support answered my sizing question within 5 minutes on live chat.",
    helpful: 19,
    image: null,
  },
];

const ReviewsPage = () => {
  const [reviews, setReviews] = useState(initialReviews);
  const [filterRating, setFilterRating] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    author: "",
    role: "Verified Buyer",
    rating: 5,
    item: "",
    store: "",
    title: "",
    comment: "",
  });

  const filteredReviews = reviews.filter((r) => {
    const matchesRating =
      filterRating === "All" ||
      (filterRating === "5-Star" && r.rating === 5) ||
      (filterRating === "Buyer" && r.role.includes("Buyer")) ||
      (filterRating === "Merchant" && r.role.includes("Merchant"));
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.item.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const handleHelpful = (id) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r))
    );
    toast.success("Thank you for marking this review as helpful!");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.author || !newReview.title || !newReview.comment) {
      toast.error("Please fill in your name, review title, and comments.");
      return;
    }

    const createdReview = {
      id: Date.now(),
      author: newReview.author,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      role: newReview.role,
      rating: parseInt(newReview.rating),
      date: "Just now",
      item: newReview.item || "Featured Marketplace Product",
      store: newReview.store || "Nexus Marketplace Store",
      title: newReview.title,
      comment: newReview.comment,
      helpful: 0,
      image: null,
    };

    setReviews([createdReview, ...reviews]);
    setShowReviewModal(false);
    setNewReview({
      author: "",
      role: "Verified Buyer",
      rating: 5,
      item: "",
      store: "",
      title: "",
      comment: "",
    });
    toast.success("Thank you! Your review has been posted.");
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header activeHeading={0} />

      {/* HERO SECTION */}
      <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-900">
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className={`${styles.section} relative z-10 text-center max-w-4xl mx-auto`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-6">
            <HiOutlineSparkles className="w-4 h-4 text-amber-400" />
            <span>Community Feedback</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Real Reviews from <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">Real Shoppers & Sellers</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Read transparent ratings and experiences from verified buyers and independent merchants around the globe.
          </p>

          <button
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-8 py-3.5 rounded-2xl text-sm sm:text-base shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <HiOutlinePencilAlt className="w-5 h-5" />
            <span>Write a Review</span>
          </button>
        </div>
      </section>

      {/* RATING OVERVIEW BAR */}
      <section className="bg-white py-10 border-b border-slate-200">
        <div className={`${styles.section} max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left`}>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-5xl font-black text-slate-900 tracking-tight">4.9</span>
            <div className="flex items-center gap-1 text-amber-400 my-2">
              {[...Array(5)].map((_, i) => (
                <AiFillStar key={i} className="w-5 h-5" />
              ))}
            </div>
            <span className="text-xs text-slate-500 font-semibold">Based on 45,210+ Verified Reviews</span>
          </div>

          <div className="col-span-2 space-y-2">
            <RatingBar stars="5 Star" percent="88%" count="39,780" />
            <RatingBar stars="4 Star" percent="9%" count="4,068" />
            <RatingBar stars="3 Star" percent="2%" count="904" />
            <RatingBar stars="2 Star" percent="1%" count="458" />
          </div>
        </div>
      </section>

      {/* FILTER & REVIEWS LIST */}
      <section className={`${styles.section} py-16 sm:py-20`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {["All", "5-Star", "Buyer", "Merchant"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterRating(f)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  filterRating === f
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {f} {f === "All" ? `(${reviews.length})` : ""}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reviews by keyword or product..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 shadow-xs"
            />
            <HiOutlineSearch className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredReviews.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={r.avatar}
                      alt={r.author}
                      className="w-10 h-10 rounded-full object-cover border border-amber-300"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900">{r.author}</span>
                        <HiOutlineBadgeCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">{r.role}</span>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">{r.date}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(r.rating)].map((_, i) => (
                    <AiFillStar key={i} className="w-4 h-4" />
                  ))}
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-2">{r.title}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">{r.comment}</p>

                {r.image && (
                  <div className="rounded-2xl overflow-hidden mb-4 h-44">
                    <img src={r.image} alt="Review attachment" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{r.item} • {r.store}</span>
                <button
                  onClick={() => handleHelpful(r.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  <HiOutlineThumbUp className="w-4 h-4" />
                  <span>Helpful ({r.helpful})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full transition-colors"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Community Review</span>
              <h3 className="text-xl font-extrabold text-slate-900 mt-1">Share Your Experience</h3>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Your Name *</label>
                <input
                  type="text"
                  required
                  value={newReview.author}
                  onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                  placeholder="e.g. David Miller"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Role</label>
                  <select
                    value={newReview.role}
                    onChange={(e) => setNewReview({ ...newReview, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Verified Buyer">Verified Buyer</option>
                    <option value="Verified Merchant">Verified Merchant</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="5">5 Stars (Excellent)</option>
                    <option value="4">4 Stars (Good)</option>
                    <option value="3">3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Product / Store Name</label>
                <input
                  type="text"
                  value={newReview.item}
                  onChange={(e) => setNewReview({ ...newReview, item: e.target.value })}
                  placeholder="e.g. Apple MacBook Pro or Store Name"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Review Headline *</label>
                <input
                  type="text"
                  required
                  value={newReview.title}
                  onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                  placeholder="Summarize your experience in one line..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Detailed Feedback *</label>
                <textarea
                  rows={3}
                  required
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Write your thoughts about product quality, shipping speed, or seller communication..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FiSend />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

const RatingBar = ({ stars, percent, count }) => (
  <div className="flex items-center gap-3 text-xs">
    <span className="w-14 font-bold text-slate-700 shrink-0">{stars}</span>
    <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden">
      <div className="bg-amber-400 h-full rounded-full" style={{ width: percent }} />
    </div>
    <span className="w-16 text-right text-slate-500 font-semibold shrink-0">{count}</span>
  </div>
);

export default ReviewsPage;
