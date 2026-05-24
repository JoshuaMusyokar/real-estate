import { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "../utils/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("ErrorBoundary caught an error", {
      error: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          style={{
            padding: "2rem",
            fontFamily: "monospace",
            background: "#fff0f0",
            border: "1px solid #f44",
            borderRadius: 8,
            margin: "2rem auto",
            maxWidth: 600,
          }}
        >
          <h2 style={{ color: "#c00" }}>Something went wrong</h2>
          <p style={{ color: "#555" }}>
            Check the browser console for details.
          </p>
          {/* Only show details in dev */}
          {import.meta.env.MODE === "development" && (
            <pre
              style={{ fontSize: 12, whiteSpace: "pre-wrap", color: "#333" }}
            >
              {this.state.error?.stack}
            </pre>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
