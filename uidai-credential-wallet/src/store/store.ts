import { configureStore } from "@reduxjs/toolkit";
import credentialReducer from "./credentialSlice";

export const store = configureStore({
  reducer: {
    credentials: credentialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;