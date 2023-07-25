import {
  Typography,
  Link,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { httpService } from "../../httpService";
import { Table, Modal, Badge } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { AlertContext } from "../../contexts/AlertContext";

export default function ViewAllCentres() {
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [creating, setCreating] = useState(false);
  const [centreDetail, setCentreDetail] = useState({});
  const { setAlertData } = useContext(AlertContext);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getCentres = async () => {
    setLoading(true);
    const { data } = await httpService.get("aguila/centres/all");
    if (data) setCentres(data);

    setLoading(false);
  };

  useEffect(() => {
    getCentres();
  }, []);

  const handleChange = (e) =>
    setCentreDetail({ ...centreDetail, [e.target.name]: e.target.value });

  const createCentre = async (e) => {
    e.preventDefault();
    setCreating(true);

    const { data, error } = await httpService.post(
      "aguila/centres/create",
      centreDetail
    );
    if (data) {
      handleClose();
      getCentres();
      setAlertData({ message: data, open: true, severity: "success" });
    }
    if (error) {
      setAlertData({ message: error, open: true, severity: "error" });
    }
    setCreating(false);
  };
  return (
    <div>
      <div className="mb-5 mt-5">
        <div className="alert alert-light col-lg-6 mb-2">
          <Typography variant="h4" fontWeight={700} gutterBottom>
            ALL CENTRES
          </Typography>
          <Link href="/centres/centresmanager">
            view centres for the active examination
          </Link>
        </div>
        {loading && <CircularProgress />}
        <div className="  mb-1 d-flex justify-content-end">
          <Button color="error" onClick={handleShow}>
            add a new centre
          </Button>
        </div>
        <Table bordered striped>
          <thead>
            <tr>
              <th>Centre</th>
              <th>Centre ID</th>
              <th>Password</th>
              <th>Capacity</th>
              <th>Assigned</th>
            </tr>
          </thead>
          <tbody>
            {centres.map((c, i) => (
              <tr key={i}>
                <td>
                  <Typography textTransform={"capitalize"}>{c.name}</Typography>
                </td>
                <td>
                  <Typography textTransform={"capitalize"}>
                    {c.centreId}
                  </Typography>
                </td>
                <td>
                  <Typography>{c.password}</Typography>
                </td>
                <td>
                  <Typography>{c.capacity}</Typography>
                </td>
                <td>
                  {c.createdOnServer ? (
                    <Badge bg="success">YES</Badge>
                  ) : (
                    <Badge bg="danger">NO</Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        centered
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create new centre</Modal.Title>
        </Modal.Header>
        <form onSubmit={createCentre}>
          <Modal.Body>
            <div className="row">
              <div className="col-lg-6 mb-4">
                <TextField
                  variant="standard"
                  fullWidth
                  multiline
                  label="Centre Name"
                  required
                  name="name"
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-4 mb-4">
                <TextField
                  variant="standard"
                  required
                  fullWidth
                  label="Centre ID"
                  name="centreId"
                  onChange={handleChange}
                />
              </div>
              <div className="col-lg-4 mb-4">
                <TextField
                  variant="standard"
                  fullWidth
                  label="Capacity"
                  type="number"
                  required
                  name="capacity"
                  onChange={handleChange}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="error" onClick={handleClose}>
              Close
            </Button>
            <LoadingButton
              type="submit"
              loading={creating}
              color="success"
              variant="contained"
            >
              create centre
            </LoadingButton>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
}
