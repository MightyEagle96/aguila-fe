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
import { Table, Modal } from "react-bootstrap";
import { Delete, Edit } from "@mui/icons-material";

import parse from "html-react-parser";

import Swal from "sweetalert2";
import UploadQuestionImage from "./UploadQuestionImage";
import AddQuestionText from "./AddQuestionToText";

export default function SubjectQuestionBank() {
  const { id } = useParams();
  const { setAlertData } = useContext(AlertContext);
  const [questionBank, setQuestionBank] = useState(null);
  const [loading, setLoading] = useState(false);
  const [questionFile, setQuestionFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [questionData, setQuestionData] = useState(null);
  const [questionMetaData, setQuestionMetaData] = useState(null);
  const [addQuestionData, setAddQuestionData] = useState(null);

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
            <Button
              variant="contained"
              onClick={() => {
                setAddQuestionData({ id });
              }}
            >
              add question manually
            </Button>
          </div>
          <div className="d-flex justify-content-end" id="editQuestion">
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
            {/* <EnterQuestionText
              questionData={questionData}
              setQuestionData={setQuestionData}
              questionMetaData={questionMetaData}
              getQuestionBank={getQuestionBank}
            /> */}
          </div>
          <div className="mt-3">
            <Table bordered striped>
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
                  <>
                    {c.isRichText ? (
                      <tr key={i}>
                        <td>
                          <Typography>{i + 1}</Typography>
                        </td>
                        <td className="col-lg-4">{parse(c.question)}</td>
                        <td className="col-lg-1">{parse(c.optionA)}</td>
                        <td className="col-lg-1">{parse(c.optionB)}</td>
                        <td className="col-lg-1">{parse(c.optionC)}</td>

                        <td className="col-lg-1">{parse(c.optionD)}</td>
                        <td className="col-lg-1">{parse(c.correctAns)}</td>
                        <td>
                          <EditQuestion
                            subject={questionBank.subject}
                            questionId={c._id}
                            setQuestionData={setQuestionData}
                            setQuestionMetaData={setQuestionMetaData}
                          />
                        </td>
                        <td>
                          <DeleteQuestion
                            subject={questionBank.subject._id}
                            questionId={c._id}
                            getQuestionBank={getQuestionBank}
                          />
                        </td>
                        <td>
                          <UploadQuestionImage
                            subject={questionBank.subject._id}
                            questionId={c._id}
                          />
                        </td>
                      </tr>
                    ) : (
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
                            setQuestionMetaData={setQuestionMetaData}
                          />
                        </td>
                        <td>
                          <DeleteQuestion
                            subject={questionBank.subject._id}
                            questionId={c._id}
                            getQuestionBank={getQuestionBank}
                          />
                        </td>
                        <td>
                          <UploadQuestionImage
                            subject={questionBank.subject._id}
                            questionId={c._id}
                          />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
              <tfoot>
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
              </tfoot>
            </Table>
          </div>
          <Modal
            centered
            size="xl"
            backdrop="static"
            show={questionData}
            onHide={() => {
              setQuestionData(null);
              setQuestionMetaData(null);
            }}
          >
            <Modal.Header closeButton>EDIT QUESTION</Modal.Header>
            <Modal.Body>
              <EnterQuestionText
                questionData={questionData}
                setQuestionData={setQuestionData}
                questionMetaData={questionMetaData}
                getQuestionBank={getQuestionBank}
              />
            </Modal.Body>
          </Modal>
          <Modal
            centered
            size="xl"
            backdrop="static"
            show={addQuestionData}
            onHide={() => {
              setAddQuestionData(null);
            }}
          >
            <Modal.Header closeButton>ADD QUESTION</Modal.Header>
            <AddQuestionText
              addQuestionData={addQuestionData}
              getQuestionBank={getQuestionBank}
              setAddQuestionData={setAddQuestionData}
            />
          </Modal>
        </div>
      )}
    </div>
  );
}

