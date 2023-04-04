import React from "react";

import events from "utils/events";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error: error };
  }

  isLocalhost() {
    return (
      window.location.hostname == "localhost" ||
      window.location.hostname == "127.0.0.1"
    );
  }

  componentDidCatch(error, errorInfo) {
    if (this.isLocalhost()) return;
    events.track("Component error", {
      error: error,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.error) {
      return <></>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
