// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const logginSlice = createSlice({
  name: "isForceClose",
  initialState: {
    isForceClose: false,
  },
  reducers: {
    handleForce: (state, action) => {
      state.isForceClose = action.payload;
    },
  },
});

export const { handleForce } = logginSlice.actions;

export default logginSlice.reducer;
