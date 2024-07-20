import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderDetails: {
    orderNote: "",
    selectedAddress: "",
    slot: "",
    date: "",
  },
};

export const cartDetailSlice = createSlice({
  name: "orderCartDetails",
  initialState,
  reducers: {
    cartDetails: (state, action) => {
      const { orderNote, selectedAddress } = action.payload;
      // Update orderNote conditionally
        state.orderDetails.orderNote = orderNote;
        state.orderDetails.selectedAddress = selectedAddress;
    },
    slotDetails: (state, action) => {
      state.orderDetails.slot = action.payload;
    },
    dateDetails: (state, action) => {
      state.orderDetails.date = action.payload;
    },
    orderCartDetailsReset: (state) => {
      state.orderDetails = initialState.orderDetails;
    },
  },
});

export const { cartDetails, slotDetails, dateDetails, orderCartDetailsReset } =
  cartDetailSlice.actions;

export default cartDetailSlice.reducer;
