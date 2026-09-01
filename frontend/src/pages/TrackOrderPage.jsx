import React, { useEffect } from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import TrackOrder from "../components/Profile/TrackOrder";

const TrackOrderPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Track Product & Order Status | Lumina Market";
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-grow">
        <TrackOrder />
      </main>
      <Footer />
    </div>
  );
};

export default TrackOrderPage;