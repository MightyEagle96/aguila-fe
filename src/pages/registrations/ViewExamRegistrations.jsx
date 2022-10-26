import {
  Button,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { httpService } from "../../httpService";
import { states } from "../../utils";

function ViewExamRegistrations() {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [limit, setLimit] = useState(0);
  const [statesWriting, setStatesWriting] = useState([]);

  const getData = async () => {
    const path = `registrations/${id}`;

    const res = await httpService.get(path);

    if (res) {
      setData(res.data);
    }
  };

  const getStatesWriting = async () => {
    const path = `statesWriting/${id}`;

    const res = await httpService.get(path);

    if (res) {
      setStatesWriting(res.data);
    }
  };

  useEffect(() => {
    getData();
    getStatesWriting();
  }, []);

  const createDummyCandidates = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Please confirm",
      text: "Do you wish to create dummy candidates for this examination?",
      showCancelButton: true,
    }).then(async () => {
      const path = "createMultipleCandidates";

      const res = await httpService.post(path, { limit, examination: id });

      if (res) {
        Swal.fire({ icon: "success", title: "SUCCESS", text: res.data });
        getData();
      }
    });
  };
  const expandableComponent = ({ data }) => {
    return (
      <div className="alert alert-success">
        <div className="row">
          <div className="col-md-4">
            <Typography variant="caption" gutterBottom>
              Subject Combinations
            </Typography>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {data.subjectCombinations.map((c, i) => (
                  <tr key={i}>
                    <td>{c.subject.name}</td>
                    <td>{c.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="col-md-4">
            <div className="mb-2">
              <Typography variant="caption" gutterBottom>
                Exam State
              </Typography>
              <Typography variant="h5">
                <strong>{data.examState}</strong>
              </Typography>
            </div>
            <div className="mb-2">
              <Typography variant="caption" gutterBottom>
                Exam Town
              </Typography>
              <Typography variant="h5">
                <strong>{data.examTown}</strong>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const columns = [
    {
      name: "First Name",
      selector: (row) => (
        <Typography variant="body1" textTransform={"capitalise"}>
          {row.firstName}
        </Typography>
      ),
    },
    {
      name: "Last Name",
      selector: (row) => (
        <Typography variant="body1" textTransform={"capitalise"}>
          {row.lastName}
        </Typography>
      ),
    },
    {
      name: "Registration Number",
      selector: (row) => (
        <Typography variant="body1" textTransform={"uppercase"}>
          {row.registrationNumber}
        </Typography>
      ),
    },
    {
      name: "Total Score",
      selector: (row) => (
        <Typography variant="body1" textTransform={"uppercase"}>
          {row.totalScore}
        </Typography>
      ),
    },
  ];

  const deleteAllRegistrations = () => {
    Swal.fire({
      icon: "question",
      title: "Please Confirm",
      text: "Do you want to delete all candidates? This cannot be reversed",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = `deleteCandidates/${id}`;

        const res = await httpService.delete(path);

        if (res) {
          getData();
          Swal.fire({ icon: "success", text: res.data });
        }
      }
    });
  };
  return (
    <div>
      <div className="">
        <div className="mb-5 mt-5">
          {data ? (
            <div>
              <div className="mb-4">
                <Typography variant="h4" fontWeight={600}>
                  {data.examination.title} Data dashboard
                </Typography>
              </div>
              <div className="mb-4">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="alert alert-primary">
                      States that will conduct this examination:{" "}
                      <strong style={{ fontSize: 25 }}>
                        {statesWriting.length}
                      </strong>
                    </div>
                  </div>
                  <div>
                    <div className="row">
                      <div className="col-md-6">
                        <form onSubmit={createDummyCandidates}>
                          <div>
                            <TextField
                              label="Limit"
                              type="number"
                              name="limit"
                              onChange={(e) => setLimit(e.target.value)}
                            />
                          </div>
                          <div className="">
                            <Button type="submit">
                              Create dummy Candidates
                            </Button>
                          </div>
                        </form>
                      </div>
                      <div className="col-md-6">
                        <Button
                          color="error"
                          variant="outlined"
                          onClick={deleteAllRegistrations}
                        >
                          Delete all registrations
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <TextField
                        fullWidth
                        label="View data by state"
                        select
                        onChange={(e) =>
                          window.location.assign(`/${id}/${e.target.value}`)
                        }
                      >
                        {statesWriting.map((c, i) => (
                          <MenuItem value={c.state} key={i}>
                            {c.state}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                </div>
              </div>
              <DataTable
                title={
                  <Typography textTransform={"uppercase"}>
                    Candidates' Data
                  </Typography>
                }
                data={data.registrations}
                columns={columns}
                expandableRows
                expandableRowsComponent={expandableComponent}
                pagination
              />
            </div>
          ) : (
            <Stack spacing={2}>
              <Skeleton variant="rectangular" height={60} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="rectangular" height={60} />
            </Stack>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewExamRegistrations;
