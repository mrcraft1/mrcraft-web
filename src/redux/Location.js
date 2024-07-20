// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    lat: null,
    lng: null,
    locationAddress: null,
    modalOpen: false,
  },
  reducers: {
    setLatitude: (state, action) => {
      state.lat = action.payload;
    },
    setLongitude: (state, action) => {
      state.lng = action.payload;
    },
    locationAddressData: (state, action) => {
      state.locationAddress = action.payload;
    },
    setModalOpen: (state, action) => {
      state.modalOpen = action.payload;
    },
    setModalClose: (state, action) => {
      state.modalOpen = action.payload;
    },
  },
});

export const { setLatitude, setLongitude, locationAddressData, setModalOpen, setModalClose } =
  locationSlice.actions;

export default locationSlice.reducer;
