import { configureStore } from '@reduxjs/toolkit';
import recipeReducer from "../Features/Slice/recipeSlice.js";

export const store = configureStore({
  reducer: {
    recipeFormulator: recipeReducer,
    // You can easily add your userManagement or future reducers here later
  },
});