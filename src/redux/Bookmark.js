// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookmark: [],
};

export const bookSlice = createSlice({
  name: "bookmark",
  initialState,
  reducers: {
    setBookmark: (state, action) => {
      return { ...state, bookmark: action.payload };
    },
    removeBookmark: (state, action) => {
      // Filter out the bookmark item to be removed
      state.bookmark = state.bookmark.filter(
        (bookmark) => bookmark.partner_id !== action.payload.partner_id
      );
    },
    updateBookmark: (state, action) => {
      return { ...state, bookmark: action.payload };
    },
    resetbookmarkState: (state) => {
      return initialState;
    },
  },
});

export const { setBookmark, removeBookmark, updateBookmark, resetbookmarkState } =
  bookSlice.actions;

export default bookSlice.reducer;
