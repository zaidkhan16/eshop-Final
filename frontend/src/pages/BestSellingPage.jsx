import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import ProductCardSkeleton from "../components/Route/ProductCard/ProductCardSkeleton";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";

const BestSellingPage = () => {
  const [data, setData] = useState([]);
  const { allProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0));
    setData(sortedData);
  }, [allProducts]);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <Header activeHeading={2} />
      <div className={`${styles.section} py-8`}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Best Selling Products
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Top trending products loved by our community.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6 mb-12">
          {(!data || data.length === 0) && isLoading ? (
            Array.from({ length: 15 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          ) : data && data.length > 0 ? (
            data.map((i, index) => <ProductCard data={i} key={index} />)
          ) : null}
        </div>

        {!isLoading && data && data.length === 0 ? (
          <div className="text-center w-full py-16">
            <h2 className="text-xl font-bold text-slate-700">No products found</h2>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default BestSellingPage;
