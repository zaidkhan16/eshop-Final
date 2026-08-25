import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../static/data";
import styles from "../../styles/styles";

const Navbar = ({ active }) => {
  const location = useLocation();

  return (
    <div className={`flex flex-col 800px:flex-row 800px:${styles.noramlFlex} gap-1 800px:gap-1.5`}>
      {navItems &&
        navItems.map((i, index) => {
          // Dynamic matching via URL path or fallback to active prop
          const isActive =
            location.pathname === i.url || active === index + 1;

          return (
            <div className="flex" key={index}>
              <Link
                to={i.url}
                className={`relative py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer w-full 800px:w-auto flex items-center justify-center ${
                  isActive
                    ? "text-white bg-indigo-600/90 shadow-[0_2px_12px_rgba(99,102,241,0.4)] 800px:bg-indigo-600/80"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                }`}
              >
                {i.title}
                {isActive && (
                  <span className="hidden 800px:block absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-indigo-400 shadow-[0_0_8px_#818cf8]" />
                )}
              </Link>
            </div>
          );
        })}
    </div>
  );
};

export default Navbar;