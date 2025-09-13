import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts = createAsyncThunk(
  "home/fetchProducts",
  async () => {
    const response = await fetch("http://localhost:5000/products/all");
    if (!response.ok) throw new Error("Failed to fetch products");
    const data = await response.json();
    return data;
  }
);

export const updateCart = createAsyncThunk(
  "home/updateCart",
  async (items, { rejectWithValue }) => {
    // items should be an array of objects like [{ productId, quantity }, ...]
    try {
      const response = await fetch("http://localhost:5000/add-to-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(items),
      });

      if (!response.ok) {
        return rejectWithValue(`Failed with status ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromCartApi = createAsyncThunk(
  "home/removeFromCartApi",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `http://localhost:5000/remove-from-cart/${productId}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        return rejectWithValue(`Failed with status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const clearCartApi = createAsyncThunk(
  "home/clearCartApi",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`http://localhost:5000/clear-cart`);
      if (!response.ok) {
        return rejectWithValue(`Failed with status ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState: {
    searchItem: "",
    selectedStatus: "All status",
    selectedCategory: "Message Therapy",
    items: [],
    products: [],
    status: "idle",
    error: null,
    cartStatus: "idle",
    cartError: null,
    lastCartResponse: null,
  },
  reducers: {
    changeSearchItem: (state, action) => {
      state.searchItem = action.payload;
    },
    setStatus: (state, action) => {
      state.selectedStatus = action.payload;
    },
    changeSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const product = state.items.find((item) => item.id === action.payload);
      if (product) product.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const product = state.items.find((item) => item.id === action.payload);
      if (product) {
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
        }
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProducts.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.products = (action.payload || []).map((p) => ({
        ...p,
        id: p.id || p._id || p._id?.toString?.(),
      }));
    });
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error?.message;
    });

    // removeFromCartApi status
    builder.addCase(removeFromCartApi.pending, (state) => {
      state.cartStatus = "loading";
      state.cartError = null;
    });
    builder.addCase(removeFromCartApi.fulfilled, (state, action) => {
      state.cartStatus = "succeeded";
      state.lastCartResponse = action.payload;
    });
    builder.addCase(removeFromCartApi.rejected, (state, action) => {
      state.cartStatus = "failed";
      state.cartError = action.payload || action.error?.message;
    });

    // clearCartApi status
    builder.addCase(clearCartApi.pending, (state) => {
      state.cartStatus = "loading";
      state.cartError = null;
    });
    builder.addCase(clearCartApi.fulfilled, (state, action) => {
      state.cartStatus = "succeeded";
      state.lastCartResponse = action.payload;
    });
    builder.addCase(clearCartApi.rejected, (state, action) => {
      state.cartStatus = "failed";
      state.cartError = action.payload || action.error?.message;
    });
    // updateCart status
    builder.addCase(updateCart.pending, (state) => {
      state.cartStatus = "loading";
      state.cartError = null;
    });
    builder.addCase(updateCart.fulfilled, (state, action) => {
      state.cartStatus = "succeeded";
      state.lastCartResponse = action.payload;
    });
    builder.addCase(updateCart.rejected, (state, action) => {
      state.cartStatus = "failed";
      state.cartError = action.payload || action.error?.message;
    });
  },
});

export const {
  changeSearchItem,
  setStatus,
  changeSelectedCategory,
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = homeSlice.actions;

export const addToCartAndSync = (product) => (dispatch, getState) => {
  dispatch(addToCart(product));
  const items = getState().home.items.map((i) => ({
    productId: i.id?.toString?.() || i.id,
    quantity: i.quantity,
  }));
  dispatch(updateCart(items));
};

export const increaseQuantityAndSync = (productId) => (dispatch, getState) => {
  dispatch(increaseQuantity(productId));
  const items = getState().home.items.map((i) => ({
    productId: i.id?.toString?.() || i.id,
    quantity: i.quantity,
  }));
  dispatch(updateCart(items));
};

export const decreaseQuantityAndSync = (productId) => (dispatch, getState) => {
  const prevItem = getState().home.items.find((i) => i.id === productId);
  if (!prevItem) return;

  if (prevItem.quantity === 1) {
    dispatch(removeFromCartAndSync(productId));
    return;
  }

  dispatch(decreaseQuantity(productId));
  const items = getState().home.items.map((i) => ({
    productId: i.id?.toString?.() || i.id,
    quantity: i.quantity,
  }));
  dispatch(updateCart(items));
};

export const removeFromCartAndSync = (productId) => (dispatch, getState) => {
  dispatch(removeFromCart(productId));

  return dispatch(removeFromCartApi(productId));
};

export const clearCartAndSync = () => (dispatch, getState) => {
  dispatch(clearCart());

  dispatch(clearCartApi());
};

export const homeReducer = homeSlice.reducer;
