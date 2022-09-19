import { Button, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Alert, Badge } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { httpService } from "../httpService";
import Swal from "sweetalert2";

export default function QuestionBank() {
  const { id } = useParams();
  const [examType, setExamType] = useState(null);
  const [questionBanks, setQuestionBanks] = useState([]);

  const getExamType = async () => {
    const path = `viewExamType/${id}`;
    const res = await httpService.get(path);
    if (res) {
      setExamType(res.data);
    }
  };

  const viewQuestionBanks = async () => {
    const path = `viewQuestionBanks/${id}`;

    const res = await httpService.get(path);

    if (res) {
      setQuestionBanks(res.data);
    }
  };

  useEffect(() => {
    getExamType();
    viewQuestionBanks();
  }, []);

  const createExamType = () => {
    Swal.fire({
      icon: "question",
      title: "Create Question bank",
      showCancelButton: true,
      text: "Do you wish to create a new question bank under this examination type?",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "createQuestionBank";

        const res = await httpService.post(path, { examType: id });
        getExamType();
        viewQuestionBanks();
        if (res) {
          Swal.fire({
            icon: "success",
            title: "SUCCESS",
            text: res.data,
            showConfirmButton: false,
            timer: 3000,
          });
        }
      }
    });
  };
  return (
    <div>
      <div className="container">
        {examType ? (
          <div className="mb-3">
            <Alert>
              <Typography variant="h4" gutterBottom>
                {examType.examType}
              </Typography>
              <Typography>
                Question Banks: {examType.questionBanks.length}
              </Typography>
            </Alert>
            <div className="mt-2">
              <Button
                onClick={createExamType}
                endIcon={<i class="fas fa-plus    "></i>}
                color="error"
              >
                New question bank
              </Button>
            </div>
            <div className="mt-2 d-flex flex-wrap">
              {questionBanks.map((c, i) => (
                <div className="col-md-3 me-2 p-3 shadow rounded">
                  <Typography fontWeight={600} gutterBottom>
                    Bank {i + 1}
                  </Typography>
                  <div className="d-flex justify-content-between">
                    <Typography variant="caption" fontStyle={"italic"}>
                      Questions: {c.questions.length}
                    </Typography>
                    {c.isTaken ? (
                      <Badge>Taken</Badge>
                    ) : (
                      <Badge bg="danger">Not taken</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
