import {
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  FormGroup,
  Link,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { httpService } from "../../httpService";
import { LoadingButton } from "@mui/lab";
import { Save, ToggleOff, ToggleOn, Update } from "@mui/icons-material";
import { Table } from "react-bootstrap";
import MySnackBar from "../../components/MySnackBar";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { AlertContext } from "../../contexts/AlertContext";

export default function ExaminationHandler() {
  const [examinations, setExaminations] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const [subjects, setSubjects] = useState([]);

  const createExam = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Create new exam?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCreating(true);
        const { data, error } = await httpService.post(
          `aguila/examination/create`,
          {
            title,
          }
        );
        if (data) {
          viewExams();
          setSeverity("success");
          setOpen(true);
          setMessage(data);
        }
        if (error) {
          setSeverity("error");
          setOpen(true);
          setMessage(error);
        }
        setCreating(false);
      }
    });
  };
  const viewExams = async () => {
    const { data } = await httpService(`aguila/examination/all`);

    if (data) {
      setExaminations(data);
    }
  };

  const getSubjects = async () => {
    const { data } = await httpService("aguila/subject/all");

    if (data) {
      setSubjects(data);
    }
  };
  useEffect(() => {
    viewExams();
    getSubjects();
  }, []);

  return (
    <div>
      <div className="mt-5 mb-5 p-3">
        <div>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Examination Control
          </Typography>

          <div className="col-lg-4">
            <Typography>Create new exam</Typography>

            <form onSubmit={createExam}>
              <TextField
                fullWidth
                required
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="mt-2">
                <LoadingButton
                  variant="contained"
                  loadingPosition="end"
                  endIcon={<Save />}
                  type="submit"
                  loading={creating}
                >
                  create
                </LoadingButton>
              </div>
            </form>
          </div>
          <div className="mt-4">
            <Table bordered>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Subject List</th>
                  <th>Candidates List</th>
                  <th>Schedule</th>
                </tr>
              </thead>
              <tbody>
                {examinations.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <Typography textTransform={"uppercase"}>
                        {c.title}
                      </Typography>
                    </td>
                    <td>
                      <ToggleActivation examination={c} viewExams={viewExams} />
                    </td>
                    <td className="col-lg-4">
                      <SubjectsList
                        examination={c}
                        subjects={subjects}
                        setMessage={setMessage}
                        setOpen={setOpen}
                        setSeverity={setSeverity}
                        viewExams={viewExams}
                      />
                    </td>
                    <td>
                      <Link href={`/candidates/${c._id}/list`}>view list</Link>
                    </td>
                    <td>
                      <Link href={`/examination/schedule/${c._id}`}>
                        schedule
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      <MySnackBar
        open={open}
        setOpen={setOpen}
        message={message}
        severity={severity}
      />
    </div>
  );
}

function ToggleActivation({ examination, viewExams }) {
  const [activating, setActivating] = useState(false);

  const { setAlertData } = useContext(AlertContext);

  const toggleActivate = (action) => {
    Swal.fire({
      icon: "question",
      title: `${action} this exam?`,
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setActivating(true);
        const { data, error } = await httpService.patch(
          `aguila/examination/${examination._id}/toggleactivate`,
          { action }
        );

        if (data) {
          viewExams();
          setAlertData({ open: true, severity: "success", message: data });
        }
        if (error) {
          setAlertData({ open: true, severity: "error", message: data });
        }
        setActivating(false);
      }
    });
  };
  return (
    <>
      {examination.active ? (
        <LoadingButton
          color="error"
          loading={activating}
          loadingPosition="end"
          endIcon={<ToggleOff />}
          onClick={() => toggleActivate("deactivate")}
        >
          deactivate
        </LoadingButton>
      ) : (
        <LoadingButton
          loading={activating}
          endIcon={<ToggleOn />}
          onClick={() => toggleActivate("activate")}
        >
          activate
        </LoadingButton>
      )}
    </>
  );
}

function SubjectsList({
  examination,
  subjects,
  setOpen,
  setMessage,
  setSeverity,
  viewExams,
}) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [updating, setUpdating] = useState(false);

  const [selected, setSelected] = useState([]);

  const selectSubject = (e) => {
    if (e.target.checked) {
      setSelected([...selected, e.target.value]);
    } else {
      const filtered = selected.filter((c) => c !== e.target.value);
      setSelected(filtered);
    }
  };

  const updateSubjects = () => {
    Swal.fire({
      icon: "question",
      title: "Add these subjects to this exam?",
      text: "It cannot be changed afterwards",
      showCancelButton: true,
    }).then(async (result) => {
      if (result) {
        setUpdating(true);
        const { data, error } = await httpService.patch(
          `aguila/examination/${examination._id}/update`,
          { selected }
        );
        if (data) {
          viewExams();
          handleClose();
          setMessage(data);
          setOpen(true);
          setSeverity("success");
        }
        if (error) {
          setMessage(error);
          setOpen(true);
          setSeverity("error");
        }
        setUpdating(false);
      }
    });
  };
  return (
    <>
      {examination.subjects.length === 0 ? (
        <Button onClick={handleShow}>add subjects</Button>
      ) : (
        <div className="d-flex flex-wrap">
          {examination.subjects.map((c, i) => (
            <Chip
              className="me-1 mb-1"
              key={i}
              label={
                <Typography textTransform={"capitalize"}>{c.name}</Typography>
              }
            />
          ))}
        </div>
      )}
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <Typography
              fontWeight={700}
              variant="h5"
              textTransform={"uppercase"}
            >
              {examination.title}
            </Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            {subjects.map((c, i) => (
              <FormControlLabel
                key={i}
                onChange={selectSubject}
                control={<Checkbox />}
                value={c._id}
                label={
                  <Typography textTransform={"capitalize"}>{c.name}</Typography>
                }
              />
            ))}
          </FormGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
          <LoadingButton
            loadingPosition="end"
            loading={updating}
            endIcon={<Update />}
            color="primary"
            onClick={updateSubjects}
          >
            update subjects
          </LoadingButton>
        </Modal.Footer>
      </Modal>
    </>
  );
}
