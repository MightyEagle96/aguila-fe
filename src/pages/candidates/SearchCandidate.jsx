import { Search } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { httpService } from "../../httpService";
import { AlertContext } from "../../contexts/AlertContext";

export default function SearchCandidate() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertData } = useContext(AlertContext);
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const { data, error } = await httpService.post("aguila/candidates/search", {
      registrationNumber,
    });

    if (data) setCandidate(data);
    if (error) {
      setAlertData({ message: error, open: true, severity: "error" });
    }

    setLoading(false);
  };
  return (
    <div>
      <div className="mt-5">
        <Typography variant="h4" fontWeight={700}>
          Seach Candidate
        </Typography>
        <div className="mt-3 col-lg-4">
          <form onSubmit={handleSubmit}>
            <TextField
              label="Registration Number"
              fullWidth
              variant="standard"
              required
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
            <div className="mt-2">
              <LoadingButton
                variant="contained"
                endIcon={<Search />}
                loadingPosition="end"
                type="submit"
                loading={loading}
              >
                search
              </LoadingButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
