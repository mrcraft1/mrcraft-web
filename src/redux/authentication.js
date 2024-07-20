// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "isLoggedIn",
  initialState: {
    isLoggedIn: "",
  },
  reducers: {
    handleAuth: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { handleAuth } = profileSlice.actions;

export default profileSlice.reducer;
