import {
  Button,
  Checkbox,
  Pagination,
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

import { Table, Spinner } from "react-bootstrap";
import { ArrowCircleRight, ArrowCircleDown } from "@mui/icons-material";

function ViewExamRegistrations() {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [limit, setLimit] = useState(0);
  const [statesWriting, setStatesWriting] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [query, setQuery] = useState({ page: 1, limit: 100 });
  const [fetching, setFetching] = useState(false);
  const [candidateFile, setCandidateFile] = useState(null);

  const expandRow = (row) => {
    setExpandedRows((old) => [...old, row]);
  };

  const collapseRow = (row) => {
    const rows = expandedRows.filter((c) => c !== row);

    setExpandedRows(rows);
  };

  const paginationResult = async (e) => {
    const page = Number(e.target.textContent);
    setQuery({
      ...query,
      page,
    });
    setFetching(true);
    const path = `registrations/${id}?limit=${query.limit}&page=${page}`;
    const res = await httpService.get(path);
    if (res) {
      setData(res.data);
      setFetching(false);
    }
    setFetching(false);
  };
  const paginationResult2 = async (e) => {
    const limit = Number(e.target.value);
    setQuery({
      ...query,
      limit,
    });
    setFetching(true);
    const path = `registrations/${id}?limit=${limit}&page=${query.page}`;
    const res = await httpService.get(path);
    if (res) {
      setData(res.data);
      setFetching(false);
    }
    setFetching(false);
  };

  const getData = async () => {
    const path = `registrations/${id}?limit=${query.limit}&page=${query.page}`;

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

      if (res && res.data) {
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
          getStatesWriting();
          Swal.fire({ icon: "success", text: res.data });
        }
      }
    });
  };

  const createDummyCentres = () =>
    Swal.fire({
      icon: "question",
      title: "Confirm",
      text: "Do you wish to create dummy centres for this examination",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = `createDummyCentres/${id}`;

        const res = await httpService.post(path, { examination: id });

        if (res && res.data) {
          Swal.fire({ icon: "success", title: "SUCCESS", text: res.data }).then(
            () => {
              window.location.assign("/centres");
            }
          );
        }
      }
    });

  const handleFileUpload = async (e) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("candidateFile", candidateFile, candidateFile.name);
    const path = `uploadCandidateFile/${id}`;
    await httpService.post(path, formData);

    setTimeout(() => {
      setCandidateFile(null);
      getData();
      getStatesWriting();
    }, 3000);
  };
  return (
    <div>
      <div className="">
        <div className="mb-5 mt-5">
          {data ? (
            <div>
              <div className="mb-4">
                <Typography variant="h4" fontWeight={600}>
                  {data.examination.title}
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
                    <div className="mt-1">
                      <div className="">
                        <div class="mb-3">
                          <form
                            encType="multipart/form-data"
                            onSubmit={handleFileUpload}
                          >
                            <label for="formFile" className="form-label">
                              Upload candidate file
                            </label>
                            <input
                              className="form-control"
                              type="file"
                              id="candidateFile"
                              accept=".xlsx, .csv"
                              name="candidateFile"
                              onChange={(e) =>
                                setCandidateFile(e.target.files[0])
                              }
                            />
                            <Button
                              type="submit"
                              className="mt-2"
                              startIcon={<i class="fas fa-file-excel    "></i>}
                            >
                              upload file
                            </Button>
                          </form>
                        </div>
                      </div>
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
                      <Typography variant="subtitle2">S/N</Typography>
                    </th>

                    <th>
                      <Typography variant="subtitle2">FIRST NAME</Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2">LAST NAME</Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2">
                        REGISTRATION NUMBER
                      </Typography>
                    </th>
                    <th>
                      <Typography variant="subtitle2">TOTAL SCORE</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.registrations.map((c, i) => (
                    <>
                      <tr
                        key={i}
                        className={
                          expandedRows.includes(i.toString())
                            ? "table-success"
                            : ""
                        }
                      >
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
                        <td className="align-middle">{data.startIndex + i}</td>
                        <td className="align-middle">{c.firstName}</td>
                        <td className="align-middle">{c.lastName}</td>
                        <td className="align-middle">
                          <Typography textTransform={"uppercase"}>
                            {c.registrationNumber}
                          </Typography>
                        </td>
                        <td className="align-middle">{c.totalScore}</td>
                      </tr>
                      {expandedRows.includes(i.toString()) ? (
                        <tr>
                          <td colSpan={6}>
                            <ExpandableComponent data={c} />
                          </td>
                        </tr>
                      ) : null}
                    </>
                  ))}
                </tbody>
              </Table>
              <div className="mt-2">
                <div className="d-flex justify-content-end">
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <div className="d-flex align-items-center">
                      {fetching ? (
                        <Spinner size="sm" animation="border" />
                      ) : null}
                    </div>
                    <div className="d-flex align-items-center">
                      <Typography variant="caption">Rows per page</Typography>
                      <TextField
                        value={query.limit}
                        select
                        variant="standard"
                        className="ms-2"
                        onChange={paginationResult2}
                      >
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={200}>200</MenuItem>
                        <MenuItem value={300}>300</MenuItem>
                        <MenuItem value={500}>500</MenuItem>
                      </TextField>
                    </div>

                    <div className="d-flex align-items-center">
                      <Typography variant="caption">
                        Page: {query.page}
                      </Typography>
                    </div>

                    <Pagination
                      count={Math.ceil(data.length / query.limit)}
                      onClick={paginationResult}
                      showFirstButton
                      showLastButton
                    />
                  </Stack>
                </div>
              </div>
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
