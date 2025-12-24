import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { inventoryApi } from './api/inventoryApi';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    // Add the RTK Query API reducer
    [inventoryApi.reducerPath]: inventoryApi.reducer,
    // Add other reducers
    ui: uiReducer,
  },
  // Add the RTK Query middleware
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(inventoryApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Enable refetchOnFocus and refetchOnReconnect behaviors
setupListeners(store.dispatch);

export default store;
