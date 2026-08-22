import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { toast } from "react-toastify";
import {
  HiOutlineBookOpen,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineHeart,
  HiOutlineSparkles,
  HiOutlineShare,
  HiOutlineX,
  HiOutlineChat,
} from "react-icons/hi";
import { FiArrowRight, FiSend, FiBookmark } from "react-icons/fi";

const initialBlogs = [
  {
    id: 1,
    title: "10 E-Commerce Trends Shaping Multi-Vendor Marketplaces in 2026",
    category: "E-Commerce Guide",
    readTime: "6 min read",
    author: "Zaid Khan",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    date: "Aug 18, 2026",
    likes: 342,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    excerpt: "From AI-powered visual discovery to instant localized payment settlements, explore the tech stack driving modern multi-vendor platforms forward.",
    content: `
      Multi-vendor marketplaces are undergoing a massive transformation. As buyer expectations reach unprecedented levels of demand for speed, transparency, and personalization, merchants must adapt quickly.

      ### Key Highlights for 2026:
      1. **Instant Direct Seller Messaging**: Real-time buyer-seller communication decreases cart abandonment rates by up to 35%.
      2. **Omnichannel Fulfillment**: Combining local physical hubs with express 1-hour pickup options.
      3. **AI Discovery Engine**: Smart recommendations tailored to real-time browsing behavior rather than static historical data.

      Sellers who adopt these tools early are seeing a 4x increase in repeat customer retention.
    `,
  },
  {
    id: 2,
    title: "How Local Artisans Scaled Global Revenue by 400% on Nexus",
    category: "Seller Stories",
    readTime: "4 min read",
    author: "Priya Patel",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    date: "Aug 12, 2026",
    likes: 218,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    excerpt: "Discover how independent leather craftspeople and jewelry designers expanded beyond their local markets with automated storefront tools.",
    content: `
      Scaling a handcrafted business beyond local farmers' markets used to require immense capital for marketing and logistics. 

      With Nexus's zero-friction merchant dashboard, sellers can upload product catalogs, manage inventory across multi-currency gateways, and run target flash sales events seamlessly.
    `,
  },
  {
    id: 3,
    title: "Understanding Buyer Protection & Secure Checkout Architecture",
    category: "Tech & Innovation",
    readTime: "5 min read",
    author: "Alex Rivera",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    date: "Aug 05, 2026",
    likes: 189,
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    excerpt: "A deep dive into Stripe encryption, tokenized transactions, and zero-trust refund guarantees keeping shoppers 100% safe.",
    content: `
      Security is the bedrock of online trust. At Nexus, every transaction passes through multi-layered tokenization algorithms to ensure that sensitive payment details never hit intermediate servers.
    `,
  },
  {
    id: 4,
    title: "The Rise of Sustainable Logistics: Eco-Friendly Packaging Guidelines",
    category: "Consumer Trends",
    readTime: "7 min read",
    author: "Sarah Jenkins",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
    date: "Jul 28, 2026",
    likes: 275,
    image: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80",
    excerpt: "How eco-conscious consumers are prioritizing sellers who utilize biodegradable shipping materials and carbon-neutral delivery networks.",
    content: `
      Modern shoppers care deeply about the environmental footprint of their purchases. Our eco-packaging initiative provides vendors with discounted biodegradable mailers and carbon-offset tracking certificates.
    `,
  },
];

const BlogPage = () => {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeBlog, setActiveBlog] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([
    { name: "David M.", text: "Super insightful article! Loved the point about instant direct seller chat.", date: "2 days ago" },
    { name: "Elena R.", text: "Nexus tools really helped our store grow globally. Highly recommend!", date: "1 day ago" },
  ]);

  const categories = ["All", "E-Commerce Guide", "Seller Stories", "Tech & Innovation", "Consumer Trends"];

  const filteredBlogs = blogs.filter(
    (b) => selectedCategory === "All" || b.category === selectedCategory
  );

  const handleLike = (id, e) => {
    e.stopPropagation();
    setBlogs(
      blogs.map((b) => (b.id === id ? { ...b, likes: b.likes + 1 } : b))
    );
    toast.success("Article liked!");
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!commentInput) return;
    setComments([{ name: "You (Verified Reader)", text: commentInput, date: "Just now" }, ...comments]);
    setCommentInput("");
    toast.success("Comment posted!");
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
      <Header activeHeading={0} />

      {/* HERO SECTION */}
      <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-slate-900">
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className={`${styles.section} relative z-10 text-center max-w-3xl mx-auto`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
            <HiOutlineBookOpen className="w-4 h-4 text-indigo-400" />
            <span>Nexus Commerce Journal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Insights, Stories & <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Commerce Tech</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Stay ahead with expert guides on multi-vendor growth, marketplace innovation, seller success stories, and global e-commerce trends.
          </p>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className={`${styles.section} py-12 sm:py-16`}>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* BLOG GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredBlogs.map((blog) => (
            <div
              key={blog.id}
              onClick={() => setActiveBlog(blog)}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                    {blog.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-slate-200 text-[11px] font-semibold px-3 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                    <HiOutlineClock className="w-3.5 h-3.5" />
                    {blog.readTime}
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={blog.authorAvatar}
                      alt={blog.author}
                      className="w-8 h-8 rounded-full object-cover border border-indigo-200"
                    />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">{blog.author}</span>
                      <span className="block text-[11px] text-slate-400">{blog.date}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors mb-3 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {blog.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-slate-100 mt-auto">
                <button
                  onClick={(e) => handleLike(blog.id, e)}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-rose-500 transition-colors"
                >
                  <HiOutlineHeart className="w-4 h-4 text-rose-500" />
                  <span>{blog.likes} Likes</span>
                </button>

                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <FiArrowRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ARTICLE READER MODAL */}
      {activeBlog && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full my-8 p-6 sm:p-10 relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveBlog(null)}
              className="sticky top-0 right-0 float-right p-2 text-slate-400 hover:text-slate-800 bg-slate-100 rounded-full transition-colors z-10"
            >
              <HiOutlineX className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg mb-3">
                {activeBlog.category}
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                {activeBlog.title}
              </h2>

              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100">
                <img
                  src={activeBlog.authorAvatar}
                  alt={activeBlog.author}
                  className="w-10 h-10 rounded-full object-cover border border-indigo-200"
                />
                <div>
                  <span className="block text-sm font-bold text-slate-900">{activeBlog.author}</span>
                  <span className="block text-xs text-slate-400">{activeBlog.date} • {activeBlog.readTime}</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden mb-8 h-72">
              <img src={activeBlog.image} alt={activeBlog.title} className="w-full h-full object-cover" />
            </div>

            <div className="prose prose-slate text-sm sm:text-base leading-relaxed text-slate-700 space-y-4 mb-10">
              <p className="font-semibold text-slate-900 text-base">{activeBlog.excerpt}</p>
              <div className="whitespace-pre-line">{activeBlog.content}</div>
            </div>

            {/* COMMENTS SECTION */}
            <div className="pt-8 border-t border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <HiOutlineChat className="text-indigo-600" />
                <span>Discussion & Comments ({comments.length})</span>
              </h3>

              <form onSubmit={handleAddComment} className="flex gap-3 mb-8">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share your thoughts on this article..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs shadow-md transition-colors cursor-pointer"
                >
                  Post
                </button>
              </form>

              <div className="space-y-4">
                {comments.map((c, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900">{c.name}</span>
                      <span className="text-[11px] text-slate-400">{c.date}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BlogPage;
