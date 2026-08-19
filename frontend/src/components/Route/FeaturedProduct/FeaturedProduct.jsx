import React from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);
   
  return (
    <div className="py-8 bg-slate-50/50">
      <div className={`${styles.section}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wider">
              ⭐ Handpicked For You
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Featured Products
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 mb-8 sm:mb-12">
          {allProducts && allProducts.length !== 0 && (
            <>
              {allProducts.map((i, index) => <ProductCard data={i} key={index} />)}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
