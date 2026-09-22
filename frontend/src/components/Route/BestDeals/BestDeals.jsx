import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCardSkeleton";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0));
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div className="py-8">
      <div className={`${styles.section}`}>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-50 text-pink-600 border border-pink-100 uppercase tracking-wider">
              🔥 Hot Selling Offers
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
              Best Deals of the Week
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 mb-8 sm:mb-12">
          {(!data || data.length === 0) && isLoading ? (
            Array.from({ length: 5 }).map((_, idx) => (
              <ProductCardSkeleton key={idx} />
            ))
          ) : data && data.length !== 0 ? (
            data.map((i, index) => <ProductCard data={i} key={index} />)
          ) : (
            <div className="col-span-full py-8 text-center text-slate-400 text-sm font-medium">
              No deals currently available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BestDeals;
