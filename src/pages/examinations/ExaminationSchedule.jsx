import {
  Chip,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { LoadingButton } from "@mui/lab";
import { SettingsSharp } from "@mui/icons-material";
import { AlertContext } from "../../contexts/AlertContext";
import { Modal } from "react-bootstrap";

export default function ExaminationSchedule() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
  });

  const getExamination = async () => {
    setLoading(true);
    const path = `aguila/examination/${id}/view`;

    const res = await httpService.get(path);

    if (res) {
      setExamination(res.data);
    }
    setLoading(false);
  };

  async function getAnalysis() {
    setLoading(true);
    const { data } = await httpService(`aguila/candidates/${id}/analysis`);

    if (data) {
      setAnalysis(data);
    }

    setLoading(false);
  }
  useEffect(() => {
    getExamination();

    getAnalysis();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5 p-3">
        {loading && <CircularProgress />}
        {examination ? (
          <div>
            <Typography
              variant="h4"
              textTransform={"capitalize"}
              fontWeight={600}
            >
              {examination.title} examination schedule
            </Typography>

            <div className="row mt-3">
              <div
                className="col-lg-3 p-3"
                style={{ backgroundColor: "#fdb874" }}
              >
                <Typography>
                  Total Candidates: {analysis.total.toLocaleString()}
                </Typography>
              </div>
              <div
                className="col-lg-3 p-3"
                style={{ backgroundColor: "#b088ad", color: "white" }}
              >
                <Typography>
                  Unassigned: {analysis.unassigned.toLocaleString()}
                </Typography>
              </div>
              <div
                className="col-lg-3 p-3"
                style={{ backgroundColor: "#1d2b67", color: "white" }}
              >
                <Typography>
                  Assigned: {analysis.assigned.toLocaleString()}
                </Typography>
              </div>
            </div>
            <div className="mt-3">
              <ExamSessions examination={examination} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ExamSessions({ examination }) {
  const [sessions, setSessions] = useState([]);

  const getData = async () => {
    const { data } = await httpService("aguila/centres/examsessions");

    setSessions(data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div
        className="col-lg-3 p-3"
        style={{ backgroundColor: "#f2f2eb", color: "GrayText" }}
      >
        <Typography gutterBottom>Available sessions for this exam</Typography>
        <div className="d-flex justify-content-end">
          <Typography variant="h3" fontWeight={700}>
            {sessions.length}
          </Typography>
        </div>
      </div>
      <div className="mt-2">
        {sessions.map((c, i) => (
          <div key={i}>
            <ExamSessionModelComponent c={c} examination={examination} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ExamSessionModelComponent({ c, examination }) {
  const [examSession, setExamSession] = useState(null);
  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState({});
  const [show, setShow] = useState(false);
  const { setAlertData } = useContext(AlertContext);

  const getData = async () => {
    const { data } = await httpService.post(
      "aguila/examination/examsession/view",
      { examination: examination._id, session: c }
    );

    if (data) {
      setExamSession(data);
    }
  };

  const createExamSession = async () => {
    setCreating(true);
    const { data } = await httpService.post(
      "aguila/examination/examsession/create",
      { examination: examination._id, session: c }
    );

    if (data) {
      getData();
      setAlertData({ severity: "success", message: data, open: true });
    }
    setCreating(false);
  };
  useEffect(() => {
    getData();
  }, []);

  const handleClick = (e) => {
    setSubject(e);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
  };
  return (
    <div>
      <Typography variant="h6" fontWeight={700} gutterBottom>
        {c}
      </Typography>
      <div className="row mt-2 mb-2">
        <div className="col-lg-4 border-end">
          <Typography gutterBottom>SUBJECT QUESTION BANKS</Typography>
          {examination.subjects.map((c, i) => (
            <div key={i} className="mb-4 mt-3">
              <Chip
                onClick={() => handleClick(c)}
                variant="outlined"
                label={
                  <Typography textTransform={"capitalize"}>{c.name}</Typography>
                }
              />
            </div>
          ))}
        </div>
        <div className="col-lg-3 border-end">
          <Typography gutterBottom>Exam Duration</Typography>
          <Stack direction="row" spacing={1}>
            <div>
              <TextField placeholder="HH" type="number" />
            </div>
            <div>
              <TextField placeholder="MM" type="number" />
            </div>
            <div>
              <TextField placeholder="SS" type="number" />
            </div>
          </Stack>
        </div>
        <div className="col-lg-3  d-flex align-items-end">
          <div className="col-lg-12">
            {!examSession ? (
              <div>
                <LoadingButton
                  loading={creating}
                  loadingPosition="end"
                  endIcon={<SettingsSharp />}
                  onClick={createExamSession}
                >
                  create exam session
                </LoadingButton>
              </div>
            ) : (
              <div
                className="p-3 rounded-3 shadow-sm"
                style={{ backgroundColor: "#efe9e1", color: "black" }}
              >
                <Typography fontWeight={700} gutterBottom>
                  EXAM SESSION CREATED
                </Typography>
                <hr />
                <Typography color="GrayText">
                  {examSession.questionBanks.length} question banks
                </Typography>
              </div>
            )}
          </div>
        </div>
      </div>
      <Modal size="lg" show={show} centered onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            style={{ textTransform: "uppercase" }}
          >
            {subject.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Question Banks</h5>
          <p>Select a question bank for this subject</p>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}
