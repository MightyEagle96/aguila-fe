import React from "react";
import {
  Button,
  IconButton,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { httpService } from "../httpService";
import { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ExaminationHandler() {
  const [examinationTypes, setExaminationTypes] = useState([]);
  const [examType, setExamType] = useState("");
  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

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

  const deleteExamType = (id) => {
    Swal.fire({
      icon: "question",
      title: "Delete examination type",
      text: "Are you sure you want to delete this examination type and all the questions with it?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = `deleteExamType/${id}`;

        const res = await httpService.delete(path);

        if (res) {
          Swal.fire({
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            text: res.data,
          });
          viewExaminationTypes();
        }
      }
    });
  };

  useEffect(() => {
    viewExaminationTypes();
  }, []);
  return (
    <div>
      <div className="mt-3 mb-3">
        <div className="container">
          <div className="p-3 border">
            <div className="d-flex justify-content-between">
              <div>
                <Typography fontWeight={600} variant="h5" gutterBottom>
                  EXAMINATION CONTROL
                </Typography>
              </div>
              <div>{processLoading ? <Spinner animation="grow" /> : null}</div>
            </div>

            <div className="mt-2 col-md-5">
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
            <div className="mt-3 d-flex flex-wrap">
              {examinationTypes.map((c) => (
                <div className="p-3 rounded shadow me-2 mb-2 col-md-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <Typography variant="h6">{c.examType}</Typography>
                    </div>
                    <div>
                      <IconButton
                        onClick={() => {
                          deleteExamType(c._id);
                        }}
                      >
                        <i class="fas fa-trash    "></i>
                      </IconButton>
                    </div>
                  </div>
                  <hr />
                  <Stack direction="row" spacing={3}>
                    <div className="d-flex align-items-center">
                      <Typography variant="subtitle2">
                        Exam Questions: {c.questions.length}
                      </Typography>
                    </div>
                    <div>
                      <Link href={`/examination/${c._id}`} underline="hover">
                        Populate
                      </Link>
                    </div>
                  </Stack>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
