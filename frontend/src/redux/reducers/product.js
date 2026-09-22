import { createReducer } from "@reduxjs/toolkit";

const getCachedProducts = () => {
  try {
    const cached = localStorage.getItem("nexus_cached_products");
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Could not read cached products:", e);
  }
  return null;
};

const initialCachedProducts = getCachedProducts();

const initialState = {
  isLoading: initialCachedProducts ? false : true,
  allProducts: initialCachedProducts || [],
  isFetchingBackground: false,
};

export const productReducer = createReducer(initialState, {
  productCreateRequest: (state) => {
    state.isLoading = true;
  },
  productCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.product = action.payload;
    state.success = true;
  },
  productCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  // get all products of shop
  getAllProductsShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllProductsShopSuccess: (state, action) => {
    state.isLoading = false;
    state.products = action.payload;
  },
  getAllProductsShopFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // delete product of a shop
  deleteProductRequest: (state) => {
    state.isLoading = true;
  },
  deleteProductSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteProductFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all products (SWR pattern)
  getAllProductsRequest: (state) => {
    // Only show blocking loading if no products exist in cache
    if (!state.allProducts || state.allProducts.length === 0) {
      state.isLoading = true;
    }
    state.isFetchingBackground = true;
  },
  getAllProductsSuccess: (state, action) => {
    state.isLoading = false;
    state.isFetchingBackground = false;
    state.allProducts = action.payload;

    try {
      if (Array.isArray(action.payload) && action.payload.length > 0) {
        localStorage.setItem("nexus_cached_products", JSON.stringify(action.payload));
      }
    } catch (e) {
      console.warn("Could not cache products to localStorage:", e);
    }
  },
  getAllProductsFailed: (state, action) => {
    state.isLoading = false;
    state.isFetchingBackground = false;
    state.error = action.payload;
  },
  
  clearErrors: (state) => {
    state.error = null;
  },
});

