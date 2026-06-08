import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  /** Rendered instead of the children if they throw. Defaults to nothing. */
  fallback?: ReactNode;
}

/**
 * Catches render errors in a subtree so an isolated failure (e.g. WebGL not
 * available for the hero particle field) degrades gracefully instead of
 * blanking the whole page.
 */
export class ErrorBoundary extends Component<Props, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? null;
    return this.props.children;
  }
}
