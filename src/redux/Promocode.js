// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

const promoData = localStorage.getItem("promocode") ;

export const promoSlice = createSlice({
  name: "promocode",
  initialState: {
    promocode: promoData !== undefined ? JSON.parse(promoData) : [],
  },
  reducers: {
    setPromoCode: (state, action) => {
      state.promocode = action.payload;
      localStorage.setItem("promocode", JSON.stringify(action.payload));
    },
  },
});

export const { setPromoCode } = promoSlice.actions;

export default promoSlice.reducer;
