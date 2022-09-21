import React, { useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { httpService } from "../httpService";
import { Spinner } from "react-bootstrap";

function ResultsPage() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const checkResult = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const path = "checkResult";
      const res = await httpService.post(path, { registrationNumber });

      if (res) {
        setResult(res.data);
        setLoading(false);
      }
      setLoading(false);
    } catch (error) {}
  };
  return (
    <div>
      <div className="mt-3 container">
        <div className="p-3 shadow">
          <Typography variant="h4">Check your result</Typography>
          <div className="col-md-4 mt-3">
            <form onSubmit={checkResult}>
              <TextField
                label="Registration Number"
                fullWidth
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
              />
              <div className="mt-2">
                <Button type="submit">
                  {loading ? <Spinner animation="grow" /> : "check result"}
                </Button>
              </div>
            </form>
          </div>
          {result ? (
            <div className="border p-3">
              <Typography variant="h5">Result</Typography>

              <div className="mt-2">
                <Typography textTransform={"capitalize"}>
                  Candidate: {result.name}
                </Typography>
              </div>
              <div className="mt-2">
                <Typography>
                  Registration Number: {result.registrationNumber}
                </Typography>
              </div>
              <div className="mt-2">
                <Typography>
                  Examination Type: {result.examType.examType}
                </Typography>
              </div>
              <div className="mt-2">
                <Typography>Score: {result.score}</Typography>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
