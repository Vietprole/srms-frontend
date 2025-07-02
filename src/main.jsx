// import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./routes/Routes";
import "./index.css";
// import { Toaster } from "@/components/ui/toaster"
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <>
    {/* theme="light" toastOptions={{}} is a workaround */}
    <Toaster richColors theme="light" toastOptions={{}} />
    <RouterProvider router={router} />
  </>
  // </StrictMode>
);
