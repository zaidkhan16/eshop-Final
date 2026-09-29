import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import ProductCardSkeleton from "../components/Route/ProductCard/ProductCardSkeleton";
import styles from "../styles/styles";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!allProducts) return;
    let filtered = [...allProducts];

    if (categoryData) {
      filtered = filtered.filter(
        (i) => i.category?.toLowerCase() === categoryData.toLowerCase() || i.category === categoryData
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) ||
          i.description?.toLowerCase().includes(q) ||
          i.tags?.toLowerCase().includes(q) ||
          i.category?.toLowerCase().includes(q)
      );
    }

    setData(filtered);
  }, [allProducts, categoryData, searchQuery]);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <Header activeHeading={3} />
      <div className={`${styles.section} py-8`}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {categoryData && searchQuery
              ? `${categoryData} — "${searchQuery}"`
              : categoryData
              ? `${categoryData} Collection`
              : searchQuery
              ? `Results for "${searchQuery}"`
              : "All Products"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Discover our premium selection of authentic products.
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
            <p className="text-sm text-slate-400 mt-2">Try selecting another category or check back later.</p>
          </div>
        ) : null}
      </div>
      <Footer />
    </div>
  );
};

export default ProductsPage;
