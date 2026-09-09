import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardMessages from "../../components/Shop/DashboardMessages";

const ShopInboxPage = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col font-Poppins selection:bg-indigo-500 selection:text-white">
      <DashboardHeader />
      <div className="flex items-start w-full flex-1 max-w-[1800px] mx-auto">
        <div className="w-[68px] 800px:w-[280px] flex-shrink-0">
          <DashboardSideBar active={8} />
        </div>
        <div className="flex-1 min-w-0 overflow-x-hidden">
          <DashboardMessages />
        </div>
      </div>
    </div>
  );
};

export default ShopInboxPage;