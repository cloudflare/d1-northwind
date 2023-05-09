/**
 * By default, Remix will handle hydrating your app on the client for you.
 * You are free to delete this file if you'd like to, but if you ever want it revealed again, you can run `npx remix reveal` ✨
 * For more information, see https://remix.run/file-conventions/entry.client
 */

import { configureStore } from "@reduxjs/toolkit";
import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { clockReducer } from "./redux/clock";
import { statsReducer } from "./redux/stats";
import { Provider } from "react-redux";
const store = configureStore({
  reducer: {
    clock: clockReducer,
    stats: statsReducer,
  },
});
startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <Provider store={store}>
        <RemixBrowser />
      </Provider>
    </StrictMode>
  );
});
