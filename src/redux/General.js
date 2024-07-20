// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const generalSlice = createSlice({
  name: "general",
  initialState: {
    settings: {},
  },
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
  },
});

export const { setSettings } = generalSlice.actions;

export default generalSlice.reducer;
