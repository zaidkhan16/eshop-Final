import React from "react";
import Lottie from "lottie-react";
import animationData from "../../Assests/animations/24151-ecommerce-animation.json";

const Loader = () => {
  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-4 font-Poppins">
      {/* Glowing background ambient lights */}
      <div className="absolute w-72 h-72 bg-indigo-600/30 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-700"></div>

      {/* Lottie Animation & Spinner Container */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <div className="w-64 h-64 relative flex items-center justify-center">
          <Lottie
            animationData={animationData}
            loop={true}
            autoplay={true}
            style={{ width: 260, height: 260 }}
          />
        </div>

        {/* Dynamic Loading Status Text */}
        <div className="mt-2 flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-800/80 shadow-2xl backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></div>
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            Loading Nexus Next-Gen Market...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
