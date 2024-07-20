// ** Redux Imports
import { createSlice } from "@reduxjs/toolkit";

export const profileSlice = createSlice({
  name: "user_data",
  initialState: {
    token: null,
    profile: null,
    web_fcm_token: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    updateData: (state, action) => {
      let { phone, username, loginType } = action.payload;
      state.profile.data.phone = phone;
      state.profile.data.username = username;
      state.profile.data.loginType = loginType;
    },
    updateToken: (state, action) => {
      state.web_fcm_token = action.payload;
    },
  },
});

export const { setProfile, updateToken, updateData, setToken } =
  profileSlice.actions;

export default profileSlice.reducer;
