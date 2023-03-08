import { Add, Delete } from "@mui/icons-material";
import {
  IconButton,
  Typography,
  Button,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { httpService } from "../httpService";
import { Badge, Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { LoadingButton } from "@mui/lab";
import MySnackBar from "./MySnackBar";

function ExamSessionComponent({ examination, subject, session, subjectId }) {
  const [show, setShow] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [questionBank, setQuestionBank] = useState("");
  const [examData, setExamData] = useState(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getQuestionBanks = async () => {
    const path = `viewQuestionBanks/${subjectId}`;

    const res = await httpService.get(path);

    if (res) {
      setQuestionBanks(res.data);
    }
  };

  const getData = async () => {
    const path = `viewExamSession?examination=${examination}&session=${session}`;

    const res = await httpService.post(path, {
      subjectId,
      examination,
      session,
    });

    if (res) {
      setExamData(res.data);
    }
  };

  const addQuestionBank = async () => {
    Swal.fire({
      icon: "question",
      title: "Add to exam",
      text: "Do you want to add this question bank?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "addQuestionBankToExam";

        const res = await httpService.patch(path, {
          questionBank,
          examination,
          session,
        });

        if (res && res.data) {
          handleClose();
          getData();
        } else handleClose();
      }
    });
  };

  useEffect(() => {
    getData();
    getQuestionBanks();
  }, []);
  return (
    <div className="p-2">
      <Typography variant="h6">{subject}</Typography>
      {!examData ? (
        <>
          <Badge bg="danger">No question bank added</Badge>
          <IconButton color="error" onClick={handleShow}>
            <Add />
          </IconButton>
        </>
      ) : (
        <Badge bg="success">Question bank added</Badge>
      )}

      <div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{subject}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Add a question bank for {subject} subject for {session}
            <div className="mt-2">
              <FormControl>
                <FormLabel>Question Banks</FormLabel>
                <RadioGroup>
                  {questionBanks.map((c, i) => (
                    <FormControlLabel
                      onChange={(e) => setQuestionBank(e.target.value)}
                      value={c._id}
                      control={<Radio />}
                      label={`${c.subject.name} bank ${i + 1}`}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="error"
              variant="contained"
              className="me-2"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              color="primary"
              disabled={questionBank === "" ? true : false}
              variant="contained"
              onClick={addQuestionBank}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

function ExaminationSessionDetails({ examination, session }) {
  const [examData, setExamData] = useState(null);

  const getData = async () => {
    const path = "viewExamSession";
    const { data } = await httpService.post(path, { examination, session });

    if (data) {
      setExamData(data);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  const makeSessionAvailable = () => {
    Swal.fire({
      icon: "question",
      title: "ACTIVATE?",
      text: "Do you want to make this session available for download",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = `activateSession/${examData._id}`;
        const { data } = await httpService(path);
        if (data) setExamData(data);
      }
    });
  };
  const makeSessionUnavailable = () => {
    Swal.fire({
      icon: "question",
      title: "DEACTIVATE?",
      text: "Do you want to make this session unavailable for download",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = `activateSession/${examData._id}`;
        const { data } = await httpService(path);
        if (data) setExamData(data);
      }
    });
  };
  return (
    <div className="d-flex align-items-center">
      {examData ? (
        <>
          {examData.available ? (
            <div className="alert alert-light">
              <Typography fontWeight={600}>
                Exam is available for download
              </Typography>
              <div className="d-flex justify-content-end">
                <Button color="success" onClick={makeSessionUnavailable}>
                  make unavailable
                </Button>
              </div>
            </div>
          ) : (
            <Button color="error" onClick={makeSessionAvailable}>
              Make exam available for download
            </Button>
          )}
        </>
      ) : null}
    </div>
  );
}

function ExamQuestionBankDelete({ examination, session, getExamSessions }) {
  const [examData, setExamData] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const getData = async () => {
    const path = "viewExamSession";
    const { data } = await httpService.post(path, { examination, session });

    if (data) {
      setExamData(data);
    }
  };

  const removeQuestionBank = () => {
    Swal.fire({
      icon: "question",
      title: "Remove question bank?",
      text: `Are you sure you want to remove the question banks for ${session}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        const { data, error } = await httpService.post("removeQuestionBank", {
          examination,
          session,
        });

        if (data) {
          setOpen(true);
          setMessage(data);
          setSeverity("success");
          getExamSessions();
        }
        if (error) {
          setOpen(true);
          setMessage(error);
          setSeverity("danger");
        }
        setDeleting(false);
      }
    });
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      {examData ? (
        <div alert alert-light>
          <LoadingButton
            size="sm"
            endIcon={<Delete />}
            loadingPosition="end"
            loading={deleting}
            onClick={removeQuestionBank}
          >
            remove question banks
          </LoadingButton>
        </div>
      ) : null}
      <MySnackBar
        open={open}
        setOpen={setOpen}
        message={message}
        severity={severity}
      />
    </div>
  );
}
export {
  ExamSessionComponent,
  ExaminationSessionDetails,
  ExamQuestionBankDelete,
};
