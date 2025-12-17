import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { setupInterceptors } from "./api/api";
import { tryRefresh } from "./store/authSlice";
import "./styles.css";

setupInterceptors(store);
store.dispatch(tryRefresh()).catch(() => {});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
