import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Helper function to load cart from localStorage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// Helper function to save cart to localStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

/**
 * Fetch cart items for a user or guest
 */
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ userId, guestId }, { rejectWithValue }) => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v2/cart`, {
      params: { userId, guestId },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch cart");
  }
});

/**
 * Add an item to the cart
 */
export const addToCart = createAsyncThunk("cart/addToCart", async (itemData, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v2/cart`, itemData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to add item to cart");
  }
});

/**
 * Update quantity of an item in the cart
 */
export const updateCartItemQuantity = createAsyncThunk("cart/updateCartItemQuantity", async (itemData, { rejectWithValue }) => {
  try {
    const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v2/cart`, itemData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to update item quantity");
  }
});

/**
 * Remove an item from the cart
 */
export const removeFromCart = createAsyncThunk("cart/removeFromCart", async (itemData, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/v2/cart`, { data: itemData });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to remove item from cart");
  }
});

/**
 * Merge guest cart into user cart
 */
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId, user }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v2/cart/merge`,
      { guestId, user },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to merge cart");
  }
});

/**
 * Redux Slice for Cart
 */
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
