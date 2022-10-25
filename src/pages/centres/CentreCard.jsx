import { People } from "@mui/icons-material";
import { Avatar, Icon, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { httpService } from "../../httpService";

export default function CentreCard({ data }) {
  const [length, setLength] = useState(0);

  const getCandidates = async () => {
    const path = `viewExamCandidates/${data._id}`;

    const res = await httpService(path);

    if (res) {
      setLength(res.data);
    }
  };
  useEffect(() => {
    getCandidates();
  }, []);

  return (
    <div className="col-md-3">
      <div className="p-2 border rounded me-1 mb-1">
        <Typography fontWeight={600} gutterBottom>
          {data.title}
        </Typography>
        <div className="d-flex justify-content-between">
          <Icon sx={{ color: "#00a152" }}>
            <People />
          </Icon>
          <Avatar sx={{ backgroundColor: "#ab003c" }}>{length || 0}</Avatar>
        </div>
      </div>
    </div>
  );
}
