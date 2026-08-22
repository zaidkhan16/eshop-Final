import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import socketIO from "socket.io-client";
import { ENDPOINT } from "../../server";
import {
  HiOutlineChatAlt2,
  HiOutlineX,
  HiOutlinePhotograph,
  HiOutlineSparkles,
  HiOutlineChevronDown,
  HiOutlineUser,
  HiOutlineBadgeCheck,
  HiOutlineRefresh,
} from "react-icons/hi";
import { FiSend, FiMessageSquare, FiCornerDownRight } from "react-icons/fi";
import { toast } from "react-toastify";

const socketId = socketIO(ENDPOINT, { transports: ["polling", "websocket"] });

const defaultPrompts = [
  { label: "📦 Track Order", query: "How do I track my order?" },
  { label: "🚚 Shipping Times", query: "What are your shipping delivery times?" },
  { label: "💳 Payment Methods", query: "What payment methods do you accept?" },
  { label: "↩️ Return Policy", query: "What is your 30-day return policy?" },
  { label: "🏪 Seller Onboarding", query: "How do I become a seller?" },
];

const initialBotMessages = [
  {
    id: 1,
    sender: "agent",
    senderName: "Lumina AI Assistant",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    text: "👋 Hello! Welcome to Nexus Live Support. How can I assist you with your shopping or store today?",
    time: "Just now",
  },
];

const autoAnswers = {
  "track": "You can track your active orders directly by visiting your profile dashboard or clicking on the 'Track Order' link in the top menu. Enter your Order ID for real-time status updates!",
  "shipping": "We offer Free Express Shipping on orders over $99. Standard shipping takes 2-4 business days within North America & Europe, and 4-7 days internationally.",
  "payment": "We accept Visa, MasterCard, American Express, PayPal, Apple Pay, and Cash on Delivery (COD) for eligible regions.",
  "return": "We accept returns within 30 days of delivery. All items must be unused and in original packaging. Returns are 100% free with money-back guarantee!",
  "seller": "Becoming a seller is fast & free! Click on 'Become a Seller' in the top header or visit /shop-create to set up your store in 5 minutes.",
  "human": "Connecting you to a live support agent... Our team typically responds within 2 minutes. Please hold tight!",
};

