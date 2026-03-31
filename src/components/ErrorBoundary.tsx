import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type S = { err: Error | null };

export class ErrorBoundary extends Component<Props, S> {
  state: S = { err: null };

  static getDerivedStateFromError(err: Error): S {
    return { err };
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error(err, info);
  }

  render() {
    if (this.state.err) {
      return (
        <div className="fatal">
          <h1>Something snapped the lead.</h1>
          <p>{this.state.err.message}</p>
          <button type="button" className="pill-btn pill-btn--solid" onClick={() => location.reload()}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
