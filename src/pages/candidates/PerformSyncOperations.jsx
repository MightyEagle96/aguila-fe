import {
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
  InputAdornment,
  LinearProgress,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { httpService } from "../../httpService";
import { House, Person, Schedule } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { AlertContext } from "../../contexts/AlertContext";
import Swal from "sweetalert2";

export default function PerformSyncOperations() {
  //select the exam

  const [activeExam, setActiveExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [examCentres, setExamCentres] = useState([]);
  const [selected, setSelected] = useState([]);
  const [candidateData, setCandidateData] = useState({});
  const { setAlertData } = useContext(AlertContext);
  const [creating, setCreating] = useState(false);

  const selectSubject = (e) => {
    if (e.target.checked) {
      setSelected([...selected, e.target.value]);
    } else {
      const filtered = selected.filter((c) => c !== e.target.value);
      setSelected(filtered);
    }
  };
  const getExams = async () => {
    setLoading(true);
    const { data, error } = await httpService("aguila/examination/active");

    if (data) {
      setActiveExam(data);

      //get the centres for the exam
      const res2 = await httpService(
        `aguila/centres/centresforexam/${data.examination._id}`
      );

      if (res2.data) setExamCentres(res2.data);
      if (res2.error)
        setAlertData({ severity: "error", message: res2.error, open: true });
    }
    if (error) setAlertData({ severity: "error", message: error, open: true });
    setLoading(false);
  };

  useEffect(() => {
    getExams();
  }, []);

  const handleChange = (e) =>
    setCandidateData({
      ...candidateData,
      [e.target.name]: e.target.value.trim(),
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Perform Sync",
      text: "Do you wish to proceed with this sync operation on this candidate?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCreating(true);
        const { data, error } = await httpService.post(
          "aguila/candidates/createsync",
          {
            ...candidateData,
            subjectCombinations: selected,
            examination: activeExam.examination._id,
          }
        );

        if (data) {
          setAlertData({ message: data, open: true, severity: "success" });
          setTimeout(() => {
            window.location.assign(
              `/candidates/${activeExam.examination._id}/list`
            );
          }, 3000);
        }

        if (error) {
          setAlertData({ message: error, open: true, severity: "error" });
        }
        setCreating(false);
      }
    });
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="col-lg-4 alert alert-light mb-2">
          <Typography variant="h4" fontWeight={600}>
            SYNC OPERATION
          </Typography>
        </div>
        <div className="mb-2">{loading && <LinearProgress />}</div>
        {activeExam && (
          <div>
            <div className="alert alert-success col-lg-4 mb-2">
              <Typography variant="caption" gutterBottom>
                Active Exam
              </Typography>
              <Typography
                variant="h4"
                fontWeight={700}
                textTransform={"uppercase"}
              >
                {activeExam.examination.title}
              </Typography>
            </div>
            <div>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-lg-4">
                    <div className="mb-3">
                      <Typography variant="caption" gutterBottom>
                        Candidate's Details
                      </Typography>
                    </div>

                    <div className="mb-4">
                      <TextField
                        label="First Name"
                        fullWidth
                        name="firstName"
                        onChange={handleChange}
                        variant="standard"
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div className="mb-4">
                      <TextField
                        label="Last Name"
                        fullWidth
                        variant="standard"
                        name="lastName"
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                    <div className="mb-2">
                      <Typography variant="caption">
                        Select the subject combination for this candidate
                      </Typography>
                      {activeExam.examination.subjects.map((c, i) => (
                        <div>
                          <FormControlLabel
                            key={i}
                            onChange={selectSubject}
                            control={<Checkbox />}
                            value={c._id}
                            label={
                              <Typography textTransform={"capitalize"}>
                                {c.name}
                              </Typography>
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="mb-4">
                      <TextField
                        variant="standard"
                        fullWidth
                        required
                        select
                        name="centre"
                        onChange={handleChange}
                        label="Select the candidate's centre"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <House />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {examCentres.map((c) => (
                          <MenuItem value={c._id}>Centre {c.centreId}</MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="mb-4">
                      <TextField
                        variant="standard"
                        fullWidth
                        required
                        select
                        name="examSession"
                        onChange={handleChange}
                        label="Sessions List"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Schedule />
                            </InputAdornment>
                          ),
                        }}
                      >
                        {activeExam.examSessions.map((c) => (
                          <MenuItem value={c._id}>{c.session}</MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div>
                      <LoadingButton
                        color="success"
                        variant="contained"
                        fullWidth
                        type="submit"
                        loading={creating}
                      >
                        create this candidate
                      </LoadingButton>

                      <div className="mt-2 ">
                        <Typography variant="body2">
                          Once the candidate has been created and assigned to a
                          centre under a particular session, please inform the
                          techincal officer at that centre to perform a
                          synchronization to download the new candidate(s)
                          assigned to that centre
                        </Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
