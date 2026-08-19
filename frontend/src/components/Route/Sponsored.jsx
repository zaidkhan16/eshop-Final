import React from "react";
import styles from "../../styles/styles";

const Sponsored = () => {
  const brands = [
    { name: "Sony", logo: "https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png" },
    { name: "Dell", logo: "https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png" },
    { name: "LG", logo: "https://logos-world.net/wp-content/uploads/2020/05/LG-Logo.png" },
    { name: "Apple", logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png" },
  ];

  return (
    <div className={`${styles.section} my-8 sm:my-12`}>
      <div className="bg-white border border-slate-100 p-4 sm:p-8 rounded-3xl shadow-sm">
        <div className="text-center mb-4 sm:mb-6">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted Global Partners</span>
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mt-0.5">Official Brand Partners</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 items-center">
          {brands.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-3.5 sm:p-6 bg-slate-50/70 hover:bg-indigo-50/50 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all duration-300 group"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-7 sm:h-10 w-24 sm:w-32 object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sponsored;
