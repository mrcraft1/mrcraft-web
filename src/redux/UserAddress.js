// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  address: [],
  updateAddress:[],
};

export const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    updateAddress: (state, action) => {
      if(action.payload){
        state.updateAddress = action.payload;
      }
    },
    resetAddressState: (state) => {
      return initialState;
    },
  },
});

export const { setAddress, updateAddress, resetAddressState } = addressSlice.actions;

export default addressSlice.reducer;
