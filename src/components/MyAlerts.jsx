import React from "react";
import { Alert } from "@mui/material";

function SuccessAlert({ message }) {
  return (
    <div className="mt-2">
      <Alert>{message}</Alert>
    </div>
  );
}

function ErrorAlert({ message }) {
  return (
    <div className="mt-2">
      <Alert severity="error">{message}</Alert>
    </div>
  );
}
export { SuccessAlert, ErrorAlert };