const LiveChatWidget = () => {
  const { user } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("nexus_live_chat_messages");
    return saved ? JSON.parse(saved) : initialBotMessages;
  });
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem("nexus_live_chat_messages", JSON.stringify(messages));
  }, [messages, isOpen]);

  // Socket listener for real-time broadcast
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      const incomingMsg = {
        id: Date.now(),
        sender: "agent",
        senderName: "Live Support Agent",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        text: data.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, incomingMsg]);
      if (!isOpen) {
        setUnreadCount((prev) => prev + 1);
        toast.info("New message from Live Support!");
      }
    });
  }, [isOpen]);

  const handleSendMessage = (textToSend = inputMessage) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      senderName: user ? user.name : "Guest Visitor",
      avatar: user?.avatar?.url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Socket emit if socket is connected
    if (user?._id) {
      socketId.emit("sendMessage", {
        senderId: user._id,
        receiverId: "support_agent",
        text: textToSend,
      });
    }

    // Auto Bot response simulation
    setTimeout(() => {
      setIsTyping(false);
      let replyText = "Thank you for reaching out! A dedicated customer specialist is reviewing your inquiry.";
      const lower = textToSend.toLowerCase();

      if (lower.includes("track") || lower.includes("where is my order")) {
        replyText = autoAnswers.track;
      } else if (lower.includes("shipping") || lower.includes("delivery") || lower.includes("time")) {
        replyText = autoAnswers.shipping;
      } else if (lower.includes("payment") || lower.includes("pay") || lower.includes("card")) {
        replyText = autoAnswers.payment;
      } else if (lower.includes("return") || lower.includes("refund")) {
        replyText = autoAnswers.return;
      } else if (lower.includes("seller") || lower.includes("store") || lower.includes("shop")) {
        replyText = autoAnswers.seller;
      } else if (lower.includes("human") || lower.includes("agent") || lower.includes("help")) {
        replyText = autoAnswers.human;
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "agent",
        senderName: "Lumina AI Assistant",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 1200);
  };

  const handlePromptClick = (promptQuery) => {
    handleSendMessage(promptQuery);
  };

  const handleResetChat = () => {
    setMessages(initialBotMessages);
    localStorage.removeItem("nexus_live_chat_messages");
    toast.success("Chat history cleared.");
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setUnreadCount(0);
      setIsMinimized(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* CHAT POPUP WINDOW */}
      {isOpen && (
        <div
          className={`bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden w-[90vw] sm:w-[380px] transition-all duration-300 transform ${
            isMinimized ? "h-16" : "h-[540px]"
          } flex flex-col mb-4 animate-in fade-in slide-in-from-bottom-5`}
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 flex items-center justify-between shadow-md shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                  alt="Support Avatar"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400"
                />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <h4 className="text-sm font-bold text-white">Lumina Live Support</h4>
                  <HiOutlineBadgeCheck className="text-indigo-400 w-4 h-4" />
                </div>
                <span className="text-[11px] text-emerald-400 font-medium">● Online 24/7 Support</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                title="Reset Chat"
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <HiOutlineRefresh className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <HiOutlineChevronDown className={`w-4 h-4 transform transition-transform ${isMinimized ? "rotate-180" : ""}`} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <HiOutlineX className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* QUICK PROMPT PILLS */}
              <div className="bg-slate-50 p-2.5 border-b border-slate-200 overflow-x-auto flex gap-1.5 no-scrollbar shrink-0">
                {defaultPrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(p.query)}
                    className="px-3 py-1 bg-white border border-slate-200 hover:border-indigo-500 text-slate-700 hover:text-indigo-600 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-2xs transition-colors shrink-0 cursor-pointer"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {/* MESSAGES LIST */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
                {messages.map((m) => {
                  const isUser = m.sender === "user";
                  return (
                    <div
                      key={m.id}
                      className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"} items-end`}
                    >
                      <img
                        src={m.avatar}
                        alt={m.senderName}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
                        <span className="text-[10px] text-slate-400 px-1 mb-0.5">{m.senderName} • {m.time}</span>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed shadow-xs ${
                            isUser
                              ? "bg-indigo-600 text-white rounded-br-none font-medium"
                              : "bg-white text-slate-800 border border-slate-200 rounded-bl-none"
                          }`}
                        >
                          {m.text}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* TYPING INDICATOR */}
                {isTyping && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs italic p-2 bg-white rounded-2xl border border-slate-100 w-fit">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
                    <span className="text-[11px] text-slate-500 font-medium">Assistant is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* INPUT BAR */}
              <div className="p-3 bg-white border-t border-slate-200 shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim()}
                    className="p-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-40 text-white rounded-xl shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <FiSend className="w-4 h-4" />
                  </button>
                </form>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 px-1">
                  <span>Powered by Nexus AI & Real-Time Socket</span>
                  <Link to="/live-chat" onClick={() => setIsOpen(false)} className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5">
                    <span>Full Screen</span>
                    <FiCornerDownRight />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* FLOATING LAUNCHER BUTTON */}
      <button
        onClick={toggleOpen}
        className="relative group bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white p-4 rounded-full shadow-2xl shadow-indigo-600/40 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center border border-indigo-400/30"
      >
        {/* Pulsing ring indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] font-black text-white items-center justify-center border border-white">
            {unreadCount > 0 ? unreadCount : "✓"}
          </span>
        </span>

        {isOpen ? (
          <HiOutlineX className="w-7 h-7" />
        ) : (
          <HiOutlineChatAlt2 className="w-7 h-7" />
        )}
      </button>
    </div>
  );
};

export default LiveChatWidget;
