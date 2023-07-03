import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { httpService } from "../../httpService";
import { Table } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { Delete, Save } from "@mui/icons-material";
import { AlertContext } from "../../contexts/AlertContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function AllSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();
  const { setAlertData } = useContext(AlertContext);
  const getData = async () => {
    setLoading(true);
    const { data, error } = await httpService("aguila/subject/all");
    if (data) {
      setSubjects(data);
    }
    if (error) setAlertData({ message: error, open: true, severity: "error" });
    setLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);

  const createSubject = async (e) => {
    e.preventDefault();
    setCreating(true);
    const { data, error } = await httpService.post("aguila/subject/create", {
      name: subject,
    });
    if (data) {
      getData();
      setAlertData({ message: data, severity: "success", open: true });
    }
    if (error) {
      setAlertData({ message: error, severity: "error", open: true });
    }
    setCreating(false);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="mb-3">
          <Typography variant="h4" fontWeight={600}>
            Subjects Control
          </Typography>
        </div>
        {loading && <CircularProgress />}
        <div className="row">
          <div className="col-lg-9">
            <Table borderless striped>
              <thead className="bg-dark text-white">
                <tr>
                  <th>Subject</th>
                  <th>Question Bank</th>
                  <th>Delete Subject</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <Typography textTransform={"capitalize"}>
                        {c.name}
                      </Typography>
                    </td>
                    <td>
                      <Button
                        onClick={() => navigate(`/subjects/view/${c._id}`)}
                      >
                        view
                      </Button>
                    </td>
                    <td>
                      <DeleteSubject id={c._id} getData={getData} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="col-lg-3  rounded-3">
            <div className="mb-3">
              <div className="mb-2">
                <Typography variant="h6">Create a new subject</Typography>
              </div>
              <form onSubmit={createSubject}>
                <div className="mb-2">
                  <TextField
                    fullWidth
                    onChange={(e) => setSubject(e.target.value)}
                    value={subject}
                  />
                </div>
                <div>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    endIcon={<Save />}
                    loading={creating}
                  >
                    Create
                  </LoadingButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteSubject({ id, getData }) {
  const [loading, setLoading] = useState(false);
  const { setAlertData } = useContext(AlertContext);
  const deleteSubject = () => {
    Swal.fire({
      icon: "question",
      title: "Delete Subject",
      text: "Deleting a subject will consequently delete all the question banks attached to this particular subject. Are you sure you wish to proceed?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data, error } = await httpService.delete(
          `aguila/subject/delete/${id}`
        );
        if (data) {
          getData();
          setAlertData({ message: data, severity: "success", open: true });
        }
        if (error) {
          setAlertData({ message: error, severity: "error", open: true });
        }
        setLoading(false);
      }
    });
  };
  return (
    <LoadingButton
      endIcon={<Delete />}
      onClick={deleteSubject}
      loading={loading}
      loadingPosition="end"
      color="error"
    >
      Delete
    </LoadingButton>
  );
}
