import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Cancel, Home, People, Refresh, Restore } from "@mui/icons-material";
import Swal from "sweetalert2";

import { httpService } from "../../httpService";
import { Table } from "react-bootstrap";
import { AlertContext } from "../../contexts/AlertContext";

export default function AllCentres() {
  const { setAlertData } = useContext(AlertContext);
  const [limit, setLimit] = useState(0);
  const [creating, setCreating] = useState(false);

  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);

  const createCentres = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: `Create ${limit.toLocaleString()} centres?`,
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCreating(true);
        const { data, error } = await httpService.post(
          `aguila/centres/create`,
          {
            limit,
          }
        );
        if (data) {
          setAlertData({ severity: "success", message: data, open: true });

          viewCentres();
        }
        if (error) {
          setAlertData({ severity: "error", message: error, open: true });
        }
        setCreating(false);
      }
    });
  };

  const viewCentres = async () => {
    setLoading(true);
    const { data } = await httpService("aguila/centres/all");

    if (data) {
      setCentres(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    viewCentres();
  }, []);
  return (
    <div className="mt-5 mb-5 p-3">
      <div className="alert alert-light col-lg-6">
        <Typography variant="h4" fontWeight={700}>
          CENTRES MANAGER
        </Typography>
      </div>
      {loading && <CircularProgress />}
      <div className="col-lg-2">
        <Typography gutterBottom>Create CBT centre</Typography>
        <form onSubmit={createCentres}>
          <TextField
            fullWidth
            type="number"
            onChange={(e) => setLimit(e.target.value)}
          />
          <div className="mt-2">
            <LoadingButton
              type="submit"
              variant="contained"
              endIcon={<Home />}
              loading={creating}
              loadingPosition="end"
            >
              create centres
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="row mt-3">
        <div className="col-lg-8">
          <Table bordered>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Centre Name</th>
                <th>Capacity</th>
                <th>Centre ID</th>
                <th>Password</th>
                <th>Sessions</th>
                <th>Candidates</th>
              </tr>
            </thead>
            <tbody>
              {centres.length > 0 ? (
                <>
                  {centres.map((c, i) => (
                    <tr key={i}>
                      <td className="col-lg-1">
                        <Typography>{i + 1}</Typography>
                      </td>
                      <td>
                        <Typography>{c.name}</Typography>
                      </td>
                      <td>
                        <Typography>{c.capacity}</Typography>
                      </td>
                      <td>
                        <Typography>{c.centreId}</Typography>
                      </td>
                      <td>
                        <Typography>{c.password}</Typography>
                      </td>
                      <td>
                        <Typography>{c.sessionLength}</Typography>
                      </td>
                      <td>
                        <Button href={`/centres/participants/${c._id}`}>
                          {c.candidates}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={12} className="mt-5 mb-5">
                    <Typography textAlign={"center"}>NO DATA FOUND</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <CandidateDistribution viewCentres={viewCentres} centres={centres} />
      </div>
    </div>
  );
}

function CandidateDistribution({ viewCentres, centres }) {
  //get examinations
  const { setAlertData } = useContext(AlertContext);
  const [examination, setExamination] = useState(null);
  const [distributing, setDistributing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [analysis, setAnalysis] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
  });
  const [selectedCentres, setSelectedCentres] = useState([]);
  const [assigning, setAssigning] = useState(false);

  const getActiveExam = async () => {
    const { data } = await httpService("aguila/examination/active");

    if (data) {
      setExamination(data);
      getAnalysis(data._id);
    }
  };

  async function getAnalysis(id) {
    const { data } = await httpService(`aguila/candidates/${id}/analysis`);

    if (data) {
      setAnalysis(data);
    }
  }

  function distributeCandidates() {
    Swal.fire({
      icon: "question",
      title: "Distribute Candidates?",
      text: "This will share the candidates among the available centres",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDistributing(true);
        const { data, error, status } = await httpService(
          `aguila/centres/distributecandidates/${examination._id}`
        );

        if (status === 202) {
          getAnalysis(examination._id);
          viewCentres();
          setAlertData({ message: data, severity: "info", open: true });
        }

        if (error) {
          setAlertData({ message: error, severity: "error", open: true });
        }
        setDistributing(false);
      }
    });
  }

  function resetDistribution() {
    Swal.fire({
      icon: "question",
      title: "Reset distribution?",
      text: "Are you sure you want to reset the distribution?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setResetting(true);
        const { data, error } = await httpService(
          `aguila/centres/resetdistribution/${examination._id}`
        );

        if (data) {
          getAnalysis(examination._id);
          viewCentres();
          setAlertData({ message: data, severity: "info", open: true });
        }
        if (error) {
          setAlertData({ message: error, severity: "error", open: true });
        }
        setResetting(false);
      }
    });
  }
  useEffect(() => {
    getActiveExam();
  }, []);

  const handleChange = (input) => {
    const existing = selectedCentres.findIndex(
      (c) => c._id === input.target.value._id
    );

    if (existing === -1) {
      setSelectedCentres([...selectedCentres, input.target.value]);
    }
  };

  const createCentresForExam = async () => {
    Swal.fire({
      icon: "question",
      title: "Use these centres?",
      text: "Are you sure you want to use these centres for this current examination?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setAssigning(true);
        const centres = selectedCentres.map((c) => c._id);

        const { data, error } = await httpService.post(
          "aguila/centres/createcentresforexam",
          { exam: examination._id, centres }
        );

        if (data) {
          setAlertData({ message: data, open: true, severity: "success" });
        }
        if (error) {
          setAlertData({ message: error, open: true, severity: "error" });
        }
        setAssigning(false);
      }
    });
  };
  return (
    <>
      {examination && (
        <div className="col-lg-4 ">
          <div
            className="p-4"
            style={{ backgroundColor: "#f5f5f5", color: "#3d7c98" }}
          >
            <Typography variant="caption" gutterBottom>
              Active Examination
            </Typography>
            <Typography
              variant="h4"
              fontWeight={600}
              textTransform={"uppercase"}
            >
              {examination.title}
            </Typography>
            <hr />
            <div className="mb-5">
              <div className="mb-4">
                <Typography gutterBottom>
                  Select centres for this examination
                </Typography>
              </div>
              <TextField
                select
                label="CBT Centres"
                fullWidth
                onChange={handleChange}
              >
                {centres.map((c, i) => (
                  <MenuItem key={i} value={c}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
              <div className="mt-2 d-flex flex-wrap mb-2">
                {selectedCentres.map((d, i) => (
                  <Chip
                    key={i}
                    label={d.name}
                    icon={<Cancel />}
                    className="me-1 mb-1"
                    clickable
                    color="primary"
                    onClick={() =>
                      setSelectedCentres(
                        selectedCentres.filter((e) => e._id !== d._id)
                      )
                    }
                  />
                ))}
              </div>
              <LoadingButton loading={assigning} onClick={createCentresForExam}>
                use these centres for this exam
              </LoadingButton>
            </div>
            <div className="mb-2">
              <Typography
                gutterBottom
                textTransform={"uppercase"}
                fontWeight={700}
              >
                Registered candidates analysis
              </Typography>
              <div className="mb-1">
                <Typography>
                  Total: <strong>{analysis.total}</strong>
                </Typography>
              </div>
              <div className="mb-1" style={{ color: "#c2528b" }}>
                <Typography>
                  Unassigned: <strong>{analysis.unassigned}</strong>
                </Typography>
              </div>
              <div className="mb-1" style={{ color: "#b0e1a2" }}>
                <Typography>
                  Assigned: <strong>{analysis.assigned}</strong>
                </Typography>
              </div>
              <div className="mt-2 d-flex justify-content-end">
                <IconButton
                  onClick={() => {
                    getAnalysis(examination._id);
                    viewCentres();
                  }}
                  color="success"
                >
                  <Refresh />
                </IconButton>
              </div>
              <hr />
              <div className="mb-1">
                <LoadingButton
                  endIcon={<People />}
                  loadingPosition="end"
                  loading={distributing}
                  onClick={distributeCandidates}
                  fullWidth
                >
                  distribute candidates
                </LoadingButton>
              </div>
              <div className="mb-1">
                <LoadingButton
                  endIcon={<Restore />}
                  loadingPosition="end"
                  loading={resetting}
                  onClick={resetDistribution}
                  fullWidth
                  color="error"
                >
                  reset distribution
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
