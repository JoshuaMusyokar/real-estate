import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { ToastContainer } from "./components/ui/alert/ToastContainer.tsx";
import { setupGlobalErrorHandlers } from "./utils/setupGlobalErrorHandlers.ts";
import { ErrorBoundary } from "./components/ErrorBoundary.tsx";

setupGlobalErrorHandlers();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <ErrorBoundary>
          <AppWrapper>
            <App />
          </AppWrapper>
        </ErrorBoundary>
      </ThemeProvider>
      <ToastContainer />
    </Provider>
  </StrictMode>,
);
