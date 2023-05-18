import { Typography } from "@mui/material";
import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  //   componentDidCatch(error, errorInfo) {
  //     // You can also log the error to an error reporting service
  //     logErrorToMyService(error, errorInfo);
  //   }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="container mt-5 mb-5 text-center">
          <Typography
            variant="h4"
            fontWeight={600}
            color="GrayText"
            gutterBottom
          >
            This Page has errors
          </Typography>
          <Typography>Please contact the developer</Typography>
        </div>
      );
    }

    return this.props.children;
  }
}
