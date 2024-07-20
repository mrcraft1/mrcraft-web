// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  qty: null,
  at_door: 0,
  at_store: 0,
  base_cart: [],
  subAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateCartItems: (state, action) => {
      state.cartItems = action.payload;
    },
    updateQty: (state, action) => {
      state.qty = action.payload;
    },
    updateDoor: (state, action) => {
      state.at_door = action.payload;
    },
    updateStore: (state, action) => {
      state.at_store = action.payload;
    },
    updateBaseCart: (state, action) => {
      state.base_cart = action.payload;
    },
    updatesubAmount: (state, action) => {
      state.subAmount = action.payload;
    },
    resetState: (state) => {
      return initialState;
    }
  },
});

export const {
  updateCartItems,
  updateQty,
  updateDoor,
  updateStore,
  updateBaseCart,
  updatesubAmount,
  resetState,
} = cartSlice.actions;

export default cartSlice.reducer;
