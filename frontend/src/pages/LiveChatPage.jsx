import React, { useState, useEffect, useRef } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import styles from "../styles/styles";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { ENDPOINT } from "../server";
import { toast } from "react-toastify";
import {
  HiOutlineChatAlt2,
  HiOutlineUserGroup,
  HiOutlineBadgeCheck,
  HiOutlineClock,
  HiOutlinePhotograph,
  HiOutlinePaperClip,
  HiOutlineSparkles,
  HiOutlineShoppingBag,
  HiOutlineSearch,
} from "react-icons/hi";
import { FiSend, FiCheck, FiHeadphones, FiStore } from "react-icons/fi";

const socketId = socketIO(ENDPOINT, { transports: ["polling", "websocket"] });

const supportChannels = [
  {
    id: "ai-assistant",
    name: "Lumina Support Bot",
    role: "Automated AI Assistant",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    status: "Online 24/7",
    unread: 0,
    lastMsg: "How can I help you today?",
  },
  {
    id: "seller-support",
    name: "Seller Onboarding & Support",
    role: "Merchant Success Team",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80",
    status: "Online",
    unread: 1,
    lastMsg: "Welcome to the merchant portal!",
  },
  {
    id: "orders-support",
    name: "Order Tracking & Logistics",
    role: "Fulfillment Specialists",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    status: "Online",
    unread: 0,
    lastMsg: "Enter your order ID for live tracking.",
  },
];

const LiveChatPage = () => {
  const { user } = useSelector((state) => state.user);
  const [activeChannel, setActiveChannel] = useState(supportChannels[0]);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      senderName: "Lumina Support Bot",
      text: "👋 Welcome to Nexus 24/7 Live Support! You can ask about order tracking, shipping rates, seller registration, or request to connect with a live agent.",
      time: "10:00 AM",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "user",
      senderName: user ? user.name : "Guest Visitor",
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    const sentText = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    if (user?._id) {
      socketId.emit("sendMessage", {
        senderId: user._id,
        receiverId: activeChannel.id,
        text: sentText,
      });
    }

    // Auto bot response
    setTimeout(() => {
      setIsTyping(false);
      let reply = `Thank you for your message regarding "${sentText}". A support representative is on standby and will respond shortly.`;
      
      const lower = sentText.toLowerCase();
      if (lower.includes("track") || lower.includes("order")) {
        reply = "You can track your orders in real time under Profile -> My Orders or enter your Order ID here!";
      } else if (lower.includes("shipping") || lower.includes("delivery")) {
        reply = "Free express shipping applies on orders over $99. Delivery typically takes 2-4 business days!";
      } else if (lower.includes("seller") || lower.includes("shop")) {
        reply = "Interested in selling? Visit /shop-create to set up your store with zero upfront fees!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "agent",
          senderName: activeChannel.name,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex flex-col">
      <Header activeHeading={0} />

      {/* HERO SECTION */}
      <section className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-900 shrink-0">
        <div className={`${styles.section} text-center max-w-3xl mx-auto`}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
            <HiOutlineChatAlt2 className="w-4 h-4 text-indigo-400" />
            <span>24/7 Global Live Support</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Nexus <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Live Chat Center</span>
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2">
            Get instant answers from our AI Assistant or connect directly with verified sellers & support specialists.
          </p>
        </div>
      </section>

      {/* MAIN CHAT APPLICATION CONTAINER */}
      <section className={`${styles.section} py-8 flex-1`}>
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] h-[75vh]">
          {/* CHANNELS SIDEBAR */}
          <div className="lg:col-span-4 bg-slate-900 text-white p-6 border-r border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <FiHeadphones className="text-indigo-400" />
                  <span>Support Channels</span>
                </h3>
                <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold rounded-full">
                  Live
                </span>
              </div>

              <div className="space-y-3">
                {supportChannels.map((channel) => {
                  const isActive = activeChannel.id === channel.id;
                  return (
                    <div
                      key={channel.id}
                      onClick={() => setActiveChannel(channel)}
                      className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 flex items-center justify-between border ${
                        isActive
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30"
                          : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={channel.avatar}
                            alt={channel.name}
                            className="w-10 h-10 rounded-full object-cover border border-indigo-300"
                          />
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold leading-snug">{channel.name}</h4>
                          <span className={`text-[11px] block ${isActive ? "text-indigo-200" : "text-slate-400"}`}>
                            {channel.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Info Box */}
            <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80 mt-6">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-1">
                <HiOutlineSparkles className="w-4 h-4" />
                <span>Need Vendor Assistance?</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                You can also message sellers directly from any product page or your order history tab.
              </p>
            </div>
          </div>

          {/* CHAT MESSAGES PANEL */}
          <div className="lg:col-span-8 flex flex-col justify-between bg-slate-50/50">
            {/* PANEL HEADER */}
            <div className="p-4 sm:p-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-3">
                <img
                  src={activeChannel.avatar}
                  alt={activeChannel.name}
                  className="w-10 h-10 rounded-full object-cover border border-indigo-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{activeChannel.name}</h3>
                    <HiOutlineBadgeCheck className="text-indigo-600 w-4 h-4" />
                  </div>
                  <span className="text-xs text-emerald-600 font-semibold">● {activeChannel.status}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                  Average Response: &lt; 2 mins
                </span>
              </div>
            </div>

            {/* MESSAGES BODY */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
              {messages.map((m) => {
                const isUser = m.sender === "user";
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[11px] text-slate-400 mb-1 px-1">{m.senderName} • {m.time}</span>
                    <div
                      className={`p-4 rounded-2xl max-w-lg text-xs sm:text-sm leading-relaxed shadow-xs ${
                        isUser
                          ? "bg-indigo-600 text-white rounded-br-none font-medium"
                          : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-slate-400 text-xs italic p-3 bg-white rounded-2xl border border-slate-200 w-fit">
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200" />
                  <span>Agent is typing a response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* CHAT INPUT AREA */}
            <div className="p-4 sm:p-6 bg-white border-t border-slate-200 shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your question or message here..."
                  className="flex-1 px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <FiSend className="w-4 h-4" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LiveChatPage;
