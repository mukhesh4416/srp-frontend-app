import { configureStore } from '@reduxjs/toolkit';
import srpReducer from './Slices/srpSlice'

export const store = configureStore({
  reducer: {
    srp: srpReducer
  },
});

