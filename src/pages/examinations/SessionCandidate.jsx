import React, { useState, useEffect } from "react";
import { httpService } from "../../httpService";
import { CardActionArea, Icon, Typography } from "@mui/material";
import { People } from "@mui/icons-material";
export default function SessionCandidate({ examination, session }) {
  const [candidates, setCandidates] = useState([]);
  const getCandidates = async () => {
    const path = "getSessionCandidates";
    const res = await httpService.post(path, { examination, session });

    if (res && res.data) {
      setCandidates(res.data);
    }
  };
  useEffect(() => {
    getCandidates();
  }, []);
  return (
    <div>
      <div className="me-2 mb-2">
        <CardActionArea sx={{ backgroundColor: "#eeeeee" }}>
          <div className="p-3">
            <Typography fontWeight={600} gutterBottom>
              {session}
            </Typography>
            <div className="d-flex justify-content-between">
              <Icon sx={{ color: "GrayText" }}>
                <People />
              </Icon>
              <Typography>{candidates.length.toLocaleString() || 0}</Typography>
            </div>
          </div>
        </CardActionArea>
      </div>
    </div>
  );
}
