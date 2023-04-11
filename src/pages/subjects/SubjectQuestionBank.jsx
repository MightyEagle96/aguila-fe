import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { CircularProgress, IconButton, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AlertContext } from "../../contexts/AlertContext";
import { Table } from "react-bootstrap";
import { Delete } from "@mui/icons-material";

export default function SubjectQuestionBank() {
  const { id } = useParams();
  const { setAlertData } = useContext(AlertContext);
  const [questionBank, setQuestionBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionFile, setQuestionFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const getQuestionBank = async () => {
    setLoading(true);
    const { data } = await httpService(
      `aguila/subject/questionbank/findone/${id}`
    );

    if (data) {
      setQuestionBank(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getQuestionBank();
  }, []);

  const handleFileUpload = async (e) => {
    e.preventDefault();

    setUploading(true);
    let formData = new FormData();

    formData.append("questionFile", questionFile, questionFile.name);
    const path = `aguila/subject/questionbank/upload/${id}`;
    const { data, error } = await httpService.post(path, formData);

    if (error) {
      setAlertData({
        message: error,
        severity: "error",
        open: true,
      });
    }

    if (data) {
      setAlertData({
        message: data,
        severity: "success",
        open: true,
      });

      getQuestionBank();
    }

    setQuestionFile(null);
    setUploading(false);
  };

  const deleteAllQuestions = async () => {
    setDeleting(true);
    const { data } = await httpService(
      `aguila/subject/questionbank/deletequestions/${id}`
    );
    if (data) {
      setAlertData({
        message: data,
        severity: "success",
        open: true,
      });

      getQuestionBank();
    }
    setDeleting(false);
  };
  return (
    <div className="mt-5 mb-5 p-3">
      {loading && <CircularProgress />}
      {questionBank && (
        <div>
          <div className="alert alert-light col-lg-6 shadow-sm">
            <Typography variant="caption" gutterBottom>
              Question bank for
            </Typography>
            <Typography
              textTransform={"uppercase"}
              variant="h4"
              fontWeight={700}
            >
              {questionBank.subject.name}
            </Typography>
          </div>
          <div className="col-lg-4">
            <div>
              <div>
                <form encType="multipart/form-data" onSubmit={handleFileUpload}>
                  <label for="formFile" class="form-label">
                    Upload examination questions
                  </label>
                  <input
                    class="form-control"
                    type="file"
                    id="questionFile"
                    accept=".xlsx, .csv"
                    name="questionFile"
                    onChange={(e) => setQuestionFile(e.target.files[0])}
                  />
                  <LoadingButton
                    type="submit"
                    className="mt-2"
                    endIcon={<i class="fas fa-file-excel    "></i>}
                    loading={uploading}
                    loadingPosition="end"
                    disabled={!questionFile}
                  >
                    upload questions
                  </LoadingButton>
                </form>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <LoadingButton
              loading={deleting}
              onClick={deleteAllQuestions}
              loadingPosition="end"
              endIcon={<Delete />}
              color="error"
            >
              delete all questions
            </LoadingButton>
          </div>
          <div className="mt-3">
            <Table bordered>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Question</th>
                  <th>Option A</th>
                  <th>Option B</th>
                  <th>Option C</th>
                  <th>Option D</th>
                  <th>Correct Answer</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {questionBank.questions.map((c, i) => (
                  <tr key={i}>
                    <td className="col-sm-1">
                      <Typography>{i + 1}</Typography>
                    </td>
                    <td className="col-lg-4">
                      <Typography>{c.question}</Typography>
                    </td>
                    <td className="col-lg-1">
                      <Typography>{c.optionA}</Typography>
                    </td>
                    <td className="col-lg-1">
                      <Typography>{c.optionB}</Typography>
                    </td>
                    <td className="col-lg-1">
                      <Typography>{c.optionC}</Typography>
                    </td>

                    <td className="col-lg-1">
                      <Typography>{c.optionD}</Typography>
                    </td>
                    <td className="col-lg-1">
                      <Typography>{c.correctAns}</Typography>
                    </td>
                    <td className="col-lg-1">
                      <DeleteQuestion />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

function DeleteQuestion() {
  return (
    <IconButton>
      <Delete />
    </IconButton>
  );
}
