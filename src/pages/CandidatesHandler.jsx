import React, { useState, useEffect } from "react";
import { Button, TextField, Typography } from "@mui/material";
import { httpService } from "../httpService";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { colors } from "../util";

export default function CandidatesHandler() {
  const defaultData = { number: 0 };
  const [data, setData] = useState(defaultData);

  const [centres, setCentres] = useState([]);

  const createCentre = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Create candidates",
      text: "Do you wish to create this number of candidates?",
      cancelButtonColor: colors.primary,
      showCancelButton: true,
      cancelButtonText: "NO",
      confirmButtonColor: colors.secondary,
      confirmButtonText: "YES",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "createCandidate";

        const res = await httpService.post(path, data);
        if (res) {
          setData(defaultData);
          viewCandidates();
        }
      }
    });
  };

  const viewCandidates = async () => {
    const path = "viewCandidates";

    const res = await httpService(path);

    if (res) {
      setCentres(res.data);
    }
  };

  useEffect(() => {
    viewCandidates();
  }, []);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const columns = [
    { name: "Candidate", selector: (row) => row.name },
    { name: "Registration Number", selector: (row) => row.registrationNumber },
  ];
  return (
    <div>
      <div className="mt-3 mb-3">
        <div className="container">
          <div className="border p-3">
            <div className="row">
              <Typography fontWeight={600} variant="h5">
                NMCN Candidates
              </Typography>
              <div className="col-md-9 ">
                <DataTable data={centres} columns={columns} pagination />
              </div>
              <div className="col-md-3 border-start">
                <Typography fontWeight={600} gutterBottom>
                  Create Candidate
                </Typography>

                <form onSubmit={createCentre}>
                  <div className="div mb-3">
                    <TextField
                      label="Number"
                      name="number"
                      value={data.number}
                      onChange={handleChange}
                      type="number"
                    />
                  </div>
                  <Button variant="contained" type="submit">
                    Create Candidates
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
