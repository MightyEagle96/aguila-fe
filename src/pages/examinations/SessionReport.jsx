import React, { useState, useEffect } from "react";
import { TextField, Typography, MenuItem, Stack } from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { httpService } from "../../httpService";
import { sessionsList } from "./route";
import { LoadingButton } from "@mui/lab";

export default function SessionReport() {
  const [examinations, setExaminations] = useState([]);
  const [searchData, setSearchData] = useState({});
  const getExaminations = async () => {
    const { data } = await httpService.get("aguila/examination/all");
    if (data) setExaminations(data);
  };

  useEffect(() => {
    getExaminations();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="col-lg-3">
          <Typography variant="h4" sx={{ color: "#4b4b4b" }} fontWeight={600}>
            SESSION REPORT
          </Typography>
        </div>
        <div className="mt-3">
          <div className="row">
            <div className="col-lg-3">
              <TextField label="Select Exam" select fullWidth>
                {examinations.map((c) => (
                  <MenuItem value={c._id}>
                    <Typography textTransform={"uppercase"}>
                      {c.title}
                    </Typography>
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className="col-lg-3">
              <Stack direction="row" spacing={1}>
                <div className="d-flex align-items-center">
                  <Typography variant="caption">select date</Typography>
                </div>
                <DatePicker
                  onChange={(e) => console.log(new Date(e.$d).toDateString())}
                />
              </Stack>
            </div>
            <div className="col-lg-3">
              <TextField select label="Session List" fullWidth>
                {sessionsList().map((c) => (
                  <MenuItem value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </div>
            <div className="col-lg-2">
              <LoadingButton variant="contained">find report</LoadingButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
