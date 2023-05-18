import { CircularProgress, Link, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { httpService } from "../../httpService";
import { Table } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { Height, Save } from "@mui/icons-material";
import MySnackBar from "../../components/MySnackBar";
import { AlertContext } from "../../contexts/AlertContext";

export default function AllSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("");
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");

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
            <Table bordered>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Question Bank</th>
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
                      <Link href={`/subjects/view/${c._id}`}>view</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="col-lg-4 p-4 rounded-3">
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
                  >
                    Create
                  </LoadingButton>
                </div>
              </form>
            </div>
            <Link href="/subjects/questionimages">
              View images for questions
            </Link>
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
