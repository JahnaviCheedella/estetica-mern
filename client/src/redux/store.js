import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { homeReducer } from "./slices/homeSlice";
import { headerReducer } from "./slices/headerSlice";
import billingReducer from "./slices/billingSlice";
import { authReducer } from "./slices/authSlice";

const rootReducer = combineReducers({
  home: homeReducer,
  header: headerReducer,
  billing: billingReducer,
  auth: authReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});
