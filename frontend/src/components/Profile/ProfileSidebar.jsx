import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
 const {user} = useSelector((state) => state.user);
  const logoutHandler = () => {
    localStorage.removeItem("token");
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response?.data?.message || error.message);
      });
  };
  return (
    <div className="w-full bg-white shadow-sm border border-slate-200/80 rounded-3xl p-3 sm:p-4 space-y-1">
      <button
        type="button"
        className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 text-left ${
          active === 1
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
            : "text-slate-700 hover:bg-slate-100 font-medium"
        }`}
        onClick={() => setActive(1)}
      >
        <RxPerson size={18} className={active === 1 ? "text-white" : "text-slate-500"} />
        <span className="800px:block hidden text-xs tracking-wide">
          Profile
        </span>
      </button>

      <button
        type="button"
        className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 text-left ${
          active === 2
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
            : "text-slate-700 hover:bg-slate-100 font-medium"
        }`}
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={18} className={active === 2 ? "text-white" : "text-slate-500"} />
        <span className="800px:block hidden text-xs tracking-wide">
          Orders
        </span>
      </button>

      <button
        type="button"
        className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 text-left ${
          active === 3
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
            : "text-slate-700 hover:bg-slate-100 font-medium"
        }`}
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={18} className={active === 3 ? "text-white" : "text-slate-500"} />
        <span className="800px:block hidden text-xs tracking-wide">
          Refunds
        </span>
      </button>

      <button
        type="button"
        className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 text-left ${
          active === 4
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
            : "text-slate-700 hover:bg-slate-100 font-medium"
        }`}
        onClick={() => setActive(4) || navigate("/inbox")}
      >
        <AiOutlineMessage size={18} className={active === 4 ? "text-white" : "text-slate-500"} />
        <span className="800px:block hidden text-xs tracking-wide">
          Inbox
        </span>
      </button>

      <button
        type="button"
        className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 text-left ${
          active === 5
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
            : "text-slate-700 hover:bg-slate-100 font-medium"
        }`}
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={18} className={active === 5 ? "text-white" : "text-slate-500"} />
        <span className="800px:block hidden text-xs tracking-wide">
          Track Order
        </span>
      </button>

      <button
        type="button"
        className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 text-left ${
          active === 6
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
            : "text-slate-700 hover:bg-slate-100 font-medium"
        }`}
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine size={18} className={active === 6 ? "text-white" : "text-slate-500"} />
        <span className="800px:block hidden text-xs tracking-wide">
          Change Password
        </span>
      </button>

      <button
        type="button"
        className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 text-left ${
          active === 7
            ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
            : "text-slate-700 hover:bg-slate-100 font-medium"
        }`}
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={18} className={active === 7 ? "text-white" : "text-slate-500"} />
        <span className="800px:block hidden text-xs tracking-wide">
          Addresses
        </span>
      </button>

      {user && user?.role === "Admin" && (
        <Link to="/admin/dashboard" className="block">
          <div
            className={`flex items-center gap-3 w-full p-3 rounded-2xl transition-all duration-200 text-left ${
              active === 8
                ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold shadow-md shadow-indigo-500/20"
                : "text-slate-700 hover:bg-slate-100 font-medium"
            }`}
            onClick={() => setActive(8)}
          >
            <MdOutlineAdminPanelSettings size={18} className={active === 8 ? "text-white" : "text-slate-500"} />
            <span className="800px:block hidden text-xs tracking-wide">
              Admin Dashboard
            </span>
          </div>
        </Link>
      )}

      <div className="pt-2 border-t border-slate-100 mt-2">
        <button
          type="button"
          className="flex items-center gap-3 w-full p-3 rounded-2xl text-rose-600 hover:bg-rose-50 font-medium transition-all duration-200 text-left"
          onClick={logoutHandler}
        >
          <AiOutlineLogin size={18} />
          <span className="800px:block hidden text-xs tracking-wide">
            Log out
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
