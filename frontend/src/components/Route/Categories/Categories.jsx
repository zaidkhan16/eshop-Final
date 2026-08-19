import React from "react";
import { useNavigate } from "react-router-dom";
import { brandingData, categoriesData } from "../../../static/data";
import styles from "../../../styles/styles";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* Branding Features Bar */}
      <div className={`${styles.section} my-6 sm:my-8`}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 bg-white border border-slate-100 p-4 sm:p-6 rounded-3xl shadow-sm">
          {brandingData &&
            brandingData.map((i, index) => (
              <div
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-4 p-2.5 sm:p-3 rounded-2xl hover:bg-indigo-50/50 transition-colors group"
                key={index}
              >
                <div className="p-2.5 sm:p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                  {i.icon}
                </div>
                <div className="flex flex-col">
                  <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">{i.title}</h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">{i.Description}</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Categories Showcase Grid */}
      <div className={`${styles.section} mb-12 sm:mb-16`} id="categories">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-2">
          <div>
            <span className="text-[11px] sm:text-xs font-bold text-indigo-600 tracking-wider uppercase">Explore Collections</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Popular Categories</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                  className="group bg-white p-3 sm:p-4 rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer flex flex-col items-center justify-between h-[150px] sm:h-[180px] relative overflow-hidden"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <div className="w-full flex justify-between items-start z-10">
                    <h5 className="font-bold text-xs sm:text-sm text-slate-800 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                      {i.title}
                    </h5>
                  </div>
                  
                  <div className="w-full flex justify-center items-center h-[90px] sm:h-[110px] mt-1 sm:mt-2 relative">
                    <div className="absolute inset-0 bg-indigo-50/50 rounded-2xl group-hover:scale-95 transition-transform duration-300"></div>
                    <img
                      src={i.image_Url}
                      className="w-[70px] h-[70px] sm:w-[90px] sm:h-[90px] object-contain z-10 group-hover:scale-110 transition-transform duration-300 drop-shadow-md"
                      alt={i.title}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
