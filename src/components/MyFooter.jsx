import { Typography } from "@mui/material";
import React from "react";
import "./MyFooter.css";

function MyFooter() {
  return (
    <div className="myFooter d-flex align-items-center">
      <div className="col-12">
        <Typography
          textAlign={"center"}
          fontWeight={600}
          color="GrayText"
          gutterBottom
        >
          AGUILA
        </Typography>
        <Typography
          textAlign={"center"}
          color="GrayText"
          gutterBottom
          variant="body2"
        >
          All rights reserved
          <i class="fas fa-copyright    ms-1"> {new Date().getFullYear()}</i>
        </Typography>
        <div className="ps-4">
          <Typography variant="caption" color="GrayText" gutterBottom>
            Powered by Mighty Eagle Tech
          </Typography>
        </div>
      </div>
    </div>
  );
}

export default MyFooter;
