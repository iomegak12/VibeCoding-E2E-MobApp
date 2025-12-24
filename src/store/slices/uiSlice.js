import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  isLoading: false,
  error: null,
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
  },
});

export const {
  toggleTheme,
  setDarkMode,
  setLoading,
  setError,
  clearError,
  setNotification,
  clearNotification,
} = uiSlice.actions;

export default uiSlice.reducer;
