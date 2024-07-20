import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  delivery: [],
  deliveryType: "Home",
};

export const deliverySlice = createSlice({
  name: "delivery",
  initialState,
  reducers: {
    setDeliveryAddress: (state, action) => {
      state.delivery = action.payload;
    },
    setDeliveryAddressType: (state, action) => {
      state.deliveryType = action.payload;
    },
    deliveryAddressReset: (state) => {
      state.delivery = initialState.delivery;
      state.deliveryType = initialState.deliveryType;
    },
  },
});

export const { setDeliveryAddress, setDeliveryAddressType, deliveryAddressReset } = deliverySlice.actions;

export default deliverySlice.reducer;
