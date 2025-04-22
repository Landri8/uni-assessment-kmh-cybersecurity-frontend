import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter future={{ v7_stack: true }}>
        <Toaster
        toastOptions={{
            style: {
                backgroundColor: "white",
                color: "black",
                boxShadow: "2px 2px 4px #0000001d",
                borderRadius: "6px",
                border: "none",
                fontSize: "14px",
            },
        }}
        position="top-center"
        reverseOrder={false}
        />
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>
)
