import { Button, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { httpService } from "../../httpService";
import { LoadingButton } from "@mui/lab";
import { Save } from "@mui/icons-material";
import { Table } from "react-bootstrap";
import MySnackBar from "../../components/MySnackBar";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";

export default function ExaminationHandler() {
  const [examinations, setExaminations] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
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
      <div className="mt-5">
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
          <div className="mt-2 col-lg-8">
            <Table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Subject List</th>
                </tr>
              </thead>
              <tbody>
                {examinations.map((c) => (
                  <tr>
                    <td>
                      <Typography textTransform={"uppercase"}>
                        {c.title}
                      </Typography>
                    </td>
                    <td>
                      <ToggleActivation data={c} />
                    </td>
                    <td>
                      <SubjectsList data={c} />
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

function ToggleActivation({ data }) {
  return (
    <>
      {data.active ? (
        <LoadingButton color="error">deactivate</LoadingButton>
      ) : (
        <LoadingButton color="error">acivate</LoadingButton>
      )}
    </>
  );
}

function SubjectsList({ data }) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <>
      {data.subjects.length === 0 ? (
        <Button onClick={handleShow}>add subjects</Button>
      ) : (
        <LoadingButton color="error">acivate</LoadingButton>
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
              {data.title}
            </Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <Button color="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button color="primary">update subjects</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
