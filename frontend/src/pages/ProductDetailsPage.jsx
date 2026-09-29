import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import ProductDetails from "../components/Products/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import Loader from "../components/Layout/Loader";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../server";

const ProductDetailsPage = () => {
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");

  useEffect(() => {
    let found = null;

    if (eventData !== null) {
      found = allEvents && allEvents.find((i) => i._id === id || String(i._id) === String(id));
      if (found) {
        setData(found);
        return;
      }
    } else {
      // 1. Try finding in Redux allProducts
      if (allProducts && allProducts.length > 0) {
        found = allProducts.find(
          (i) =>
            i._id === id ||
            String(i._id) === String(id) ||
            i.name === id ||
            i.name?.replace(/\s+/g, "-") === id
        );
        if (found) {
          setData(found);
          return;
        }
      }

      // 2. Try finding in LocalStorage cache
      try {
        const cached = localStorage.getItem("nexus_cached_products");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            found = parsed.find(
              (i) =>
                i._id === id ||
                String(i._id) === String(id) ||
                i.name === id ||
                i.name?.replace(/\s+/g, "-") === id
            );
            if (found) {
              setData(found);
              return;
            }
          }
        }
      } catch (e) {}

      // 3. Fallback: Fetch directly from server API
      if (!found && id) {
        setFetching(true);
        axios
          .get(`${server}/product/get-product/${id}`)
          .then((res) => {
            if (res.data && res.data.product) {
              setData(res.data.product);
            }
          })
          .catch((err) => {
            console.error("Could not fetch product details:", err);
          })
          .finally(() => {
            setFetching(false);
          });
      }
    }
  }, [allProducts, allEvents, id, eventData]);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-between">
      <Header />
      {fetching && !data ? (
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      ) : data ? (
        <>
          <ProductDetails data={data} />
          {!eventData && <SuggestedProduct data={data} />}
        </>
      ) : !isLoading && !fetching ? (
        <div className="py-24 text-center">
          <h2 className="text-2xl font-bold text-slate-800">Product Not Found</h2>
          <p className="text-slate-500 mt-2">The product you are looking for does not exist or may have been removed.</p>
        </div>
      ) : (
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      )}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
