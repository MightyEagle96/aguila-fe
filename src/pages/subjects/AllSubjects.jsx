import { CircularProgress, Link, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { httpService } from "../../httpService";
import { Table } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { Height, Save } from "@mui/icons-material";
import MySnackBar from "../../components/MySnackBar";

export default function AllSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("aguila/subject/all");
    if (data) {
      setSubjects(data);
    }
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
      setMessage(data);
      setOpen(true);
      setSeverity("success");
    }
    if (error) {
      setMessage(error);
      setOpen(true);
      setSeverity("error");
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
          <div className="col-lg-6">
            {subjects.map((c, i) => (
              <div key={i} className="alert alert-light mb-2 shadow-sm">
                <Typography
                  variant="h6"
                  textTransform={"uppercase"}
                  gutterBottom
                >
                  {c.name}
                </Typography>
                <div className="d-flex justify-content-end">
                  <Link href={`/subjects/view/${c._id}`}>question banks</Link>
                </div>
              </div>
            ))}
          </div>
          <div
            className="col-lg-4 p-4 rounded-3"
            style={{ backgroundColor: "#f5f1ee", height: 200 }}
          >
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
                >
                  Create
                </LoadingButton>
              </div>
            </form>
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
