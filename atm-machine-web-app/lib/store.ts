import { configureStore } from "@reduxjs/toolkit";
import AppReducer from "./features/appSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      app: AppReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
