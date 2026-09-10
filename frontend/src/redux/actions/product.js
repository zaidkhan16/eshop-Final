import axios from "axios";
import { server } from "../../server";

// create product
export const createProduct =
  (
    productData,
    description,
    category,
    tags,
    originalPrice,
    discountPrice,
    stock,
    shopId,
    images
  ) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "productCreateRequest",
      });

      const payload =
        typeof productData === "object"
          ? productData
          : {
              name: productData,
              description,
              category,
              tags,
              originalPrice,
              discountPrice,
              stock,
              shopId,
              images,
            };

      const sellerToken = localStorage.getItem("seller_token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(sellerToken ? { Authorization: `Bearer ${sellerToken.trim()}`, "x-seller-token": sellerToken.trim() } : {}),
        },
        withCredentials: true,
      };

      console.log("[NEXUS_API] createProduct dispatching to:", `${server}/product/create-product`, {
        name: payload.name,
        category: payload.category,
        shopId: payload.shopId,
        imageCount: payload.images?.length,
      });

      const { data } = await axios.post(
        `${server}/product/create-product`,
        payload,
        config
      );

      console.log("[NEXUS_API] createProduct success response:", data);

      dispatch({
        type: "productCreateSuccess",
        payload: data.product,
      });
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      console.error("[NEXUS_API] createProduct failed:", {
        url: `${server}/product/create-product`,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: errorMsg,
      });
      dispatch({
        type: "productCreateFail",
        payload: errorMsg,
      });
    }
  };

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    console.log("[FETCH_PRODUCTS] Requesting from URL:", `${server}/product/get-all-products`);
    const { data } = await axios.get(`${server}/product/get-all-products`);
    console.log("[FETCH_PRODUCTS] Received products count:", data?.products?.length, data);

    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    console.error("[FETCH_PRODUCTS_ERROR]:", error.response || error.message);
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};
