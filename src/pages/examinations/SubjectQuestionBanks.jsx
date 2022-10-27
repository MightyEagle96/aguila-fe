import { Button, Typography, CardActionArea } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { Alert } from "react-bootstrap";
import { Badge } from "react-bootstrap";
import Swal from "sweetalert2";

export default function SubjectQuestionBanks() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const getSubjectDetails = async () => {
    const path = `/viewSubjectDetails/${id}`;

    const res = await httpService(path);
    if (res) {
      setData(res.data);
    }
  };

  useEffect(() => {
    getSubjectDetails();
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

        const res = await httpService.post(path, { subject: id });
        getSubjectDetails();
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
      {data && data.subject ? (
        <div className="mt-5 mb-5">
          <div>
            <Typography variant="h4" fontWeight={600} color="GrayText">
              {data.subject.name}
            </Typography>
          </div>
          <div className="mt-2">
            <div className="row">
              <div className="col-md-3">
                <Alert>
                  <Typography>
                    Question Banks: {data.questionBanks.length}
                  </Typography>
                </Alert>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <div className="container">
              {data.questionBanks ? (
                <div className="mb-3">
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
                    {data.questionBanks.map((c, i) => (
                      <div className="col-md-3 me-2 mb-2">
                        <CardActionArea
                          className="p-3 shadow rounded"
                          onClick={() =>
                            window.location.assign(
                              `/postExamQuestions/${c._id}`
                            )
                          }
                        >
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
                        </CardActionArea>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
