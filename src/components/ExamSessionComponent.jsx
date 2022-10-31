import { Add, Label } from "@mui/icons-material";
import {
  IconButton,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { httpService } from "../httpService";
import { Modal } from "react-bootstrap";

function ExamSessionComponent({ examination, subject, session, subjectId }) {
  const [show, setShow] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [examData, setExamData] = useState(null);

  const getQuestionBanks = async () => {
    const path = `viewQuestionBanks/${subjectId}`;

    const res = await httpService.get(path);

    if (res) {
      setQuestionBanks(res.data);
    }
  };

  const getData = async () => {
    const path = `viewExamSession?examination=${examination}&session=${session}`;

    const res = await httpService.get(path);

    if (res) {
      setExamData(res.data);
    }
  };
  useEffect(() => {
    getData();
    getQuestionBanks();
  }, []);
  return (
    <div>
      <Typography variant="subtitle1">{subject}</Typography>
      {!examData ? (
        <IconButton color="error" onClick={handleShow}>
          <Add />
        </IconButton>
      ) : null}

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
            <Button color="error" onClick={handleClose}>
              Close
            </Button>
            <Button color="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

export default ExamSessionComponent;
