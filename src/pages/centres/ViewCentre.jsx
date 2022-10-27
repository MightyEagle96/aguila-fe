import React, { useEffect, useState } from "react";
import {
  Button,
  FormControlLabel,
  FormGroup,
  Stack,
  TextField,
  Typography,
  Checkbox,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";

import Swal from "sweetalert2";
import DataTable from "react-data-table-component";

export default function ViewCentre() {
  const { id } = useParams();
  const [centre, setCentre] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [availableCandidates, setAvailableCandidates] = useState([]);
  const [assignCandidates, setAssginCandidates] = useState([]);
  const [number, setNumber] = useState(0);

  const getCentre = async () => {
    const path = `viewCentre/${id}`;

    const res = await httpService(path);
    if (res) {
      setCentre(res.data);
    }
  };

  const getCandidatesAvailable = async () => {
    const path = `candidatesAvailable/${id}`;
    const res = await httpService(path);

    if (res) {
      setAvailableCandidates(res.data);
    }
  };

  useEffect(() => {
    getCentre();
    getCandidatesAvailable();
  }, []);

  const addCandidates = (value) => {
    setAssginCandidates((old) => [...old, value]);
  };

  const removeCandidates = (value) => {
    const filtered = assignCandidates.filter((c) => c !== value);
    setAssginCandidates(filtered);
  };

  const postCandidates = async () => {
    Swal.fire({
      icon: "question",
      title: "Please Confirm",
      text: `Do you wish to assign ${assignCandidates.length} ${
        assignCandidates.length > 1 ? "candidates" : "candidate"
      } to this centre?`,
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "postCandidates";

        const res = await httpService.post(path, {
          centre: id,
          candidates: assignCandidates,
        });

        if (res) {
          getCentre();
          getCandidatesAvailable();
          Swal.fire({ icon: "success", title: "SUCCESS", text: res.data });
        }
      }
    });
  };

  const columns = [
    { name: "First Name", selector: (row) => row.firstName },
    { name: "Last Name", selector: (row) => row.lastName },
    {
      name: "Registration Number",
      selector: (row) => (
        <Typography variant="body2" textTransform={"uppercase"}>
          {row.registrationNumber}
        </Typography>
      ),
    },
    { name: "Session", selector: (row) => row.session },
    { name: "Seat Number", selector: (row) => row.seatNumber },
  ];
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="">
          {centre ? (
            <div className="">
              <Stack direction="row" spacing={2}>
                <div className="col-md-4">
                  <div className="alert alert-info">
                    <Typography variant="h5" fontWeight={600} gutterBottom>
                      {centre.name}. ({centre.centreId})
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Town: <strong>{centre.examTown}</strong>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      State: <strong>{centre.examState}</strong>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Capacity: <strong>{centre.capacity}</strong>
                    </Typography>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="alert alert-danger">
                    <Typography>
                      Total Candidates assigned:{" "}
                      <strong>{centre.candidates.length}</strong>
                    </Typography>
                  </div>
                </div>
              </Stack>

              {availableCandidates.length > 0 ? (
                <div className="mt-5">
                  <Typography gutterBottom>
                    Candidates available for this exam town and exam state
                  </Typography>
                  <div className="mt-3">
                    <FormGroup>
                      {availableCandidates.map((c) => (
                        <FormControlLabel
                          value={c._id}
                          control={<Checkbox />}
                          onChange={(e) => {
                            if (e.target.checked) {
                              addCandidates(e.target.value);
                            } else removeCandidates(e.target.value);
                          }}
                          label={
                            <Typography textTransform={"uppercase"}>
                              {c.registrationNumber}
                            </Typography>
                          }
                        />
                      ))}
                    </FormGroup>
                    <Button onClick={postCandidates}>
                      Assign to this centre
                    </Button>
                  </div>
                </div>
              ) : null}

              {centre.candidates.length > 0 ? (
                <div className="mt-3">
                  <DataTable
                    title={<Typography>CANDIDATES</Typography>}
                    data={centre.candidates}
                    columns={columns}
                    pagination
                  />
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
