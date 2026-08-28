import React, { useState } from "react";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProfileSideBar from "../components/Profile/ProfileSidebar";
import ProfileContent from "../components/Profile/ProfileContent";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { loading } = useSelector((state) => state.user);
  const [active, setActive] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />
          <div className="w-11/12 max-w-7xl mx-auto flex flex-col 800px:flex-row gap-6 py-8">
            <div className="w-full 800px:w-[280px] shrink-0 sticky top-24 self-start">
              <ProfileSideBar active={active} setActive={setActive} />
            </div>
            <div className="flex-1 min-w-0">
              <ProfileContent active={active} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;
