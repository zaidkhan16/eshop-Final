import React from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const DropDown = ({ categoriesData, setDropDown }) => {
  const navigate = useNavigate();

  const submitHandle = (i) => {
    navigate(`/products?category=${encodeURIComponent(i.title)}`);
    setDropDown(false);
  };

  return (
    <div className="w-[260px] bg-white/95 backdrop-blur-md dark:bg-slate-900/95 absolute top-[60px] left-0 z-50 rounded-b-2xl shadow-2xl border border-slate-200/80 dark:border-slate-800 py-2.5 max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 transition-all duration-200 animate-in fade-in-50 zoom-in-95">
      {categoriesData &&
        categoriesData.map((i, index) => (
          <div
            key={index}
            className="group relative flex items-center justify-between px-3.5 py-2.5 mx-2 my-0.5 rounded-xl cursor-pointer transition-all duration-200 text-slate-700 dark:text-slate-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-indigo-50/40 dark:hover:from-indigo-950/60 dark:hover:to-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 hover:translate-x-1.5 hover:shadow-xs active:scale-[0.98]"
            onClick={() => submitHandle(i)}
          >
            {/* Left Accent Bar on Hover */}
            <span className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-all duration-200 scale-y-0 group-hover:scale-y-100 origin-center" />

            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 p-1 flex items-center justify-center shrink-0 group-hover:bg-white dark:group-hover:bg-indigo-900/60 group-hover:shadow-xs group-hover:scale-110 group-hover:rotate-3 transition-all duration-200">
                <img
                  src={i.image_Url}
                  alt={i.title}
                  className="w-full h-full object-contain select-none"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/3081/3081840.png";
                  }}
                />
              </div>
              <span className="text-[13px] font-medium tracking-tight truncate select-none group-hover:font-semibold transition-colors duration-200">
                {i.title}
              </span>
            </div>

            <IoIosArrowForward
              size={14}
              className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 shrink-0"
            />
          </div>
        ))}
    </div>
  );
};

export default DropDown;
