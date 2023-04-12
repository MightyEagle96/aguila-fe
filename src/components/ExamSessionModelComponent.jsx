import React, { useState, useEffect, useContext } from "react";
import { httpService } from "../httpService";
import { AlertContext } from "../contexts/AlertContext";
import {
  Typography,
  Stack,
  TextField,
  Chip,
  CircularProgress,
  IconButton,
  Button,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { SettingsSharp, FavoriteBorder, Favorite } from "@mui/icons-material";
import { Modal, Table } from "react-bootstrap";

export default function ExamSessionModelComponent({ c, examination }) {
  const [examSession, setExamSession] = useState(null);
  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState({});
  const [show, setShow] = useState(false);
  const [questionBanks, setQuestionbanks] = useState([]);
  const [fetchingBanks, setFetchingBanks] = useState(false);
  const { setAlertData } = useContext(AlertContext);
  const [selectedBank, setSelectedBank] = useState("");
  const [adding, setAdding] = useState(false);

  const getExamSession = async () => {
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
      getExamSession();
      setAlertData({ severity: "success", message: data, open: true });
    }
    setCreating(false);
  };
  useEffect(() => {
    getExamSession();
  }, []);

  const handleClick = (e) => {
    setSubject(e);
    getQuestionBanks(e._id);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setQuestionbanks([]);
  };

  const getQuestionBanks = async (id) => {
    setFetchingBanks(true);
    const { data } = await httpService(
      `aguila/subject/questionbank/view/${id}`
    );
    if (data) {
      setQuestionbanks(data);
    }
    setFetchingBanks(false);
  };

  const addQuestionBank = async () => {
    setAdding(true);
    const { data } = await httpService.post(
      `aguila/examination/addtoquestionbank/${examSession._id}`,
      { subject: subject._id, questionBank: selectedBank }
    );

    if (data) {
      handleClose();
      getExamSession();
      setAlertData({ message: data, severity: "success", open: true });
    }
    setAdding(false);
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
                disabled={!examSession}
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
                  variant="contained"
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

          {fetchingBanks ? (
            <CircularProgress />
          ) : (
            <div className="mt-3">
              <Table bordered>
                <thead>
                  <tr>
                    <th>Question Bank</th>
                    <th>Questions</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {questionBanks.length > 0 ? (
                    <>
                      {questionBanks.map((c, i) => (
                        <tr key={i}>
                          <td>
                            <Typography>Bank {i + 1}</Typography>
                          </td>
                          <td>
                            <Typography>{c.questions}</Typography>
                          </td>
                          <td>
                            <IconButton
                              onClick={() => setSelectedBank(c._id)}
                              disabled={c.questions === 0}
                              color="info"
                            >
                              {selectedBank === c._id ? (
                                <Favorite />
                              ) : (
                                <FavoriteBorder />
                              )}
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={12} className="text-center">
                        NO question bank available
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button color="error" onClick={handleClose}>
            close
          </Button>
          <LoadingButton
            onClick={addQuestionBank}
            loadingPosition="center"
            loading={adding}
          >
            save changes
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