function DeleteQuestion({ subject, questionId, getQuestionBank }) {
  const { setAlertData } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const deleteQuestion = () => {
    Swal.fire({
      icon: "question",
      title: "Delete Question",
      text: "Are you sure you want to delete this question?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setLoading(true);
        const { data, error } = await httpService.post(
          "aguila/subject/questionbank/deletequestion",
          { subject, questionId }
        );

        if (data) {
          setAlertData({ open: true, message: data, severity: "success" });
          getQuestionBank();
        }
        if (error) {
          setAlertData({ open: true, message: error, severity: "error" });
        }
        setLoading(false);
      }
    });
  };
  return (
    <IconButton disabled={loading} onClick={deleteQuestion}>
      {loading ? <CircularProgress size={20} /> : <Delete />}
    </IconButton>
  );
}

function EditQuestion({
  subject,
  questionId,
  setQuestionData,
  setQuestionMetaData,
}) {
  const [loading, setLoading] = useState(false);

  const getQuestion = async () => {
    setLoading(true);
    const { data } = await httpService.post(
      "aguila/subject/questionbank/question",
      { subject, questionId }
    );
    if (data) {
      // setQuestionData(data);

      setQuestionData(data.question.questions[0]);
      setQuestionMetaData({
        subject: data.subject,
        questionId: data.questionId,
      });
    }
    setLoading(false);
  };
  return (
    <IconButton onClick={getQuestion} disabled={loading}>
      {loading ? <CircularProgress size={20} /> : <Edit />}
    </IconButton>
  );
}

function EnterQuestionText({
  questionData,
  setQuestionData,
  questionMetaData,
  getQuestionBank,
}) {
  const [editData, setEditData] = useState(questionData);
  const [loading, setLoading] = useState(false);
  const { setAlertData } = useContext(AlertContext);

  const updateQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await httpService.post(
      "aguila/subject/questionbank/updatequestion",
      { ...editData, ...questionMetaData }
    );
    if (data) {
      setQuestionData(null);
      getQuestionBank();
      setAlertData({ message: data, open: true, severity: "success" });
    }
    if (error) {
      setAlertData({ message: error, open: true, severity: "error" });
    }
    setLoading(false);
  };
  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });
  return (
    <div className="bg-light p-3">
      {editData && (
        <form onSubmit={updateQuestion}>
          <div className="row">
            <div className="col-lg-12 mb-4">
              {/* <ReactQuill
              theme="snow"
              modules={{ toolbar: optionToolbar }}
              value={questionData.question}
              onChange={(e) =>
                setQuestionData({ ...questionData, question: e })
              }
            /> */}
              <TextField
                multiline
                maxRows={6}
                value={editData.question}
                name="question"
                onChange={handleChange}
                fullWidth
                required
                label="Question"
                variant="standard"
              />
            </div>
            <div className="col-lg-4 mb-4">
              <TextField
                multiline
                maxRows={6}
                value={editData.optionA}
                name="optionA"
                onChange={handleChange}
                fullWidth
                required
                label="Option A"
                variant="standard"
              />
            </div>
            <div className="col-lg-4 mb-4">
              <TextField
                multiline
                maxRows={6}
                value={editData.optionB}
                name="optionB"
                onChange={handleChange}
                fullWidth
                required
                label="Option B"
                variant="standard"
              />
            </div>
            <div className="col-lg-4 mb-4">
              <TextField
                multiline
                maxRows={6}
                value={editData.optionC}
                name="optionC"
                onChange={handleChange}
                fullWidth
                required
                label="Option C"
                variant="standard"
              />
            </div>
            <div className="col-lg-4 mb-4">
              <TextField
                multiline
                maxRows={6}
                value={editData.optionD}
                name="optionD"
                onChange={handleChange}
                fullWidth
                required
                label="Option D"
                variant="standard"
              />
            </div>
            <div className="col-lg-4 mb-4">
              <TextField
                select
                fullWidth
                name="correctAns"
                onChange={handleChange}
                value={editData.correctAns}
                required
                label="Correct Answer"
                variant="standard"
              >
                <MenuItem value={editData.optionA}>{editData.optionA}</MenuItem>
                <MenuItem value={editData.optionB}>{editData.optionB}</MenuItem>
                <MenuItem value={editData.optionC}>{editData.optionC}</MenuItem>
                <MenuItem value={editData.optionD}>{editData.optionD}</MenuItem>
              </TextField>
            </div>
            <div className="col-lg-4">
              <LoadingButton
                loadingPosition="end"
                loading={loading}
                variant="contained"
                type="submit"
              >
                update question
              </LoadingButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
