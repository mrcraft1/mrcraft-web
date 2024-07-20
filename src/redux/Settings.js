// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'


export const authSlice = createSlice({
  name: 'settings',
  initialState: {
    settings: []
  },
  reducers: {
    setSettings: (state, action) => {
      state.settings = action.payload
    }
  }
})

export const { setSettings } = authSlice.actions

export default authSlice.reducer