import { createSelector, createSlice } from '@reduxjs/toolkit'

// Define the initial state
const initialState = {
  data: null
}

export const themeSlice = createSlice({
  name: 'Theme',
  initialState,
  reducers: {
    themeSuccess: (theme, action) => {
      theme.data = action.payload
    },
  }
})

export const { themeSuccess } = themeSlice.actions
export default themeSlice.reducer

// selector
export const themesData = createSelector(
  state => state.Theme,
  Theme => Theme
)
