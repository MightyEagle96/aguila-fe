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
  Alert,
  AlertTitle,
  Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import {
  SettingsSharp,
  FavoriteBorder,
  Favorite,
  DoneAll,
  Delete,
} from "@mui/icons-material";
import { Badge, Modal, Table } from "react-bootstrap";
import secondsTimeFormatter from "seconds-time-formatter";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

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
  const [duration, setDuration] = useState({ hr: "0", min: "0", sec: "0" });
  const [errorMin, setErrorMin] = useState(false);
  const [errorSec, setErrorSec] = useState(false);
  const [errorHr, setErrorHr] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [activating, setActivating] = useState(false);

  const [scheduledDate, setScheduledDate] = useState(null);

  const [scheduledTime, setScheduledTime] = useState(null);

  const [updatingTime, setUpdatingTime] = useState(false);

  const [completing, setCompleting] = useState(false);

  const [loading, setLoading] = useState(false);

  const [makingActive, setMakingActive] = useState(false);

  const [makingInactive, setMakingInactive] = useState(false);

  const [showCentres, setShowCentres] = useState(false);

  const [sessionCentres, setSessionCentres] = useState([]);

  const getExamSession = async () => {
    setLoading(true);
    const { data } = await httpService.post(
      "aguila/examination/examsession/view",
      { examination: examination._id, session: c }
    );

    if (data) {
      const examTimer = secondsTimeFormatter.timeConvert({
        seconds: data.duration / 1000,
        format: "json",
      });

      setDuration({
        hr: examTimer.hours,
        min: examTimer.minutes,
        sec: examTimer.seconds,
      });
      setExamSession(data);
    }
    setLoading(false);
  };

  const markAsComplete = () => {
    Swal.fire({
      icon: "question",
      title: "Mark Session as complete",
      text: "Do you want to mark this session as complete. It will not be available for download again.",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCompleting(true);
        const { data } = await httpService(
          `aguila/examination/markexamascomplete/${examSession._id}`
        );

        if (data) {
          setAlertData({ open: true, message: data, severity: "success" });
          getExamSession();
        }
        setCompleting(false);
      }
    });
  };

  const handleChangeDuration = (e) => {
    setDuration({ ...duration, [e.target.name]: e.target.value });
  };

  const updateDuration = async () => {
    setUpdating(true);
    const hours = Number(duration.hr) * 60 * 60;
    const minutes = Number(duration.min) * 60;
    const seconds = Number(duration.sec);
    const examTimer = (hours + minutes + seconds) * 1000;

    const { data } = await httpService.patch(
      `aguila/examination/duration/${examSession._id}`,
      { duration: examTimer }
    );

    if (data) {
      getExamSession();
      setAlertData({ message: data, severity: "success", open: true });
    }
    setUpdating(false);
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

  const setSessionDateTime = () => {
    Swal.fire({
      icon: "question",
      title: "Update session date or time",
      text: "Do you wish to update the date or time of this session",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setUpdatingTime(true);
        const { data, error } = await httpService.patch(
          `aguila/examination/setsessiondatetime/${examSession._id}`,
          { scheduledDate, scheduledTime }
        );

        if (data) {
          setAlertData({ message: data, open: true, severity: "success" });
          getExamSession();
        }
        if (error)
          setAlertData({ message: error, open: true, severity: "error" });

        setUpdatingTime(false);
      }
    });
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

  function hasUpdated(id) {
    if (examSession) {
      const index = examSession.questionBanks.findIndex(
        (c) => c.subject === id
      );

      return index >= 0 ? true : false;
    }
    return false;
  }

  function MakeExamAvaialbleForDownload() {
    Swal.fire({
      icon: "question",
      title: `${examSession.available ? "Deactivate Exam" : "Activate Exam"}`,
      text: `${
        examSession.available
          ? "This will deactivate this exam and will make it unavaialble for download"
          : "This will activate this exam and make it available for download, worldwide"
      }`,
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActivating(true);
        const { data } = await httpService(
          `aguila/examination/activateexam/${examSession._id}`
        );
        if (data) {
          getExamSession();
          setAlertData({ message: data, severity: "success", open: true });
        }
        setActivating(false);
      }
    });
  }

  function MakeSessionActive() {
    Swal.fire({
      icon: "question",
      title: "Make Active?",
      text: "Do you want to make this session the active session?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setMakingActive(true);
        const { data, error } = await httpService.get(
          `aguila/examination/makesessionactive/${examSession._id}`
        );

        if (data) {
          setAlertData({ open: true, message: data, severity: "success" });
          getExamSession();
        }

        if (error)
          setAlertData({ open: true, message: error, severity: "error" });

        setMakingActive(false);
      }
    });
  }
  function MakeSessionInactive() {
    Swal.fire({
      icon: "question",
      title: "Make Active?",
      text: "Do you want to make this session inactive?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setMakingInactive(true);
        const { data, error } = await httpService.get(
          `aguila/examination/makesessioninactive/${examSession._id}`
        );

        if (data) {
          setAlertData({ open: true, message: data, severity: "success" });
          getExamSession();
        }

        if (error)
          setAlertData({ open: true, message: error, severity: "error" });

        setMakingInactive(false);
      }
    });
  }

  const handleCloseCentres = () => {
    setShowCentres(false);
    setSessionCentres([]);
  };

  const GetSessionCentres = async () => {
    const { data, error } = await httpService.get(
      `aguila/centres/sessioncentres/${examSession._id}`
    );

    if (data) {
      setSessionCentres(data);
      setShowCentres(true);
    }

    if (error) {
      setAlertData({ open: true, message: error, severity: "error" });
    }
  };

  const deleteExamSession = () => {
    Swal.fire({
      icon: "question",
      title: "Delete Exam Session",
      text: "Are you sure you want to delete this examination session?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { data, error } = await httpService.delete(
          `aguila/examination/deletesession/${examSession._id}`
        );

        if (data)
          setAlertData({ open: true, severity: "success", message: data });

        if (error)
          setAlertData({ open: true, severity: "error", message: error });
      }
    });
  };
  return (
    <div>
      {loading && <CircularProgress />}
      <div className="mb-4">
        <Stack>
          <div>
            <Typography
              textTransform={"uppercase"}
              variant="h4"
              fontWeight={700}
              color="GrayText"
            >
              {c}
            </Typography>
          </div>
          {examSession && !examSession.activeSession && (
            <div>
              <LoadingButton
                variant="contained"
                loading={makingActive}
                onClick={MakeSessionActive}
              >
                make this session the active session
              </LoadingButton>
            </div>
          )}
          {examSession && examSession.activeSession && (
            <div>
              <Badge bg="success">ACTIVE SESSION</Badge>
              <LoadingButton
                color="error"
                loading={makingInactive}
                onClick={MakeSessionInactive}
              >
                make session inactive
              </LoadingButton>
            </div>
          )}
        </Stack>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-lg-3 border-end">
          <Typography gutterBottom>SUBJECT QUESTION BANKS</Typography>
          {examination.subjects.map((c, i) => (
            <div key={i} className="mb-2">
              <Chip
                disabled={!examSession || examSession.available}
                onClick={() => handleClick(c)}
                color="info"
                variant={hasUpdated(c._id) ? "filled" : "outlined"}
                label={
                  <Typography textTransform={"uppercase"}>{c.name}</Typography>
                }
              />
            </div>
          ))}
          <Typography variant="subtitle2">
            Click on any of the subjects to add a question bank
          </Typography>
        </div>
        <div className="col-lg-3 border-end">
          <Typography variant="caption" gutterBottom>
            set exam duration
          </Typography>
          <Stack direction="row" spacing={1} className="mb-1">
            <div>
              <TextField
                placeholder="HH"
                type="number"
                disabled={examSession && examSession.available}
                value={duration.hr}
                name="hr"
                onChange={(e) => {
                  if (e.target.value > 3 || e.target.value < 0) {
                    setErrorHr(true);
                  } else {
                    handleChangeDuration(e);
                    setErrorHr(false);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value > 3 || e.target.value < 0) {
                    setErrorHr(true);
                  } else {
                    handleChangeDuration(e);
                    setErrorHr(false);
                  }
                  if (e.target.value === "") {
                    e.target.value = 0;

                    handleChangeDuration(e);
                  }
                }}
                error={errorHr}
                helperText={errorHr ? "Value must be between 0 & 3" : ""}
              />
            </div>
            <div>
              <TextField
                placeholder="MM"
                type="number"
                disabled={examSession && examSession.available}
                value={duration.min}
                name="min"
                onChange={(e) => {
                  if (e.target.value > 59 || e.target.value < 0) {
                    setErrorMin(true);
                  } else {
                    handleChangeDuration(e);
                    setErrorMin(false);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value > 59 || e.target.value < 0) {
                    setErrorMin(true);
                  } else {
                    handleChangeDuration(e);
                    setErrorMin(false);
                  }
                  if (e.target.value === "") {
                    e.target.value = 0;

                    handleChangeDuration(e);
                  }
                }}
                error={errorMin}
                helperText={errorMin ? "Value must be between 0 & 59" : ""}
              />
            </div>
            <div>
              <TextField
                disabled={examSession && examSession.available}
                placeholder="SS"
                type="number"
                value={duration.sec}
                name="sec"
                onChange={(e) => {
                  if (e.target.value > 59 || e.target.value < 0) {
                    setErrorSec(true);
                  } else {
                    handleChangeDuration(e);
                    setErrorSec(false);
                  }
                }}
                onBlur={(e) => {
                  if (e.target.value > 59 || e.target.value < 0) {
                    setErrorSec(true);
                  } else {
                    handleChangeDuration(e);
                    setErrorSec(false);
                  }

                  if (e.target.value === "") {
                    e.target.value = 0;

                    handleChangeDuration(e);
                  }
                }}
                error={errorSec}
                helperText={errorSec ? "Value must be between 0 & 59" : ""}
              />
            </div>
          </Stack>
          <div
            className="mt-3 mb-3 p-3"
            style={{ backgroundColor: "#1d2b67", color: "white" }}
          >
            <Typography>
              {duration.hr} hours, {duration.min} minutes, {duration.sec}{" "}
              seconds
            </Typography>
          </div>
          <LoadingButton
            onClick={updateDuration}
            disabled={examSession && examSession.available}
            color="info"
            loadingPosition="end"
            loading={updating}
            endIcon={<i class="fas fa-clock    "></i>}
          >
            set duration
          </LoadingButton>
        </div>
        <div className="col-lg-3 border-end">
          <div className="mb-3">
            <Typography gutterBottom variant="caption">
              Examination date and time
            </Typography>
          </div>
          {examSession ? (
            <>
              {" "}
              <DatePicker
                label="Select exam date"
                onChange={(e) =>
                  setScheduledDate({
                    date: e.$d,
                    dateString: new Date(e).toDateString(),
                  })
                }
                disablePast
                format="LL"
              />
              <TimePicker
                label="Select exam time"
                className="mt-4 mb-4"
                onChange={(e) =>
                  setScheduledTime({ hour: e.hour(), minute: e.minute() })
                }
              />
              <div className="mt-3">
                <LoadingButton
                  onClick={setSessionDateTime}
                  loading={updatingTime}
                  color="warning"
                >
                  set date and time for this session
                </LoadingButton>
              </div>
              <div className="mt-2">
                {examSession && !examSession.scheduledDate && (
                  <Alert severity="warning">
                    <AlertTitle>NO DATE</AlertTitle>
                    No date for this session has been set yet
                  </Alert>
                )}
                {examSession && examSession.scheduledDate && (
                  <Alert severity="info">
                    <AlertTitle>Session Date</AlertTitle>
                    {examSession.scheduledDate.dateString}
                  </Alert>
                )}
              </div>
              <div className="mt-2">
                {examSession && !examSession.scheduledTime && (
                  <Alert severity="warning">
                    <AlertTitle>NO TIME</AlertTitle>
                    No time for this session has been set yet
                  </Alert>
                )}
                {examSession &&
                  examSession.scheduledDate &&
                  examSession.scheduledTime && (
                    <Alert severity="info">
                      <AlertTitle>Session Time</AlertTitle>
                      {new Date(
                        2023,
                        0,
                        1,
                        examSession.scheduledTime.hour,
                        examSession.scheduledTime.minute,
                        0
                      ).toLocaleTimeString()}
                    </Alert>
                  )}
              </div>
            </>
          ) : (
            <>
              <Alert severity="error">
                <AlertTitle>No session created</AlertTitle>
                Please create a session to set the date and time for it
              </Alert>
            </>
          )}
        </div>
        <div className="col-lg-3">
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
                  {examSession.questionBanks.length} question bank(s) added
                </Typography>
                <div className="mt-3">
                  {examSession.sessionConcluded ? (
                    <>
                      <Typography variant="h6" fontWeight={700}>
                        Session Complete
                      </Typography>
                    </>
                  ) : (
                    <>
                      {examSession.questionBanks.length ===
                        examination.subjects.length && (
                        <>
                          {!examSession.available ? (
                            <LoadingButton
                              onClick={MakeExamAvaialbleForDownload}
                              color="success"
                              variant="contained"
                              loadingPosition="center"
                              loading={activating}
                            >
                              MAKE EXAM AVAILABLE FOR DOWNLOAD
                            </LoadingButton>
                          ) : (
                            <LoadingButton
                              onClick={MakeExamAvaialbleForDownload}
                              color="error"
                              variant="contained"
                              loadingPosition="center"
                              loading={activating}
                            >
                              MAKE EXAM UNAVAILABLE FOR DOWNLOAD
                            </LoadingButton>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-4">
            {examSession && (
              <LoadingButton
                color="success"
                endIcon={<DoneAll />}
                loading={completing}
                loadingPosition="end"
                onClick={markAsComplete}
                disabled={examSession ? examSession.sessionConcluded : false}
              >
                Mark exam session as complete
              </LoadingButton>
            )}
          </div>
          {examSession && (
            <>
              <div className="mt-2">
                <LoadingButton onClick={GetSessionCentres}>
                  View centres that will be conducting this session
                </LoadingButton>
              </div>
              <div className="mt-2">
                <LoadingButton
                  startIcon={<Delete />}
                  color="error"
                  onClick={deleteExamSession}
                >
                  delete this exam session
                </LoadingButton>
              </div>
            </>
          )}
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
      <Modal size="lg" show={showCentres} centered onHide={handleCloseCentres}>
        <Modal.Header closeButton>
          <Modal.Title
            id="contained-modal-title-vcenter"
            style={{ textTransform: "uppercase" }}
          >
            {c} CENTRES
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Capacity</th>
              </tr>
            </thead>
            <tbody>
              {sessionCentres.map((c) => (
                <tr>
                  <td>
                    <Typography textTransform={"uppercase"}>
                      {c.centre.name}
                    </Typography>
                  </td>
                  <td>
                    <Typography textTransform={"uppercase"}>
                      {c.centre.capacity}
                    </Typography>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </div>
  );
}
