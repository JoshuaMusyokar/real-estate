import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { baseApi } from "../services/baseApi";
import authReducer from "./slices/authSlice";
import toastReducer from "./slices/toastSlice";
import filterReducer from "./slices/filterSlice";
import { rtkQueryErrorLogger } from "../services/errorHandler";
import propertyFormReducer from "./slices/propertyFormSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer,
    filters: filterReducer,
    propertyForm: propertyFormReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }).concat(baseApi.middleware, rtkQueryErrorLogger),
  devTools: import.meta.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
