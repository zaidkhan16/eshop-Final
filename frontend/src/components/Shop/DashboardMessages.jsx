import axios from "axios";
import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { server, ENDPOINT } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiSend,
  FiImage,
  FiArrowLeft,
  FiSearch,
  FiMessageSquare,
  FiX,
} from "react-icons/fi";
import { HiOutlineSparkles, HiOutlineChatAlt2 } from "react-icons/hi";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { toast } from "react-toastify";

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const location = useLocation();

  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userData, setUserData] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [previewModalImg, setPreviewModalImg] = useState(null);

  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  // Initialize Socket safely
  useEffect(() => {
    try {
      socketRef.current = socketIO(ENDPOINT, {
        transports: ["polling", "websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketRef.current.on("getMessage", (data) => {
        if (data) {
          setMessages((prev) => {
            const exists = prev.some(
              (m) =>
                (m._id && m._id === data._id) ||
                (m.text === data.text && m.sender === data.senderId && Math.abs(new Date(m.createdAt) - new Date()) < 3000)
            );
            if (exists) return prev;
            return [
              ...prev,
              {
                sender: data.senderId,
                text: data.text,
                images: data.images,
                createdAt: Date.now(),
              },
            ];
          });
        }
      });

      socketRef.current.on("getUsers", (data) => {
        if (Array.isArray(data)) {
          setOnlineUsers(data);
        }
      });
    } catch (err) {
      console.warn("Socket connection warning:", err);
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Register seller on socket
  useEffect(() => {
    if (seller?._id && socketRef.current) {
      socketRef.current.emit("addUser", seller._id);
    }
  }, [seller?._id]);

  // Fetch all seller conversations
  const fetchConversations = useCallback(async () => {
    if (!seller?._id) return;
    try {
      const res = await axios.get(
        `${server}/conversation/get-all-conversation-seller/${seller._id}`,
        { withCredentials: true }
      );
      if (res.data?.conversations) {
        setConversations(res.data.conversations);
      }
    } catch (error) {
      console.error("Failed to load seller conversations:", error);
    } finally {
      setLoadingConversations(false);
    }
  }, [seller?._id]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle URL query param (e.g., /dashboard-messages?65f3a...)
  useEffect(() => {
    const rawSearch = location.search.replace("?", "");
    if (!rawSearch) return;

    let targetId = rawSearch;
    if (targetId.includes("id=")) {
      const params = new URLSearchParams(location.search);
      targetId = params.get("id") || rawSearch;
    }

    if (targetId && conversations.length > 0) {
      const matched = conversations.find((c) => c._id === targetId);
      if (matched) {
        setCurrentChat(matched);
      }
    }
  }, [location.search, conversations]);

  // Fetch customer info when current chat changes
  useEffect(() => {
    if (!currentChat || !seller?._id) return;
    const partnerId = currentChat.members.find((m) => m !== seller._id);
    if (!partnerId) return;

    const getPartnerInfo = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${partnerId}`);
        if (res.data?.user) {
          setUserData(res.data.user);
        }
      } catch (e) {
        try {
          const shopRes = await axios.get(`${server}/shop/get-shop-info/${partnerId}`);
          if (shopRes.data?.shop) {
            setUserData(shopRes.data.shop);
          }
        } catch (err) {
          console.error("Failed to get customer info:", err);
        }
      }
    };

    getPartnerInfo();
  }, [currentChat, seller?._id]);

  // Fetch messages for active chat
  const fetchMessages = useCallback(async (isPolling = false) => {
    if (!currentChat?._id) return;
    if (!isPolling) setLoadingMessages(true);
    try {
      const res = await axios.get(
        `${server}/message/get-all-messages/${currentChat._id}`
      );
      if (res.data?.messages) {
        setMessages(res.data.messages);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      if (!isPolling) setLoadingMessages(false);
    }
  }, [currentChat?._id]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // 4-Second Polling Sync Fallback
  useEffect(() => {
    if (!currentChat?._id) return;
    const interval = setInterval(() => {
      fetchMessages(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentChat?._id, fetchMessages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Check if customer is online
  const isCustomerOnline = useMemo(() => {
    if (!currentChat || !seller?._id) return false;
    const partnerId = currentChat.members.find((m) => m !== seller._id);
    return onlineUsers.some((u) => u.userId === partnerId);
  }, [currentChat, seller?._id, onlineUsers]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    if (!searchTerm.trim()) return conversations;
    const q = searchTerm.toLowerCase();
    return conversations.filter(
      (c) =>
        c.lastMessage?.toLowerCase().includes(q) ||
        c.groupTitle?.toLowerCase().includes(q) ||
        c._id?.toLowerCase().includes(q)
    );
  }, [conversations, searchTerm]);

  // Send message
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    const textToSend = newMessage.trim();
    if (!textToSend && !imagePreview) return;
    if (!currentChat || !seller?._id) return;

    const receiverId = currentChat.members.find((m) => m !== seller._id);

    setSendingMessage(true);

    try {
      if (socketRef.current) {
        socketRef.current.emit("sendMessage", {
          senderId: seller._id,
          receiverId,
          text: textToSend,
        });
        socketRef.current.emit("updateLastMessage", {
          lastMessage: textToSend,
          lastMessagesId: seller._id,
        });
      }
    } catch (err) {
      console.warn("Socket send error:", err);
    }

    try {
      const messagePayload = {
        sender: seller._id,
        text: textToSend,
        conversationId: currentChat._id,
        images: imagePreview || undefined,
      };

      const res = await axios.post(
        `${server}/message/create-new-message`,
        messagePayload
      );

      if (res.data?.message) {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessage("");
        setImagePreview(null);

        await axios.put(
          `${server}/conversation/update-last-message/${currentChat._id}`,
          {
            lastMessage: textToSend || "Sent an image",
            lastMessageId: seller._id,
          }
        );

        fetchConversations();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to send message."
      );
    } finally {
      setSendingMessage(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.warning("Please choose an image under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImagePreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectChat = (chat) => {
    setCurrentChat(chat);
    navigate(`/dashboard-messages?${chat._id}`);
  };

  const handleBackToList = () => {
    setCurrentChat(null);
    navigate("/dashboard-messages");
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Customer Inquiries & Messages
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
              <HiOutlineSparkles /> Real-Time
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Respond to buyer inquiries, resolve support questions, and build store loyalty.
          </p>
        </div>
      </div>

      {/* 2-Column Split Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden h-[75vh] flex">
        {/* Left Column: Conversations List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-slate-50/50 ${
            currentChat ? "hidden md:flex" : "flex"
          }`}
        >
          {/* Search bar */}
          <div className="p-4 border-b border-slate-100 bg-white">
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
              />
              <FiSearch className="absolute left-3 top-2.5 text-slate-400 text-sm" />
            </div>
          </div>

          {/* Conversation list items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 scrollbar-thin">
            {loadingConversations ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Loading chats...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto text-xl">
                  <HiOutlineChatAlt2 />
                </div>
                <h4 className="text-sm font-bold text-slate-800">
                  No Customer Inquiries
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  When customers message you about products, conversations will appear here.
                </p>
              </div>
            ) : (
              filteredConversations.map((item) => {
                const isSelected = currentChat?._id === item._id;
                const partnerId = item.members.find((m) => m !== seller?._id);
                const isOnline = onlineUsers.some((u) => u.userId === partnerId);

                return (
                  <SellerConversationItem
                    key={item._id}
                    data={item}
                    currentSellerId={seller?._id}
                    isSelected={isSelected}
                    isOnline={isOnline}
                    onClick={() => handleSelectChat(item)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Chat */}
        <div
          className={`flex-1 flex flex-col bg-white ${
            !currentChat ? "hidden md:flex" : "flex"
          }`}
        >
          {currentChat ? (
            <>
              {/* Active Chat Header */}
              <div className="p-4 px-6 border-b border-slate-100 flex items-center justify-between bg-white/95 backdrop-blur-md">
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={handleBackToList}
                    className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    <FiArrowLeft size={18} />
                  </button>

                  <div className="relative">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden border border-slate-200">
                      {userData?.avatar?.url ? (
                        <img
                          src={userData.avatar.url}
                          alt={userData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{userData?.name ? userData.name[0] : "C"}</span>
                      )}
                    </div>
                    <span
                      className={`w-3 h-3 rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-white ${
                        isCustomerOnline ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      {userData?.name || "Customer"}
                    </h3>
                    <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isCustomerOnline ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {isCustomerOnline ? (
                        <span className="text-emerald-600 font-semibold">
                          Active Now
                        </span>
                      ) : (
                        "Offline"
                      )}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-400 font-mono">
                  Chat ID: #{currentChat._id.slice(0, 8)}
                </div>
              </div>

              {/* Messages History */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/50 to-white scrollbar-thin">
                {loadingMessages ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl">
                      <FiMessageSquare />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Customer Conversation
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm">
                      Reply promptly to customer questions to increase store conversion and satisfaction.
                    </p>
                  </div>
                ) : (
                  messages.map((item, index) => {
                    const isMe = item.sender === seller?._id;
                    return (
                      <div
                        key={item._id || index}
                        className={`flex items-end gap-2.5 ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                        ref={index === messages.length - 1 ? scrollRef : null}
                      >
                        {!isMe && (
                          <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden mb-1">
                            {userData?.avatar?.url ? (
                              <img
                                src={userData.avatar.url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span>{userData?.name ? userData.name[0] : "C"}</span>
                            )}
                          </div>
                        )}

                        <div
                          className={`max-w-[78%] sm:max-w-md space-y-1 ${
                            isMe ? "items-end text-right" : "items-start text-left"
                          }`}
                        >
                          {item.images && (
                            <div
                              onClick={() =>
                                setPreviewModalImg(
                                  typeof item.images === "string"
                                    ? item.images
                                    : item.images?.url
                                )
                              }
                              className="cursor-pointer rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs max-w-xs hover:opacity-95 transition-opacity"
                            >
                              <img
                                src={
                                  typeof item.images === "string"
                                    ? item.images
                                    : item.images?.url
                                }
                                alt="Attachment"
                                className="w-full max-h-64 object-cover"
                              />
                            </div>
                          )}

                          {item.text && (
                            <div
                              className={`p-3.5 px-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                                isMe
                                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-br-xs"
                                  : "bg-white border border-slate-200 text-slate-800 rounded-bl-xs"
                              }`}
                            >
                              <p>{item.text}</p>
                            </div>
                          )}

                          <span className="text-[10px] text-slate-400 block px-1">
                            {format(item.createdAt || Date.now())}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Image Preview bar */}
              {imagePreview && (
                <div className="p-3 px-6 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      Image attached
                    </span>
                  </div>
                  <button
                    onClick={() => setImagePreview(null)}
                    className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              )}

              {/* Chat Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-3.5 sm:p-4 border-t border-slate-100 bg-white flex items-center gap-2.5"
              >
                <label
                  htmlFor="seller-chat-image-upload"
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-indigo-600 cursor-pointer transition-colors"
                  title="Attach Photo"
                >
                  <FiImage size={18} />
                  <input
                    id="seller-chat-image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                </label>

                <input
                  type="text"
                  placeholder={`Reply to ${userData?.name || "customer"}...`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 py-2.5 px-4 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                />

                <button
                  type="submit"
                  disabled={sendingMessage || (!newMessage.trim() && !imagePreview)}
                  className="p-2.5 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
                >
                  {sendingMessage ? (
                    <span className="text-xs">Sending...</span>
                  ) : (
                    <>
                      <FiSend size={15} />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl shadow-sm">
                <FiMessageSquare />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Select a Customer Chat
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Click any conversation on the left to start replying to customer inquiries in real-time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal Lightbox */}
      {previewModalImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setPreviewModalImg(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={previewModalImg}
              alt="Zoomed attachment"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setPreviewModalImg(null)}
              className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const SellerConversationItem = ({
  data,
  currentSellerId,
  isSelected,
  isOnline,
  onClick,
}) => {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const customerId = data.members.find((m) => m !== currentSellerId);
    if (!customerId) return;

    let isMounted = true;
    const loadCustomer = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${customerId}`);
        if (isMounted && res.data?.user) {
          setCustomer(res.data.user);
        }
      } catch (e) {
        try {
          const shopRes = await axios.get(`${server}/shop/get-shop-info/${customerId}`);
          if (isMounted && shopRes.data?.shop) {
            setCustomer(shopRes.data.shop);
          }
        } catch (err) {
          // ignore
        }
      }
    };
    loadCustomer();
    return () => {
      isMounted = false;
    };
  }, [data, currentSellerId]);

  const customerName = customer?.name || "Customer";
  const customerAvatar = customer?.avatar?.url;
  const isMine = data?.lastMessageId === currentSellerId;

  return (
    <div
      onClick={onClick}
      className={`p-3.5 px-4 cursor-pointer transition-all flex items-center gap-3 relative ${
        isSelected
          ? "bg-indigo-50/70 border-l-4 border-indigo-600"
          : "hover:bg-slate-100/60"
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-xs overflow-hidden border border-slate-200">
          {customerAvatar ? (
            <img
              src={customerAvatar}
              alt={customerName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{customerName[0]}</span>
          )}
        </div>
        <span
          className={`w-2.5 h-2.5 rounded-full absolute -top-0.5 -right-0.5 ring-2 ring-white ${
            isOnline ? "bg-emerald-500" : "bg-slate-300"
          }`}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <h4
            className={`text-xs font-bold truncate ${
              isSelected ? "text-indigo-950" : "text-slate-900"
            }`}
          >
            {customerName}
          </h4>
          <span className="text-[10px] text-slate-400 whitespace-nowrap ml-1">
            {format(data.updatedAt || data.createdAt || Date.now())}
          </span>
        </div>

        <p className="text-[11px] text-slate-500 truncate">
          {isMine && <span className="font-semibold text-slate-700">You: </span>}
          {data.lastMessage || "Customer started a conversation"}
        </p>
      </div>
    </div>
  );
};

export default DashboardMessages;
