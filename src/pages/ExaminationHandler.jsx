import React from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  FormGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

import { pink } from "@mui/material/colors";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
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
  const [questionBanks, setQuestionBanks] = useState([]);

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

  const existed = (text) => {
    const exist = questionBanks.find((c) => c.text === text);

    if (exist) return true;
    return false;
  };

  const createExamination = () => {
    Swal.fire({
      icon: "question",
      title: "Please confirm",
      text: "Do you wish to create this examination?",
      showCancelButton: true,
    }).then(async () => {});
  };
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
                </Stack>
              </div>
              <div className="mt-3">
                <div className="col-md-4">
                  <Typography variant="body2" color="GrayText">
                    Create the questions for this examination from different
                    question banks under each paper type
                  </Typography>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6">
                    <div>
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
                            <FormGroup aria-label="position" row>
                              {c.questionBanks.map((d, p) => (
                                <FormControlLabel
                                  key={p}
                                  value={d}
                                  control={
                                    <Checkbox
                                      icon={<FavoriteBorder />}
                                      checkedIcon={<Favorite />}
                                      onChange={(e) => {
                                        if (
                                          e.target.checked &&
                                          !existed(
                                            `${c.examType} Bank ${p + 1}`
                                          )
                                        ) {
                                          setQuestionBanks((oldArray) => [
                                            ...oldArray,
                                            {
                                              value: e.target.value,
                                              text: `${c.examType} Bank ${
                                                p + 1
                                              }`,
                                            },
                                          ]);
                                        } else if (
                                          !e.target.checked &&
                                          existed(`${c.examType} Bank ${p + 1}`)
                                        ) {
                                          const newBank = questionBanks.filter(
                                            (c) => c.value !== e.target.value
                                          );
                                          setQuestionBanks(newBank);
                                        }
                                      }}
                                      sx={{
                                        color: pink[800],
                                        "&.Mui-checked": {
                                          color: pink[600],
                                        },
                                      }}
                                    />
                                  }
                                  label={`Bank ${p + 1}`}
                                  labelPlacement="end"
                                />
                              ))}
                            </FormGroup>
                          </FormControl>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6 border-start">
                    <div className="p-4 shadow rounded">
                      <div>
                        <Typography variant="h3" fontWeight={600}>
                          {examTitle}
                        </Typography>
                      </div>
                      <div className="mt-2 mb-5">
                        <Typography color="GrayText">
                          Selected Question banks
                        </Typography>
                        <div className="mt-4">
                          {questionBanks.map((c, i) => (
                            <Typography gutterBottom key={i}>
                              <i class="fas fa-arrow-right    "></i> {c.text}
                            </Typography>
                          ))}
                        </div>
                        <div className="mt-4">
                          <Button
                            variant="outlined"
                            disabled={questionBanks.length === 0 ? true : false}
                            onClick={createExamination}
                          >
                            Create examination
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
