import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import productReducer from "../redux/slices/productsSlice";
import cartReducer from "../redux/slices/cartSlice.js";
import checkoutReducer from "../redux/slices/checkoutSlice.js";
import orderReducer from "../redux/slices/orderSlice.js";
import adminReducer from "../redux/slices/adminSlice.js";
import adminProductReducer from "../redux/slices/adminProductSlice.js";
import adminOrderReducer from "../redux/slices/adminOrderSlice.js"

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,
    adminProducts: adminProductReducer,
    adminOrders: adminOrderReducer,
  },
});

export default store;
