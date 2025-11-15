"use client";

import { Provider } from "react-redux";
import { ReactNode, useMemo } from "react";
import { makeStore, AppStore } from "@/lib/store";

export default function StoreProvider({ children }: { children: ReactNode }) {
  const store = useMemo<AppStore>(() => makeStore(), []);

  return <Provider store={store}>{children}</Provider>;
}
