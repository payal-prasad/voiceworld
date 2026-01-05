import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

console.log("Index.jsx loaded");
console.log("Root element:", document.getElementById("root"));

const root = ReactDOM.createRoot(document.getElementById("root"));
console.log("Root created:", root);

root.render(
  <>
    <ToastContainer
      toastClassName={(context) =>
        `${context?.defaultClassName} relative flex py-4 px-3 rounded overflow-hidden cursor-pointer bg-white shadow-lg`
      }
      bodyClassName={(context) =>
        `${context?.defaultClassName} text-[#000] text-base font-bold`
      }
      position="bottom-left"
      autoClose={4000}
      hideProgressBar={true}
      newestOnTop={false}
      closeButton={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
    <App />
  </>
);
