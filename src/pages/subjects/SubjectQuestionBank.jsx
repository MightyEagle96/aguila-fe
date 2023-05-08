import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AlertContext } from "../../contexts/AlertContext";
import { Table } from "react-bootstrap";
import { Camera, Delete, Edit } from "@mui/icons-material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";

export default function SubjectQuestionBank() {
  const { id } = useParams();
  const { setAlertData } = useContext(AlertContext);
  const [questionBank, setQuestionBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionFile, setQuestionFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showQuestionField, setShowQuestionField] = useState(false);

  const [questionData, setQuestionData] = useState(null);
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
            <Button href={`/subjects/previewexam/${id}`}>preview exam</Button>
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
          <div className="mt-2">
            <Button onClick={() => setShowQuestionField(!showQuestionField)}>
              {showQuestionField
                ? "hide questions field"
                : "show questions field"}
            </Button>
            {showQuestionField ||
              (questionData && (
                <EnterQuestionText
                  questionData={questionData}
                  setQuestionData={setQuestionData}
                />
              ))}
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
                  <th>Edit</th>
                  <th>Delete</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {questionBank.questions.map((c, i) => (
                  <tr key={i}>
                    <td>
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
                    <td>
                      <EditQuestion
                        subject={questionBank.subject}
                        questionId={c._id}
                        setQuestionData={setQuestionData}
                      />
                    </td>
                    <td>
                      <DeleteQuestion />
                    </td>
                    <td>
                      <UploadQuestionImage />
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

function DeleteQuestion({ subject, questionId }) {
  return (
    <IconButton>
      <Delete />
    </IconButton>
  );
}

function EditQuestion({ subject, questionId, setQuestionData }) {
  const [loading, setLoading] = useState(false);

  const getQuestion = async () => {
    setLoading(true);
    const { data } = await httpService.post(
      "aguila/subject/questionbank/question",
      { subject, questionId }
    );
    if (data) {
      // setQuestionData(data);

      setQuestionData(data.questions[0]);
    }
    setLoading(false);
  };
  return (
    <IconButton onClick={getQuestion} disabled={loading}>
      {loading ? <CircularProgress size={10} /> : <Edit />}
    </IconButton>
  );
}

function EnterQuestionText({ questionData, setQuestionData }) {
  // const optionToolbar = [
  //   ["bold", "italic", "underline", "strike"], // toggled buttons
  //   ["blockquote", "code-block"],

  //   [{ header: 1 }, { header: 2 }], // custom button values

  //   [{ script: "sub" }, { script: "super" }], // superscript/subscript
  // ];
  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];
  return (
    <div className="bg-light p-3">
      {questionData && (
        <div className="row">
          <div className="col-lg-4 mb-2">
            <Typography variant="caption">Question</Typography>
            <ReactQuill
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              value={questionData.question}
              onChange={(e) =>
                setQuestionData({ ...questionData, question: e })
              }
            />
          </div>
          <div className="col-lg-4 mb-2">
            <Typography variant="caption">Option A</Typography>
            <ReactQuill
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              value={questionData.optionA}
              onChange={(e) =>
                setQuestionData({
                  ...questionData,
                  optionA: e,
                })
              }
            />
          </div>
          <div className="col-lg-4 mb-2">
            <Typography variant="caption">Option B</Typography>
            <ReactQuill
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              value={questionData.optionB}
              onChange={(e) => setQuestionData({ ...questionData, optionB: e })}
            />
          </div>
          <div className="col-lg-4 mb-2">
            <Typography variant="caption">Option C</Typography>
            <ReactQuill
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              value={questionData.optionC}
              onChange={(e) => setQuestionData({ ...questionData, optionC: e })}
            />
          </div>
          <div className="col-lg-4 mb-2">
            <Typography variant="caption">Option D</Typography>
            <ReactQuill
              theme="snow"
              modules={{ toolbar: toolbarOptions }}
              value={questionData.optionD}
              onChange={(e) => setQuestionData({ ...questionData, optionD: e })}
            />
          </div>
          <div className="col-lg-4 mb-2">
            <Typography variant="caption">Correct Answer</Typography>
            <TextField
              select
              fullWidth
              onChange={(e) =>
                setQuestionData({ ...questionData, correctAns: e })
              }
            >
              <MenuItem value={questionData.optionA} selected>
                {questionData.optionA}
              </MenuItem>
              <MenuItem value={questionData.optionB}>
                {questionData.optionB}
              </MenuItem>
              <MenuItem value={questionData.optionC}>
                {questionData.optionC}
              </MenuItem>
              <MenuItem value={questionData.optionD}>
                {questionData.optionD}
              </MenuItem>
            </TextField>
          </div>
          <div className="col-lg-4">
            <LoadingButton variant="contained">update question</LoadingButton>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadQuestionImage() {
  return (
    <IconButton>
      <Camera />
    </IconButton>
  );
}
