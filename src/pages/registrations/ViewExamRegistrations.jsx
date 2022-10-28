import {
  Button,
  Checkbox,
  IconButton,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import CandidateDashboardExpandable from "../../components/CandidateDashboardExpandable";
import { httpService } from "../../httpService";
import { states } from "../../utils";
import { Table } from "react-bootstrap";
import { ArrowCircleRight, ArrowCircleDown } from "@mui/icons-material";

function ViewExamRegistrations() {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [limit, setLimit] = useState(0);
  const [statesWriting, setStatesWriting] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);

  const expandRow = (row) => {
    setExpandedRows((old) => [...old, row]);
  };

  const collapseRow = (row) => {
    const rows = expandedRows.filter((c) => c !== row);

    setExpandedRows(rows);
  };

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
        getStatesWriting();
      }
    });
  };
  const ExpandableComponent = ({ data }) => {
    return <CandidateDashboardExpandable data={data} />;
  };

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

  const createDummyCentres = () =>
    Swal.fire({
      icon: "question",
      title: "Confirm",
      text: "Do you wish to create dummy examinations",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = `createDummyCentres/${id}`;

        const res = await httpService.get(path);

        if (res && res.data) {
          Swal.fire({ icon: "success", title: "SUCCESS", text: res.data }).then(
            () => {
              window.location.assign("/centres");
            }
          );
        }
      }
    });
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
                      <div>
                        States that will conduct this examination:{"   "}
                        <strong style={{ fontSize: 25 }}>
                          {statesWriting.length}
                        </strong>
                      </div>
                      {statesWriting.length > 0 ? (
                        <div className="mt-2">
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={createDummyCentres}
                          >
                            Create dummy CBT Centres
                          </Button>
                        </div>
                      ) : null}
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

              <Table>
                <thead>
                  <tr>
                    <th>
                      <Typography></Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2">First Name</Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2">Last Name</Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2">
                        Registration Number
                      </Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2">Total Score</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.registrations.map((c, i) => (
                    <>
                      <tr key={i}>
                        <td>
                          <Checkbox
                            value={i.toString()}
                            onChange={(e) => {
                              if (e.target.checked) expandRow(e.target.value);
                              else collapseRow(e.target.value);
                            }}
                            icon={<ArrowCircleRight />}
                            checkedIcon={<ArrowCircleDown />}
                            sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
                          />
                        </td>
                        <td>{c.firstName}</td>
                        <td>{c.lastName}</td>
                        <td>
                          <Typography textTransform={"uppercase"}>
                            {c.registrationNumber}
                          </Typography>
                        </td>
                        <td>{c.totalScore}</td>
                      </tr>
                      {expandedRows.includes(i.toString()) ? (
                        <tr>
                          <td colSpan={5}>
                            <ExpandableComponent data={c} />
                          </td>
                        </tr>
                      ) : null}
                    </>
                  ))}
                </tbody>
              </Table>
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
