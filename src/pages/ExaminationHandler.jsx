import React from "react";
import {
  Button,
  TextField,
  Typography,
  FormGroup,
  Checkbox,
  FormControlLabel,
  Link,
  Stack,
} from "@mui/material";

import { httpService } from "../httpService";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { Badge, Modal } from "react-bootstrap";

export default function ExaminationHandler() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  const [examination, setExamination] = useState("");
  const [show, setShow] = useState(false);
  const [subjects, setSubjects] = useState([]);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [examId, setExamId] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const viewSubjects = async () => {
    const path = "viewSubjects";

    const res = await httpService.get(path);
    if (res) setSubjects(res.data);
  };
  const createNewExamination = async (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "question",
      title: "Confirm",
      text: "Create new examination",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "createNewExamination";

        const res = await httpService.post(path, { title: examination });

        if (res) {
          Swal.fire({ icon: "success", title: "Success", text: res.data });
        }
      }
    });
  };

  const viewCreatedExaminations = async () => {
    const path = "viewCreatedExaminations";

    const res = await httpService(path);

    if (res) {
      setData(res.data);
    }
  };

  const expandableComponent = ({ data }) => {
    return (
      <div className="p-2">
        {data.subjects.length > 0 ? (
          <>
            <Stack direction="row" spacing={2}>
              <div>
                <Typography variant="caption" gutterBottom>
                  Subjects:
                </Typography>
                <Typography>
                  {data.subjects.map((c) => c.name).join(", ")}
                </Typography>
              </div>
              <div className="border-start"></div>
              <div className="d-flex align-items-center">
                <Link href={`/registrations/${data._id}`}>
                  View Registrations
                </Link>
              </div>
            </Stack>
          </>
        ) : (
          <Button
            onClick={() => {
              setExamId(data._id);
              handleShow();
            }}
          >
            Update subjects
          </Button>
        )}
      </div>
    );
  };

  const addPrograms = (value) => {
    setSelectedSubjects((old) => [...old, value]);
  };

  const removeProgram = (value) => {
    const filtered = selectedSubjects.filter((c) => c !== value);
    setSelectedSubjects(filtered);
  };
  useEffect(() => {
    viewCreatedExaminations();
    viewSubjects();
  }, []);
  const columns = [
    { name: "TITLE", selector: (row) => row.title },
    {
      name: "DATE CREATED",
      selector: (row) => new Date(row.createdOn).toDateString(),
    },
    {
      name: "ACTIVE",
      selector: (row) =>
        row.active ? <Badge color="success">ACTIVE</Badge> : null,
    },
    {
      name: "WEB PAGE",
      selector: (row) => <Link href={`/exams/${row.slug}`}>view</Link>,
    },
  ];

  const updateExamWithSubjects = () => {
    Swal.fire({
      icon: "question",
      title: "Confirm",
      text: "Do you want to update this exam with these selected subjects?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "updateExam";

        const res = await httpService.patch(path, {
          examination: examId,
          selectedSubjects,
        });
        handleClose();

        if (res) {
          Swal.fire({ icon: "success", title: "Success", text: res.data });
        }
      }
    });
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div>
          <div className="d-flex justify-content-between">
            <div>
              <Typography fontWeight={600} variant="h4" gutterBottom>
                Examination Control
              </Typography>
            </div>
            <div>{processLoading ? <Spinner animation="grow" /> : null}</div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <form onSubmit={createNewExamination}>
                <TextField
                  label="Examination"
                  fullWidth
                  required
                  value={examination}
                  name="title"
                  helperText="Create a new examination"
                  onChange={(e) => setExamination(e.target.value)}
                />
                <br />
                <Button variant="contained" className="mt-2" type="submit">
                  {loading ? <Spinner animation="border" /> : "create"}
                </Button>
              </form>
            </div>
          </div>
          <div className="mt-2">
            <div className="mt-2">
              <DataTable
                data={data}
                columns={columns}
                pagination
                expandableRows
                expandableRowsComponent={expandableComponent}
              />
            </div>
          </div>
        </div>
      </div>
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Subjects</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              {subjects.map((c) => (
                <FormControlLabel
                  control={<Checkbox />}
                  label={c.name}
                  value={c._id}
                  onChange={(e) => {
                    if (e.target.checked) {
                      addPrograms(e.target.value);
                    } else removeProgram(e.target.value);
                  }}
                />
              ))}
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="contained"
              className="me-1"
              color="error"
              onClick={handleClose}
            >
              Close
            </Button>
            <Button
              variant="contained"
              color="info"
              disabled={selectedSubjects.length === 0 ? true : false}
              onClick={updateExamWithSubjects}
            >
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
}
