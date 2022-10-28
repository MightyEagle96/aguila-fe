import { House } from "@mui/icons-material";
import { CardActionArea, Icon, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { httpService } from "../../httpService";

function CentresAndSessions({ session }) {
  const [centres, setCentres] = useState(0);
  const getCentresAndSessions = async () => {
    const path = "getCentresAndSessions";

    const res = await httpService.post(path, { session });

    if (res) {
      setCentres(res.data);
    }
  };

  useEffect(() => {
    getCentresAndSessions();
  }, []);
  return (
    <div>
      <div className="me-2 mb-2">
        <CardActionArea sx={{ backgroundColor: "#c5cae9" }}>
          <div className="p-3">
            <Typography fontWeight={600} gutterBottom>
              {session}
            </Typography>
            <div className="d-flex justify-content-between">
              <Icon>
                <House />
              </Icon>
              <Typography>{centres}</Typography>
            </div>
          </div>
        </CardActionArea>
      </div>
    </div>
  );
}

export default CentresAndSessions;
