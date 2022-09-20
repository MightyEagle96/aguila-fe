import React, { useState, useEffect } from "react";
import { Button, MenuItem, TextField, Typography } from "@mui/material";
import { httpService } from "../httpService";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { Spinner } from "react-bootstrap";
import { colors } from "../util";

export default function CandidatesHandler() {
  const defaultData = { number: 0, examType: "" };
  const [data, setData] = useState(defaultData);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [centres, setCentres] = useState([]);
  const [examTypes, setExamTypes] = useState([]);

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

  const deleteCandidates = async () => {
    const path = "deleteCandidates";

    const res = await httpService.delete(path);
    if (res) {
      viewCandidates();
      Swal.fire({ icon: "success", title: "SUCCESS", text: res.data });
    }
  };
  const viewExamTypes = async () => {
    const path = "viewExamTypes";
    const res = await httpService.get(path);

    if (res) {
      setExamTypes(res.data);
    }
  };
  const viewCandidates = async () => {
    setLoading(true);
    const path = "viewCandidates";

    const res = await httpService(path);

    if (res) {
      setCentres(res.data);
      setLoading(false);
    } else setLoading(false);
  };

  useEffect(() => {
    viewCandidates();
    viewExamTypes();
  }, []);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const columns = [
    {
      name: "Candidate",
      selector: (row) => (
        <Typography textTransform={"capitalize"}>{row.name}</Typography>
      ),
    },
    { name: "Registration Number", selector: (row) => row.registrationNumber },
    { name: "Exam Type", selector: (row) => row.examType.examType },
  ];
  return (
    <div>
      {!loading ? (
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
                    <div className="mt-3 mb-3">
                      <TextField
                        label="Number"
                        name="number"
                        fullWidth
                        onChange={handleChange}
                        type="number"
                      />
                    </div>
                    <div className="mt-3">
                      <TextField
                        select
                        label="Exam Type"
                        fullWidth
                        name="examType"
                        onChange={handleChange}
                      >
                        {examTypes.map((c, i) => (
                          <MenuItem key={i} value={c._id}>
                            {c.examType}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <Button variant="contained" type="submit" className="mt-3">
                      Create Candidates
                    </Button>
                  </form>
                  <div className="mt-3">
                    <Button color="error" onClick={deleteCandidates}>
                      delete candidates
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <Spinner animation="grow" />
        </div>
      )}
    </div>
  );
}
