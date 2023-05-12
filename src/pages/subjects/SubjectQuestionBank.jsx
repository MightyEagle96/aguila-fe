import React, { useState, useEffect, useContext } from "react";
import { useOutlet, useParams } from "react-router-dom";
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
import { AddAPhoto, Delete, Edit, Save, UploadFile } from "@mui/icons-material";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";

import Swal from "sweetalert2";

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
                          <UploadQuestionImage />
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

function UploadQuestionImage({ subject, questionId }) {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAlertData } = useContext(AlertContext);

  const toggle = () => setShow(!show);

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    setImage(URL.createObjectURL(e.target.files[0]));
  };

  const clearImage = () => {
    setFile(null);
    setImage(null);
  };

  const uploadImage = async (e) => {
    e.preventDefault();
    setLoading(true);

    let formData = new FormData();

    formData.append("imageFile", file, file.name);

    const { data, error } = await httpService.post(
      "aguila/subject/questionbank/uploadimage",
      formData,
      { headers: { subject, questionid: questionId } }
    );

    if (data) {
      setImage(null);
      setFile(null);
      setShow(false);
      setAlertData({ open: true, message: data, severity: "success" });
    }
    if (error) {
      setAlertData({ open: true, message: error, severity: "error" });
    }
    setLoading(false);
  };
  return (
    <>
      <IconButton onClick={toggle}>
        <AddAPhoto />
      </IconButton>

      <Modal centered size="xl" backdrop="static" show={show} onHide={toggle}>
        <Modal.Header closeButton>Insert Image</Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-lg-6">
              <div class="mb-3">
                <label for="formFile" class="form-label">
                  Default file input example
                </label>
                <input
                  class="form-control"
                  type="file"
                  id="formFile"
                  accept="image/png, image/gif, image/jpeg"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6">
              {image && (
                <div>
                  <img src={image} alt="question" className="img-fluid" />
                  <div className="mt-3">
                    <LoadingButton
                      endIcon={<UploadFile />}
                      color="success"
                      onClick={uploadImage}
                      variant="contained"
                      loading={loading}
                      loadingPosition="end"
                    >
                      Upload image
                    </LoadingButton>
                    <Button color="error" onClick={clearImage}>
                      clear
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

function AddQuestionText({
  addQuestionData,
  setAddQuestionData,
  getQuestionBank,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    ...addQuestionData,
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAns: "",
  });
  const [field, setField] = useState("question");
  const [mode, setMode] = useState("plain text");
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const { setAlertData } = useContext(AlertContext);

  const saveQuestion = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await httpService.post(
      "aguila/subject/questionbank/addquestion",
      {
        ...formData,
        isRichText: mode === "rich text" ? true : false,
      }
    );

    if (data) {
      setAlertData({ message: data, severity: "success", open: true });
      setAddQuestionData(null);
      getQuestionBank();
    }
    if (error) {
      setAlertData({ message: error, severity: "error", open: true });
    }

    setLoading(false);
  };

  const toggleMode = () => {
    mode === "plain text" ? setMode("rich text") : setMode("plain text");
    setFormData({
      ...addQuestionData,
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAns: "",
    });
  };

  return (
    <>
      {addQuestionData && (
        <div className="p-4">
          <Button onClick={toggleMode}>{mode}</Button>
          {mode === "plain text" ? (
            <form onSubmit={saveQuestion}>
              <div className="row">
                <div className="col-lg-12 mb-4">
                  <TextField
                    multiline
                    maxRows={6}
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
                    name="optionD"
                    onChange={handleChange}
                    fullWidth
                    required
                    label="Option D"
                    variant="standard"
                  />
                </div>
                {formData.optionA &&
                  formData.optionB &&
                  formData.optionC &&
                  formData.optionD && (
                    <div className="col-lg-4 mb-4">
                      <TextField
                        select
                        fullWidth
                        name="correctAns"
                        onChange={handleChange}
                        required
                        label="Correct Answer"
                        variant="standard"
                      >
                        <MenuItem value={formData.optionA}>
                          {formData.optionA}
                        </MenuItem>
                        <MenuItem value={formData.optionB}>
                          {formData.optionB}
                        </MenuItem>
                        <MenuItem value={formData.optionC}>
                          {formData.optionC}
                        </MenuItem>
                        <MenuItem value={formData.optionD}>
                          {formData.optionD}
                        </MenuItem>
                      </TextField>
                    </div>
                  )}
                <div className="col-lg-4">
                  <LoadingButton
                    loadingPosition="end"
                    loading={loading}
                    variant="contained"
                    type="submit"
                    endIcon={<Save />}
                  >
                    add question
                  </LoadingButton>
                </div>
              </div>
            </form>
          ) : (
            <div>
              <div className="row">
                <div className="col-lg-6 bg-light">
                  <TextField
                    fullWidth
                    label="Text Editor"
                    name={field}
                    onChange={handleChange}
                    value={formData[field]}
                    multiline
                    maxRows={6}
                  />

                  <div className="mt-2">
                    <div className="mb-2">
                      <Button
                        variant={
                          field === "question" ? "contained" : "outlined"
                        }
                        className="me-2 mb-2"
                        color="warning"
                        onClick={() => setField("question")}
                      >
                        Question
                      </Button>
                      <Button
                        variant={field === "optionA" ? "contained" : "outlined"}
                        className="me-2 mb-2"
                        color="warning"
                        onClick={() => setField("optionA")}
                      >
                        Option A
                      </Button>
                      <Button
                        variant={field === "optionB" ? "contained" : "outlined"}
                        className="me-2 mb-2"
                        color="warning"
                        onClick={() => setField("optionB")}
                      >
                        Option B
                      </Button>
                      <Button
                        variant={field === "optionC" ? "contained" : "outlined"}
                        className="me-2 mb-2"
                        color="warning"
                        onClick={() => setField("optionC")}
                      >
                        Option C
                      </Button>
                      <Button
                        variant={field === "optionD" ? "contained" : "outlined"}
                        className="me-2 mb-2"
                        color="warning"
                        onClick={() => setField("optionD")}
                      >
                        Option D
                      </Button>
                    </div>
                    <div>
                      <TextField
                        fullWidth
                        label="Correct Answer"
                        select
                        name="correctAns"
                        onChange={handleChange}
                      >
                        <MenuItem value={formData.optionA}>
                          {parse(formData.optionA)}
                        </MenuItem>
                        <MenuItem value={formData.optionB}>
                          {parse(formData.optionB)}
                        </MenuItem>
                        <MenuItem value={formData.optionC}>
                          {parse(formData.optionC)}
                        </MenuItem>
                        <MenuItem value={formData.optionD}>
                          {parse(formData.optionD)}
                        </MenuItem>
                      </TextField>
                    </div>
                    {/* <Button
                      variant={
                        field === "correctAns" ? "contained" : "outlined"
                      }
                      className="me-2 mb-2"
                    >
                      Correct Answer
                    </Button> */}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div>
                    <Typography variant="h6">Output</Typography>
                    <hr />
                    <div className="mb-2">
                      <div>
                        {" "}
                        <Typography variant="caption" gutterBottom>
                          Question
                        </Typography>
                      </div>
                      <div>{parse(formData.question)}</div>
                    </div>
                    <div className="mb-2">
                      <Typography variant="caption">Option A</Typography>
                      <div>{parse(formData.optionA)}</div>
                    </div>
                    <div className="mb-2">
                      <Typography variant="caption">Option B</Typography>
                      <div>{parse(formData.optionB)}</div>
                    </div>
                    <div className="mb-2">
                      <Typography variant="caption">Option C</Typography>
                      <div>{parse(formData.optionC)}</div>
                    </div>
                    <div className="mb-2">
                      <Typography variant="caption">Option D</Typography>
                      <div>{parse(formData.optionD)}</div>
                    </div>
                    <div className="mb-2">
                      <Typography variant="caption">Correct Ans</Typography>
                      <div>{parse(formData.correctAns)}</div>
                    </div>
                  </div>
                  <div className="mt-3">
                    <LoadingButton
                      loadingPosition="end"
                      loading={loading}
                      variant="contained"
                      onClick={saveQuestion}
                      endIcon={<Save />}
                    >
                      add question
                    </LoadingButton>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
