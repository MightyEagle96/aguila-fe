import { Typography } from "@mui/material";
import React from "react";
import "./MyFooter.css";

function MyFooter() {
  return (
    <div className="myFooter d-flex align-items-center">
      <div className="col-12">
        <Typography textAlign={"center"} fontWeight={600} gutterBottom>
          NIMC
        </Typography>
        <Typography textAlign={"center"} gutterBottom>
          All rights reserved{" "}
          <i class="fas fa-copyright    "> {new Date().getFullYear()}</i>
        </Typography>
      </div>
    </div>
  );
}

export default MyFooter;
