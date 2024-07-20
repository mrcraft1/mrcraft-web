// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const availableSlice = createSlice({
  name: "providerAvailable",
  initialState: {
    providerAvailable: false,
  },
  reducers: {
    setProviderAvailable: (state, action) => {
      state.providerAvailable = action.payload;
    },
  },
});

export const { setProviderAvailable } = availableSlice.actions;

export default availableSlice.reducer;
