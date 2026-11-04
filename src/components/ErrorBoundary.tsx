import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div
            role="alert"
            className="flex flex-col items-center justify-center p-8 text-center gap-3"
          >
            <p className="text-sm text-muted-foreground">Something went wrong loading this section.</p>
            <p className="text-xs text-muted-foreground/60 font-mono">{this.state.message}</p>
            <button
              onClick={() => this.setState({ hasError: false, message: "" })}
              className="text-xs text-accent underline underline-offset-2 hover:opacity-80 motion-safe-transition"
            >
              Try again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
