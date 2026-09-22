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
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (categoryData === null) {
      const d = allProducts;
      setData(d);
    } else {
      const d =
        allProducts && allProducts.filter((i) => i.category === categoryData);
      setData(d);
    }
  }, [allProducts, categoryData]);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <Header activeHeading={3} />
      <div className={`${styles.section} py-8`}>
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {categoryData ? `${categoryData} Collection` : "All Products"}
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
