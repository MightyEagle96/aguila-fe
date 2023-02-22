import {
  Button,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { LoadingButton } from "@mui/lab";

import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Spinner } from "react-bootstrap";
import { People, PersonRemove } from "@mui/icons-material";

import { httpService } from "../../httpService";

function ViewExamRegistrations() {
  const [data, setData] = useState(null);
  const { id } = useParams();
  const [limit, setLimit] = useState(0);
  const [statesWriting, setStatesWriting] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [candidateFile, setCandidateFile] = useState(null);

  const getData = async () => {
    const path = `registrations/${id}`;

    const res = await httpService.get(path);

    if (res) {
      setData(res.data);
    }
  };

  const getStatesWriting = async () => {
    setFetching(true);
    const path = `statesWriting/${id}`;

    const res = await httpService.get(path);

    if (res) {
      setStatesWriting(res.data);
    }
    setFetching(false);
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

  const deleteAllRegistrations = () => {
    Swal.fire({
      icon: "question",
      title: "Please Confirm",
      text: "Do you want to delete all candidates? This cannot be reversed",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        const path = `deleteCandidates/${id}`;

        const res = await httpService.delete(path);

        if (res) {
          getData();
          getStatesWriting();
          Swal.fire({ icon: "success", text: res.data });
        }
        setDeleting(false);
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
                <Typography variant="subtitle2" color="GrayText">
                  Exam
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {data.examination.title}
                </Typography>
              </div>
              <div className="row">
                <div className="col-lg-3">
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
                        onChange={(e) => setCandidateFile(e.target.files[0])}
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
                <div className="col-lg-3 border-start">
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
                      <Button type="submit">Create dummy Candidates</Button>
                    </div>
                    <div>
                      <LoadingButton
                        color="error"
                        endIcon={<PersonRemove />}
                        loadingPosition="end"
                        loading={deleting}
                        onClick={deleteAllRegistrations}
                      >
                        <span>delete candidates</span>
                      </LoadingButton>
                    </div>
                  </form>
                </div>
                <div className="col-lg-3 border-end border-start">
                  <Typography>
                    States that will be participating in this exam
                  </Typography>

                  {fetching ? (
                    <Spinner animation="border" />
                  ) : (
                    <Typography variant="h4">{statesWriting.length}</Typography>
                  )}
                  <div>
                    <Button onClick={createDummyCentres}>
                      Create dummy centres
                    </Button>
                  </div>
                </div>
                <div className="col-lg-3">
                  <Typography variant="subtitle2">States</Typography>
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

              <div
                className="col-lg-3 p-4 mt-5 rounded text-white"
                style={{ backgroundColor: "#1a237e" }}
              >
                <Typography>Registered Candidates</Typography>
                <div className="mt-3">
                  <Stack direction={"row"} spacing={2}>
                    <People sx={{ height: 50, width: 50 }} />
                    <Typography variant="h3">
                      {data.registrations.toLocaleString()}
                    </Typography>
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
