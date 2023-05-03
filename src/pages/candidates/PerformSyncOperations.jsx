import {
  CircularProgress,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  MenuItem,
} from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { httpService } from "../../httpService";
export default function PerformSyncOperations() {
  //select the exam
  const [activeExam, setActiveExam] = useState(null);
  const [loading, setLoading] = useState(false);
  const [examCentres, setExamCentres] = useState([]);
  const [selected, setSelected] = useState([]);

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
    const { data } = await httpService("aguila/examination/active");

    if (data) {
      setActiveExam(data);

      //get the centres for the exam
      const res2 = await httpService(
        `aguila/centres/centresforexam/${data._id}`
      );

      setExamCentres(res2.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getExams();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="col-lg-4 alert alert-light mb-2">
          <Typography variant="h4" fontWeight={600}>
            SYNC OPERATION
          </Typography>
        </div>
        {loading && <CircularProgress />}
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
                {activeExam.title}
              </Typography>
            </div>
            <div>
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
                      variant="standard"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <TextField
                      label="Last Name"
                      fullWidth
                      variant="standard"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <Typography variant="caption">
                      Select the subject combination for this candidate
                    </Typography>
                    {activeExam.subjects.map((c, i) => (
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
                  <TextField
                    variant="standard"
                    fullWidth
                    select
                    label="Select the candidate's centre"
                  >
                    {examCentres.map((c) => (
                      <MenuItem value={c._id}>Centre{c.centreId}</MenuItem>
                    ))}
                  </TextField>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
