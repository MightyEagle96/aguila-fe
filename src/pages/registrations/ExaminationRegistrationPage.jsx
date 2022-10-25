import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import {
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  MenuItem,
} from "@mui/material";
import Swal from "sweetalert2";
import { examTowns, states } from "../../utils";

function ExaminationRegistrationPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const [regData, setRegData] = useState({});

  const handleChange = (e) => {
    setRegData({ ...regData, [e.target.name]: e.target.value });
  };
  const examRegistrationPage = async () => {
    const path = `exam/${id}`;

    const res = await httpService(path);

    if (res) {
      setRegData({ ...regData, examination: res.data._id });
      setData(res.data);
    }
  };
  const addPrograms = (value) => {
    setSelectedSubjects((old) => [...old, value]);
  };

  const removeProgram = (value) => {
    const filtered = selectedSubjects.filter((c) => c !== value);
    setSelectedSubjects(filtered);
  };

  const register = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Complete registration",
      text: "Do you wish to submit",
      showCancelButton: true,
    }).then(async () => {
      const path = "register";

      const res = await httpService.post(path, {
        ...regData,
        subjectCombinations: selectedSubjects,
      });

      if (res) {
        console.log(res.data);
        Swal.fire({ icon: "success", text: res.data, title: "SUCCESS" });
      }
    });
  };
  useEffect(() => {
    examRegistrationPage();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          {data ? (
            <div>
              <Typography variant="h4" fontWeight={600}>
                {data.title} Registration Portal
              </Typography>

              <div className="mt-3">
                <div className="col-lg-4">
                  <form onSubmit={register}>
                    <div className="mb-3">
                      <TextField
                        fullWidth
                        label="First Name"
                        required
                        name="firstName"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <TextField
                        fullWidth
                        label="Last Name"
                        required
                        name="lastName"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="mb-3">
                      <Typography variant="caption">
                        Subject Combinations
                      </Typography>
                      <FormGroup>
                        {data.subjects.map((c) => (
                          <FormControlLabel
                            control={<Checkbox />}
                            label={c.name}
                            value={c._id}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addPrograms(e.target.value);
                              } else removeProgram(e.target.value);
                            }}
                          />
                        ))}
                      </FormGroup>
                    </div>
                    <div className="mb-3">
                      <TextField
                        select
                        fullWidth
                        label="Exam State"
                        name="examState"
                        onChange={handleChange}
                      >
                        {states.map((c, i) => (
                          <MenuItem value={c} key={i}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="mb-3">
                      <TextField
                        select
                        fullWidth
                        label="Exam Town"
                        name="examTown"
                        onChange={handleChange}
                      >
                        {examTowns.map((c, i) => (
                          <MenuItem value={c} key={i}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <Button variant="contained" type="submit">
                      Register
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ExaminationRegistrationPage;
