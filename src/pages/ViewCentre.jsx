import React, { useEffect, useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { httpService } from "../httpService";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";

export default function ViewCentre() {
  const { id } = useParams();
  const [centre, setCentre] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState(0);

  const getCentre = async () => {
    const path = `viewCentre/${id}`;

    const res = await httpService(path);
    if (res) {
      console.log(res.data);
      setCentre(res.data);
      setCandidates(res.data.candidates);
    }
  };

  const getAnalysis = async () => {
    const path = "analysis";
    const res = await httpService(path);

    if (res) {
      setAnalysis(res.data);
    }
  };

  useEffect(() => {
    getCentre();
    getAnalysis();
  }, []);

  const assignToCentre = async () => {
    if (number > analysis.unAssigned) {
      return Swal.fire({
        icon: "error",
        title:
          "Value entered is greater than the number of unassigned candidates",
      });
    } else {
      const res = await httpService.post("assignToCentre", {
        centre: id,
        number,
      });

      if (res) {
        getCentre();
        getAnalysis();
      }
    }
  };
  const columns = [
    { name: "Name", selector: (row) => row.name },
    { name: "Registration Number", selector: (row) => row.registrationNumber },
  ];
  return (
    <div>
      <div className="mt-3 mb-3">
        <div className="container">
          {centre ? (
            <div className="border p-3 rounded">
              <div className="d-flex justify-content-between">
                <div>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    {centre.name}
                  </Typography>
                  <Typography variant="body1" fontWeight={300} gutterBottom>
                    {centre.centreId}
                  </Typography>
                </div>
                <div>
                  <TextField
                    className="mb-2"
                    label="Number"
                    type="number"
                    onChange={(e) => setNumber(e.target.value)}
                  />
                  <br />
                  <Button variant="outlined" onClick={assignToCentre}>
                    Assign candidates to this centre
                  </Button>
                  {analysis ? (
                    <>
                      <Stack direction="row" className="mt-2" spacing={2}>
                        <Typography>
                          Unassigned: {analysis.unAssigned}
                        </Typography>
                        <Typography>Assigned: {analysis.assigned}</Typography>
                      </Stack>
                      <Typography>Total: {analysis.total}</Typography>
                    </>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 col-md-6">
                <DataTable columns={columns} data={candidates} pagination />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
