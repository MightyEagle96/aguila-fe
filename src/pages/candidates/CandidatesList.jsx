import {
  TextField,
  Typography,
  Chip,
  Link,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import React, { useEffect, useState, useContext } from "react";
import { Delete, Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";
import MyPagination from "../../components/MyPagination";
import { Badge, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { AlertContext } from "../../contexts/AlertContext";

export default function CandidatesList() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [limit, setLimit] = useState(0);

  const [totalCandidates, setTotalCandidates] = useState(0);
  const [results, setResults] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [assigned, setAssigned] = useState(0);
  const [unassigned, setUnassigned] = useState(0);
  const [file, setFile] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { setAlertData } = useContext(AlertContext);

  const deleteCandidates = () => {
    Swal.fire({
      icon: "question",
      title: "Delete all candidates",
      text: "Are you sure you want to delete all candidates?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        const { data, error } = await httpService.delete(
          `aguila/candidates/${id}/delete`
        );
        if (data) {
          setAlertData({ open: true, message: data, severity: "success" });
          getCandidates();
        }

        if (error)
          setAlertData({ open: true, message: error, severity: "error" });

        setDeleting(false);
      }
    });
  };
  const getExamination = async () => {
    setLoading(true);

    const { data } = await httpService(`aguila/examination/${id}/view`);
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
          setAlertData({ open: true, severity: "success", message: data });
        }
        if (error) {
          setAlertData({ open: true, severity: "error", message: error });
        }
        setCreating(false);
      }
    });
  };

  const getCandidates = async () => {
    const { data } = await httpService(
      `aguila/candidates/${id}/view?page=${1}&limit=${50}`
    );

    if (data) {
      setResults(data.results);
      setStartIndex(data.startIndex);
      setTotalCandidates(data.allResultsLength);
      setAssigned(data.assigned);
      setUnassigned(data.unassigned);
    }
  };

  const uploadFile = async () => {
    const formData = new FormData();

    formData.append("candidateFile", file, file.name);
    const { data, error } = await httpService.post(
      `aguila/candidates/${id}/uploadcandidates`,
      formData
    );

    if (data) {
      getCandidates();
      setAlertData({ open: true, message: data, severity: "success" });
    }

    if (error) setAlertData({ open: true, message: error, severity: "error" });
    getCandidates();
  };

  useEffect(() => {
    getExamination();
    getCandidates();
  }, []);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
  return (
    <div className="mt-5 mb-5 p-3">
      <div>
        {loading && <LinearProgress />}
        {examination && (
          <>
            <div className="row mb-4">
              <div className="col-lg-6 border-end ">
                <Typography
                  textTransform={"uppercase"}
                  variant="h4"
                  fontWeight={600}
                  gutterBottom
                >
                  {examination.title}
                </Typography>

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

            <div className="col-lg-4 mb-3">
              <label for="formFile" className="form-label">
                <Typography variant="overline">
                  Select an excel or csv file
                </Typography>
              </label>
              <input
                class="form-control"
                type="file"
                id="formFile"
                accept=".xlsx,.csv"
                onChange={handleChange}
              />
              <div className="mt-1">
                {file && (
                  <div>
                    <Typography gutterBottom textTransform={"uppercase"}>
                      {file.name}
                    </Typography>
                    <LoadingButton
                      onClick={uploadFile}
                      startIcon={<FontAwesomeIcon icon={faUpload} />}
                    >
                      Upload file
                    </LoadingButton>
                  </div>
                )}
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
              <div className="mt-2 mb-2">
                <Link underline="none" href={`/candidates/performsync/${id}`}>
                  PERFORM SYNC OPERATION
                </Link>
              </div>
              <div className="mt-2 mb-2 text-end">
                <LoadingButton
                  color="error"
                  onClick={deleteCandidates}
                  loading={deleting}
                  loadingPosition="start"
                  startIcon={<Delete />}
                >
                  delete all candidates
                </LoadingButton>
              </div>
              <Table borderless striped>
                <thead>
                  <th>S/N</th>
                  <th>First Name</th>
                  <th>Middle Name</th>
                  <th>Last Name</th>
                  <th>Registration Number</th>
                  <th>Subject Combinations</th>
                  <th>Error</th>
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
                            <Typography>{c.middleName || "-"}</Typography>
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
                          <td>
                            {c.errorMessage ? (
                              <Tooltip title={c.errorMessage} placement="top">
                                <Badge bg="danger">Has Error</Badge>
                              </Tooltip>
                            ) : (
                              <Badge bg="success">No Error</Badge>
                            )}
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

      <MyPagination
        rootPath={`aguila/candidates/${id}/view?`}
        setResults={setResults}
        setStartIndex={setStartIndex}
      />
    </div>
  );
}
