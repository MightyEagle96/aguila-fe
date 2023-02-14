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
        <div className="container mt-5 mb-5">
          <div className="row">
            <div className="col-md-6">
              <img
                alt="broken page"
                className="img-fluid"
                src="https://images.unsplash.com/photo-1509078932415-355dbe95f1ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
              />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <Typography variant="h4" fontWeight={600} color="GrayText">
                This Page has errors
              </Typography>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
