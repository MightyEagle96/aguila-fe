import { Person, Search, Tag } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Icon, Stack, TextField, Typography } from "@mui/material";
import React, { useContext, useState } from "react";
import { httpService } from "../../httpService";
import { AlertContext } from "../../contexts/AlertContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComputer,
  faHouse,
  faIdCard,
  faPen,
} from "@fortawesome/free-solid-svg-icons";

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
          Search Candidate
        </Typography>
        <div className="mt-3 col-lg-4 ">
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
        {candidate && (
          <div className="row mt-4" style={{ color: "#5b5e6b" }}>
            <div className="col-lg-4">
              <div className="mb-2">
                <Icon>
                  <Person />
                </Icon>
                <Typography variant="h6" textTransform={"capitalize"}>
                  {candidate.firstName} {candidate.lastName}
                </Typography>
              </div>
              <div className="mb-2">
                <Icon>
                  <FontAwesomeIcon icon={faIdCard} />
                </Icon>
                <Typography variant="h6" textTransform={"uppercase"}>
                  {candidate.registrationNumber}
                </Typography>
              </div>
              <div className="mb-2">
                <Stack direction={"row"} spacing={1}>
                  <div>
                    <Icon>
                      <FontAwesomeIcon icon={faComputer} />
                    </Icon>
                  </div>
                  <div className="d-flex align-items-center">
                    <Typography variant="caption">Examination</Typography>
                  </div>
                </Stack>
                <Typography variant="h6" textTransform={"uppercase"}>
                  {candidate.examination.title}
                </Typography>
              </div>
              <div className="mb-2">
                <Stack direction={"row"} spacing={1}>
                  <div>
                    <Icon>
                      <FontAwesomeIcon icon={faHouse} />
                    </Icon>
                  </div>
                  <div className="d-flex align-items-center">
                    <Typography variant="caption">Centre</Typography>
                  </div>
                </Stack>
                {candidate.centre ? (
                  <Typography variant="h6" textTransform={"uppercase"}>
                    {candidate.centre.name}
                  </Typography>
                ) : (
                  <Typography variant="h6" textTransform={"uppercase"}>
                    Not yet assigned
                  </Typography>
                )}
              </div>
            </div>
            <div className="col-lg-4">
              <Typography variant="caption">Subject Combinations</Typography>
              {candidate.subjectCombinations.map((c, i) => (
                <Typography gutterBottom key={i}>
                  {c.name}
                </Typography>
              ))}
            </div>
            <div className="col-lg-4"></div>
          </div>
        )}
      </div>
    </div>
  );
}
