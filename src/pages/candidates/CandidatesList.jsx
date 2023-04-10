import { CircularProgress, TextField, Typography, Chip } from "@mui/material";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import React, { useEffect, useState } from "react";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";
import MySnackBar from "../../components/MySnackBar";
import MyPagination from "../../components/MyPagination";
import { Table } from "react-bootstrap";
export default function CandidatesList() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [limit, setLimit] = useState(0);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");

  const [totalCandidates, setTotalCandidates] = useState(0);
  const [results, setResults] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const [unassigned, setUnassigned] = useState(0);

  const getExamination = async () => {
    setLoading(true);

    const { data } = await httpService(`aguila/examination/${id}`);
    if (data) {
      setExamination(data);
    }
    setLoading(false);
  };

  const createDummyCandidates = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: `Create ${limit.toLocaleString()} dummy candidates?`,
      showCancelButton: true,
    }).then(async (result) => {
      setCreating(true);
      if (result.isConfirmed) {
        const { data, error } = await httpService.post(
          `aguila/candidates/${id}/createdummy`,
          { limit }
        );

        if (data) {
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

  const getCandidates = async () => {
    const { data } = await httpService(
      `aguila/candidates/${id}?page=${1}&limit=${50}`
    );

    if (data) {
      setResults(data.results);
      setStartIndex(data.startIndex);
      setTotalCandidates(data.allResultsLength);
      setAssigned(data.assigned);
      setUnassigned(data.unassigned);
    }
  };

  useEffect(() => {
    getExamination();
    getCandidates();
  }, []);
  return (
    <div className="mt-5 mb-5 p-3">
      <div>
        {loading && <CircularProgress />}
        {examination && (
          <>
            <div className="row">
              <div className="alert alert-light col-lg-6 shadow-sm">
                <Typography
                  textTransform={"uppercase"}
                  variant="h4"
                  fontWeight={600}
                >
                  {examination.title}
                </Typography>
                <hr />
                <Typography>Candidates List</Typography>
              </div>
              <div className="col-lg-4">
                <Typography gutterBottom>Dummy Candidates</Typography>
                <form onSubmit={createDummyCandidates}>
                  <TextField
                    limit
                    type="number"
                    min={1}
                    onChange={(e) => setLimit(e.target.value)}
                  />
                  <LoadingButton
                    loading={creating}
                    loadingPosition="end"
                    type="submit"
                    endIcon={<Save />}
                  >
                    create
                  </LoadingButton>
                </form>
              </div>
            </div>

            <div className="">
              <div className="row mb-4">
                <div
                  className="col-lg-3 p-3"
                  style={{ backgroundColor: "#fdb874" }}
                >
                  <Typography>
                    Total Candidates: {totalCandidates.toLocaleString()}
                  </Typography>
                </div>
                <div
                  className="col-lg-3 p-3"
                  style={{ backgroundColor: "#b088ad", color: "white" }}
                >
                  <Typography>
                    Unassigned Candidates: {unassigned.toLocaleString()}
                  </Typography>
                </div>
                <div
                  className="col-lg-3 p-3"
                  style={{ backgroundColor: "#1d2b67", color: "white" }}
                >
                  <Typography>
                    Assigned Candidates: {assigned.toLocaleString()}
                  </Typography>
                </div>
              </div>
              <Table bordered>
                <thead>
                  <th>
                    <Typography>S/N</Typography>
                  </th>
                  <th>
                    <Typography>First Name</Typography>
                  </th>
                  <th>
                    <Typography>Last Name</Typography>
                  </th>
                  <th>
                    <Typography>Registration Number</Typography>
                  </th>
                  <th>
                    <Typography>Subject Combinations</Typography>
                  </th>
                </thead>
                <tbody>
                  {results.length > 0 ? (
                    <>
                      {results.map((c, i) => (
                        <tr key={i}>
                          <td className="col-lg-1">
                            <Typography>{startIndex + i}</Typography>
                          </td>
                          <td>
                            <Typography>{c.firstName}</Typography>
                          </td>
                          <td>
                            <Typography>{c.lastName}</Typography>
                          </td>
                          <td>
                            <Typography textTransform={"uppercase"}>
                              {c.registrationNumber}
                            </Typography>
                          </td>
                          <td className="d-flex flex-wrap">
                            {c.subjectCombinations.map((d, i) => (
                              <Chip
                                className="me-1"
                                key={i}
                                label={
                                  <Typography textTransform={"capitalize"}>
                                    {d.name}
                                  </Typography>
                                }
                              />
                            ))}
                          </td>
                        </tr>
                      ))}
                    </>
                  ) : (
                    <tr>
                      <td colSpan={12} className="mt-5 mb-5">
                        <Typography textAlign={"center"}>
                          NO DATA FOUND
                        </Typography>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </div>
      <MySnackBar
        open={open}
        setOpen={setOpen}
        message={message}
        severity={severity}
      />
      <MyPagination
        rootPath={`aguila/candidates/${id}?`}
        setResults={setResults}
        setStartIndex={setStartIndex}
      />
    </div>
  );
}
