import React from "react";
import {
  Button,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { httpService } from "../httpService";
import { useState, useEffect } from "react";
import { Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ExaminationHandler() {
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [examType, setExamType] = useState("");
  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [examTitle, setExamTitle] = useState("");

  const createExamType = async (e) => {
    e.preventDefault();
    const path = "createExamType";
    const res = await httpService.post(path, { examType });

    if (res) {
      setExamType("");
      Swal.fire({
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        text: res.data,
      });
      viewExaminationTypes();
    }
  };

  const viewExaminationTypes = async () => {
    setLoading(true);
    const path = "viewExamTypes";

    const res = await httpService(path);

    if (res) {
      console.log(res.data);
      setExaminationTypes(res.data);
      setLoading(false);
    }
    setLoading(false);
  };

  // const deleteExamType = (id) => {
  //   Swal.fire({
  //     icon: "question",
  //     title: "Delete examination type",
  //     text: "Are you sure you want to delete this examination type and all the questions with it?",
  //     showCancelButton: true,
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       const path = `deleteExamType/${id}`;

  //       const res = await httpService.delete(path);

  //       if (res) {
  //         Swal.fire({
  //           icon: "success",
  //           timer: 2000,
  //           showConfirmButton: false,
  //           text: res.data,
  //         });
  //         viewExaminationTypes();
  //       }
  //     }
  //   });
  // };

  useEffect(() => {
    viewExaminationTypes();
  }, []);
  return (
    <div>
      <div className="mt-3 mb-3">
        <div className="container">
          <div>
            <div className="d-flex justify-content-between">
              <div>
                <Typography fontWeight={600} variant="h5" gutterBottom>
                  EXAMINATION CONTROL
                </Typography>
              </div>
              <div>{processLoading ? <Spinner animation="grow" /> : null}</div>
            </div>

            <div className="row">
              <div className="col-md-5">
                <form onSubmit={createExamType}>
                  <TextField
                    label="Examination Type"
                    fullWidth
                    required
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                  />
                  <br />
                  <Button variant="contained" className="mt-2" type="submit">
                    {loading ? <Spinner animation="border" /> : "create"}
                  </Button>
                </form>
              </div>
              <div className="col-md-7 border-start">
                <Typography gutterBottom>Created Examination Types</Typography>

                <Table>
                  <thead border>
                    <tr>
                      <th>Exam Type</th>
                      <th>Sets</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examinationTypes.map((c, i) => (
                      <tr
                        key={i}
                        onClick={() =>
                          window.location.assign(`/questionBank/${c._id}`)
                        }
                        className="myTable"
                      >
                        <td>{c.examType}</td>
                        <td>{c.questionBanks.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>

            <div className="border border-info rounded p-3 mt-3">
              <Typography textTransform="uppercase" variant="h5">
                Create Examination to download
              </Typography>

              <div className="mt-4">
                <Stack direction="row" spacing={2}>
                  <div>
                    <TextField
                      label="Examination Title"
                      helperText="Enter the name of this examination"
                      onChange={(e) => setExamTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Typography variant="h3" fontWeight={600}>
                      {examTitle}
                    </Typography>
                  </div>
                </Stack>
              </div>
              <div className="mt-3">
                <div className="col-md-4">
                  <Typography variant="body2" color="GrayText">
                    Create the questions for this examination from different
                    question banks under each paper type
                  </Typography>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="mt-4">
                      {examinationTypes.map((c, i) => (
                        <div key={i} className="p-3 mb-2 shadow rounded">
                          <Typography
                            fontWeight={600}
                            textTransform={"uppercase"}
                            gutterBottom
                          >
                            {c.examType}
                          </Typography>
                          <FormControl>
                            <FormLabel id="demo-row-radio-buttons-group-label">
                              Question Banks
                            </FormLabel>
                            <RadioGroup
                              row
                              aria-labelledby="demo-row-radio-buttons-group-label"
                              name="row-radio-buttons-group"
                            >
                              {c.questionBanks.map((d, p) => (
                                <FormControlLabel
                                  value={d}
                                  control={<Radio />}
                                  label={`Bank ${p + 1}`}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
