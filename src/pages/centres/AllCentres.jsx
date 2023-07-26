import React, { useState, useEffect, useContext } from "react";
import {
  Chip,
  CircularProgress,
  IconButton,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Cancel, Delete, People, Refresh, Restore } from "@mui/icons-material";
import Swal from "sweetalert2";

import { httpService } from "../../httpService";
import { Table } from "react-bootstrap";
import { AlertContext } from "../../contexts/AlertContext";

export default function AllCentres() {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeExam, setActiveExam] = useState(null);

  const viewCentres = async () => {
    setLoading(true);
    const { data } = await httpService("aguila/centres/all");

    if (data) {
      setCentres(data);
    }
    setLoading(false);
  };
  const getActiveExam = async () => {
    const { data } = await httpService("aguila/examination/active");

    if (data) {
      setActiveExam(data);
    }
  };

  useEffect(() => {
    viewCentres();
    getActiveExam();
  }, []);
  return (
    <div className="mt-5 mb-5 p-3">
      <div className="alert alert-light col-lg-6">
        <Typography variant="h4" fontWeight={700} gutterBottom>
          CENTRES MANAGER
        </Typography>
        <Link href="/centres/all">view all centres</Link>
      </div>
      {loading && <CircularProgress />}

      <div>
        {activeExam && (
          <CandidateDistribution
            viewCentres={viewCentres}
            centres={centres}
            examination={activeExam.examination}
          />
        )}
      </div>
    </div>
  );
}

function CandidateDistribution({ viewCentres, centres, examination }) {
  //get examinations
  const { setAlertData } = useContext(AlertContext);

  const [distributing, setDistributing] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [analysis, setAnalysis] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
  });
  const [selectedCentres, setSelectedCentres] = useState([]);
  const [assigning, setAssigning] = useState(false);
  const [examCentres, setExamCentres] = useState([]);

  const getActiveExam = async () => {
    const { data } = await httpService("aguila/examination/active");

    if (data) {
      getAnalysis(data.examination._id);
    }
  };
  const getExamCentres = async () => {
    const { data } = await httpService(
      `aguila/centres/centresforexam/${examination._id}`
    );
    if (data) {
      setExamCentres(data);
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
          getExamCentres();
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
    getExamCentres();
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
          getExamCentres();
          setSelectedCentres([]);
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
        <>
          <div className="" style={{ color: "#3d7c98" }}>
            <div className="row">
              <div className="col-lg-4 border-end">
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
                        {c.centreId}
                      </MenuItem>
                    ))}
                  </TextField>
                  <div className="mt-2 d-flex flex-wrap mb-2">
                    {selectedCentres.map((d, i) => (
                      <Chip
                        key={i}
                        label={`centre ${d.centreId}`}
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
                  <LoadingButton
                    loading={assigning}
                    onClick={createCentresForExam}
                  >
                    use these centres for this exam
                  </LoadingButton>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="">
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
                        getExamCentres();
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
          </div>
          <div>
            <Typography gutterBottom fontWeight={700}>
              Centres for this examination
            </Typography>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Centre ID</th>
                  <th>Name</th>
                  <th>Password</th>
                  <th>Candidates</th>
                  <th>Session Length</th>
                  <th>Capacity</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {examCentres.map((c) => (
                  <tr>
                    <td>
                      <Typography>{c.centreId}</Typography>
                    </td>
                    <td>
                      <Typography textTransform={"uppercase"}>
                        {c.name}
                      </Typography>
                    </td>

                    <td>
                      <Typography>{c.password}</Typography>
                    </td>
                    <td>
                      <Typography>{c.candidates}</Typography>
                    </td>
                    <td>
                      <Typography>{c.sessionLength}</Typography>
                    </td>

                    <td>
                      <Typography>{c.capacity}</Typography>
                    </td>
                    <td>
                      <DeleteCentre
                        examination={examination._id}
                        getData={getExamCentres}
                        centre={c._id}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </>
  );
}

function DeleteCentre({ examination, centre, getData }) {
  const { setAlertData } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const deleteCentre = async () => {
    setLoading(true);
    const { data, error } = await httpService(
      `aguila/centres/deleteexamcentre/${examination}/${centre}`
    );
    if (data) {
      getData();
      setAlertData({ message: data, open: true, severity: "success" });
    }
    if (error) {
      setAlertData({ message: error, open: true, severity: "error" });
    }
    setLoading(false);
  };
  return (
    <IconButton onClick={deleteCentre}>
      {loading ? <CircularProgress size={20} /> : <Delete />}
    </IconButton>
  );
}
