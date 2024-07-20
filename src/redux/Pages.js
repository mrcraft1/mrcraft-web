// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const pageSlice = createSlice({
  name: "pages",
  initialState: {
    aboutUs: undefined,
    contact: undefined,
    terms: undefined,
    privacy: undefined,
    home: undefined,
    category: undefined,
    bookings: [],
  },
  reducers: {
    setAboutUs: (state, action) => {
      state.aboutUs = action.payload;
    },
    setContacts: (state, action) => {
      state.contact = action.payload;
    },
    setTermsAndConditions: (state, action) => {
      state.terms = action.payload;
    },
    setPrivacyPolicy: (state, action) => {
      state.privacy = action.payload;
    },
    setHomePage: (state, action) => {
      state.home = action.payload;
    },
    setCategory: (state, action) => {
      state.category = action.payload;
    },
    setBookings: (state, action) => {
      // console.log("init", state.bookings)
      state.bookings = action.payload;
      // const allData = action.payload
    },
    updateBookings: (state, action) => {
      const { mainID, serviceID, ratingUpdate, commentData, imagesData } = action.payload;
      const bookingIndex = state.bookings.findIndex((booking) => booking.id === mainID);
      if (bookingIndex !== -1) {
        const serviceIndex = state.bookings[bookingIndex].services.findIndex((service) => service.service_id === serviceID);
        if (serviceIndex !== -1) {
          state.bookings[bookingIndex].services[serviceIndex] = {
            ...state.bookings[bookingIndex].services[serviceIndex],
            rating: ratingUpdate,
            comment: commentData,
            images: imagesData,
            last_updated: new Date(),
          };
        }
      }
    },
  },
});

export const {
  setAboutUs,
  setContacts,
  setTermsAndConditions,
  setPrivacyPolicy,
  setHomePage,
  setCategory,
  setBookings,
  updateBookings,
} = pageSlice.actions;

export default pageSlice.reducer;
