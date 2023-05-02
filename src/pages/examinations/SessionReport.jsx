import React, { useState, useEffect, useContext } from "react";
import {
  TextField,
  Typography,
  MenuItem,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { httpService } from "../../httpService";
import { sessionsList } from "./route";
import { LoadingButton } from "@mui/lab";
import { Alert, Table } from "react-bootstrap";
import { DownloadOutlined, UploadOutlined } from "@mui/icons-material";
import { AlertContext } from "../../contexts/AlertContext";

export default function SessionReport() {
  const [examinations, setExaminations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({});
  const [message, setMessage] = useState("");
  const [reports, setReports] = useState([]);
  const [fetching, setFetching] = useState(false);

  const { setAlertData } = useContext(AlertContext);

  const getExaminations = async () => {
    setLoading(true);
    const { data } = await httpService.get("aguila/examination/all");
    if (data) {
      setExaminations(data);
      if (data.length === 0) setMessage("No examination has been created");
    }
    setLoading(false);
  };

  useEffect(() => {
    getExaminations();
  }, []);

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFetching(true);

    const { data, error } = await httpService.post(
      "aguila/examination/examsessionreport",
      searchData
    );

    if (data) {
      setReports(data);
    }
    if (error) {
      setAlertData({ message: error, open: true, severity: "error" });
    }
    setFetching(false);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="col-lg-3">
          <Typography variant="h4" sx={{ color: "#4b4b4b" }} fontWeight={600}>
            SESSION REPORT
          </Typography>
        </div>
        <div className="mt-3">
          {loading && <CircularProgress sx={{ color: "#4b4b4b" }} size={20} />}
          {message && (
            <div className="col-lg-4">
              <Alert variant="danger">{message}</Alert>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-lg-3">
                <TextField
                  label="Select Exam"
                  name="examination"
                  onChange={handleChange}
                  select
                  fullWidth
                >
                  {examinations.map((c) => (
                    <MenuItem value={c._id}>
                      <Typography textTransform={"uppercase"}>
                        {c.title}
                      </Typography>
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="col-lg-3">
                <Stack direction="row" spacing={1}>
                  <div className="d-flex align-items-center">
                    {/* <Typography variant="caption">select date</Typography> */}
                    <Chip label="Select Date" color="primary" />
                  </div>
                  <DatePicker
                    onChange={(e) =>
                      setSearchData({
                        ...searchData,
                        dateDownloaded: new Date(e.$d).toDateString(),
                      })
                    }
                  />
                </Stack>
              </div>
              <div className="col-lg-3">
                <TextField
                  select
                  label="Session List"
                  fullWidth
                  name="session"
                  onChange={handleChange}
                >
                  {sessionsList().map((c) => (
                    <MenuItem value={c}>{c}</MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="col-lg-2 d-flex align-items-center">
                <LoadingButton variant="contained" type="submit">
                  find report
                </LoadingButton>
              </div>
            </div>
          </form>
        </div>
        <div className="mt-3">
          <Table striped borderless>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Centre ID</th>
                <th>Name</th>
                <th>
                  Time Downloaded <DownloadOutlined />
                </th>
                <th>
                  Time Uploaded <UploadOutlined />
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((c, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>
                    <Typography>{c.centre.centreId}</Typography>
                  </td>
                  <td className="col-lg-4">
                    <Typography textTransform={"uppercase"}>
                      {c.centre.name}
                    </Typography>
                  </td>
                  <td>
                    <Typography>
                      {new Date(c.timeDownloaded).toLocaleTimeString()}
                    </Typography>
                  </td>
                  <td>
                    {c.timeUploaded ? (
                      <Typography>
                        {new Date(c.timeDownloaded).toLocaleTimeString()}
                      </Typography>
                    ) : (
                      <Chip label="pending" color="warning" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
