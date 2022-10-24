import React from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  FormGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link,
} from "@mui/material";

import { pink } from "@mui/material/colors";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
        <Button onClick={handleShow}>Update subjects</Button>
      </div>
    );
  };

  useEffect(() => {
    viewCreatedExaminations();
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
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
}
