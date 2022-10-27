import { Upload } from "@mui/icons-material";
import {
  Button,
  IconButton,
  MenuItem,
  Pagination,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { httpService } from "../../httpService";
import { Alert, Spinner } from "react-bootstrap";

import "quill/dist/quill.snow.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Stack } from "@mui/system";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";
import "./ExamQuestionUpload.css";

export default function ExamQuestionUpload() {
  const { id } = useParams();
  //const [questionBank, setQuestionBank] = useState(null);

  const defaultData = {
    question: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAns: "",
  };
  const [richText, setRichText] = useState(false);
  const [questionData, setQuestionData] = useState(defaultData);
  const [subject, setSubject] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [posting, setPosting] = useState(false);
  const [query, setQuery] = useState({ page: 1, limit: 10 });
  const [length, setLength] = useState(0);
  const [fetching, setFetching] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const handleChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };
  const getExamType = async () => {
    setFetching(true);
    const path = `getExamQuestions/${id}?limit=${query.limit}&page=${query.page}`;
    const res = await httpService.get(path);

    if (res) {
      setSubject(res.data.subject);
      setLength(res.data.length);
      setStartIndex(res.data.startIndex);
      setQuestions(res.data.questions);
      setFetching(false);
    }
    setFetching(false);
  };

  const paginationResult = async (e) => {
    const page = Number(e.target.textContent);
    setQuery({
      ...query,
      page,
    });
    setFetching(true);
    const path = `getExamQuestions/${id}?limit=${query.limit}&page=${page}`;
    const res = await httpService.get(path);
    if (res) {
      setLength(res.data.length);
      setQuestions(res.data.questions);
      setStartIndex(res.data.startIndex);
      setFetching(false);
    }
    setFetching(false);
  };
  const paginationResult2 = async (e) => {
    const limit = Number(e.target.value);
    setQuery({
      ...query,
      limit,
    });
    setFetching(true);
    const path = `getExamQuestions/${id}?limit=${limit}&page=${query.page}`;
    const res = await httpService.get(path);
    if (res) {
      setLength(res.data.length);
      setQuestions(res.data.questions);
      setFetching(false);
      setStartIndex(res.data.startIndex);
    }
    setFetching(false);
  };
  const deleteQuestion = (questionId) => {
    Swal.fire({
      icon: "question",
      title: "Delete",
      text: "Do you want to delete this question?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setPosting(true);
        const path = `deleteQuestion/${id}`;
        const res = await httpService.post(path, { questionId });
        if (res) {
          Swal.fire({
            icon: "success",
            text: res.data,
            timer: 1000,
            showConfirmButton: false,
            toast: true,
          });
          getExamType();
          setPosting(false);
        }
        setPosting(false);
      }
    });
  };
  const postQuestion = async (e) => {
    e.preventDefault();
    setPosting(true);
    const path = `postQuestion/${id}`;
    const res = await httpService.post(path, questionData);
    if (res) {
      Swal.fire({
        icon: "success",
        text: res.data,
        timer: 1000,
        showConfirmButton: false,
        toast: true,
      });
      setQuestionData(defaultData);
      getExamType();
      setPosting(false);
    }
    setPosting(false);
  };

  useEffect(() => {
    getExamType();
  }, []);

  const optionToolbar = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],

    [{ header: 1 }, { header: 2 }], // custom button values

    [{ script: "sub" }, { script: "super" }], // superscript/subscript
  ];
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
    <div>
      {subject ? (
        <div className="mt-5 mb-5">
          <div>
            <Alert>
              <Typography>
                Subject: <strong>{subject.name}</strong>
              </Typography>
            </Alert>
          </div>
          <div>
            <div className="d-flex justify-content-end mb-2">
              {richText ? (
                <Button
                  onClick={() => setRichText(!richText)}
                  color="info"
                  variant="contained"
                >
                  plain text
                </Button>
              ) : (
                <Button
                  onClick={() => setRichText(!richText)}
                  color="secondary"
                  variant="contained"
                >
                  rich text
                </Button>
              )}
            </div>

            <form field onSubmit={postQuestion}>
              <fieldset disabled={posting}>
                {richText ? (
                  <>
                    <div className="row">
                      <div className="col-md-5">
                        <Typography variant="caption">Question</Typography>
                        <ReactQuill
                          theme="snow"
                          value={questionData.question}
                          onChange={(e) =>
                            setQuestionData({ ...questionData, question: e })
                          }
                          modules={{ toolbar: toolbarOptions }}
                        />
                      </div>
                      <div className="col-md-3  mb-2 me-2">
                        <Typography variant="caption">Option A</Typography>
                        <ReactQuill
                          theme="snow"
                          value={questionData.optionA}
                          onChange={(e) =>
                            setQuestionData({ ...questionData, optionA: e })
                          }
                          modules={{ toolbar: optionToolbar }}
                        />
                      </div>
                      <div className="col-md-3  mb-2 me-2">
                        <Typography variant="caption">Option B</Typography>
                        <ReactQuill
                          theme="snow"
                          value={questionData.optionB}
                          onChange={(e) =>
                            setQuestionData({ ...questionData, optionB: e })
                          }
                          modules={{ toolbar: optionToolbar }}
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="d-flex flex-wrap">
                        <div className="col-md-3  mb-2 me-2">
                          <Typography variant="caption">Option C</Typography>
                          <ReactQuill
                            theme="snow"
                            value={questionData.optionC}
                            onChange={(e) =>
                              setQuestionData({ ...questionData, optionC: e })
                            }
                            modules={{ toolbar: optionToolbar }}
                          />
                        </div>
                        <div className="col-md-3  mb-2 me-2">
                          <Typography variant="caption">Option D</Typography>
                          <ReactQuill
                            theme="snow"
                            value={questionData.optionD}
                            onChange={(e) =>
                              setQuestionData({ ...questionData, optionD: e })
                            }
                            modules={{ toolbar: optionToolbar }}
                          />
                        </div>
                        <div className="col-md-3  mb-2 me-2 d-flex align-items-center">
                          {" "}
                          <TextField
                            fullWidth
                            label="Correct Ans"
                            maxRows={3}
                            onChange={handleChange}
                            name="correctAns"
                            value={questionData.correctAns}
                            required
                            select
                          >
                            <MenuItem value={questionData.optionA}>
                              {parse(questionData.optionA)}
                            </MenuItem>
                            <MenuItem value={questionData.optionB}>
                              {parse(questionData.optionB)}
                            </MenuItem>
                            <MenuItem value={questionData.optionC}>
                              {parse(questionData.optionC)}
                            </MenuItem>
                            <MenuItem value={questionData.optionD}>
                              {parse(questionData.optionD)}
                            </MenuItem>
                          </TextField>
                        </div>
                        <div className="col-md-2 d-flex align-items-center">
                          <Button type="submit" startIcon={<Upload />}>
                            {posting ? (
                              <Spinner animation="grow" />
                            ) : (
                              "post question"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-md-5">
                        <TextField
                          fullWidth
                          multiline
                          label="Question"
                          maxRows={3}
                          onChange={handleChange}
                          name="question"
                          value={questionData.question}
                          required
                        />
                      </div>
                      <div className="col-md-3  mb-2 me-2">
                        <TextField
                          fullWidth
                          multiline
                          label="Option A"
                          maxRows={3}
                          onChange={handleChange}
                          name="optionA"
                          value={questionData.optionA}
                          required
                        />
                      </div>
                      <div className="col-md-3  mb-2 me-2">
                        {" "}
                        <TextField
                          fullWidth
                          multiline
                          label="Option B"
                          maxRows={3}
                          onChange={handleChange}
                          name="optionB"
                          value={questionData.optionB}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="d-flex flex-wrap">
                        <div className="col-md-3  mb-2 me-2">
                          {" "}
                          <TextField
                            fullWidth
                            multiline
                            label="Option C"
                            maxRows={3}
                            onChange={handleChange}
                            name="optionC"
                            value={questionData.optionC}
                            required
                          />
                        </div>
                        <div className="col-md-3  mb-2 me-2">
                          {" "}
                          <TextField
                            fullWidth
                            multiline
                            label="Option D"
                            maxRows={3}
                            onChange={handleChange}
                            name="optionD"
                            value={questionData.optionD}
                            required
                          />
                        </div>
                        <div className="col-md-3  mb-2 me-2">
                          {" "}
                          <TextField
                            fullWidth
                            label="Correct Ans"
                            maxRows={3}
                            onChange={handleChange}
                            name="correctAns"
                            value={questionData.correctAns}
                            required
                            select
                          >
                            <MenuItem value={questionData.optionA}>
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
                        <div className="col-md-2 d-flex align-items-center">
                          <Button type="submit" startIcon={<Upload />}>
                            {posting ? (
                              <Spinner animation="grow" />
                            ) : (
                              "post question"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </fieldset>
            </form>

            {questions.map((c, i) => (
              <div className=" mb-2 border-bottom">
                <Typography variant="subtitle2" color="GrayText" gutterBottom>
                  Question {i + 1}
                </Typography>
                <div className="row">
                  <div className="col-lg-6">
                    <div>
                      <Typography variant="caption" gutterBottom>
                        Question
                      </Typography>
                      <Typography>{parse(c.question)}</Typography>
                    </div>
                  </div>
                  <div className="col-lg-6 gutterBottom">
                    <div className="row">
                      <div className="col-md-6">
                        <Typography variant="caption" gutterBottom>
                          Option A
                        </Typography>
                        <Typography>{parse(c.optionA)}</Typography>
                      </div>
                      <div className="col-md-6">
                        <Typography variant="caption" gutterBottom>
                          Option B
                        </Typography>
                        <Typography>{parse(c.optionB)}</Typography>
                      </div>
                    </div>
                    <div className="row mt-1 ">
                      <div className="col-md-6">
                        <Typography variant="caption" gutterBottom>
                          Option C
                        </Typography>
                        <Typography>{parse(c.optionC)}</Typography>
                      </div>
                      <div className="col-md-6">
                        <Typography variant="caption" gutterBottom>
                          Option D
                        </Typography>
                        <Typography>{parse(c.optionD)}</Typography>
                      </div>
                    </div>
                    <div className="row mt-1">
                      <div className="col-md-6">
                        <Typography variant="caption" gutterBottom>
                          Correct Answer
                        </Typography>
                        <Typography>{parse(c.correctAns)}</Typography>
                      </div>
                      <div className="col-md-6">
                        <Stack direction="row" spacing={2}>
                          <IconButton onClick={() => deleteQuestion(c._id)}>
                            <i class="fas fa-trash    "></i>
                          </IconButton>
                          <IconButton>
                            <i class="fas fa-edit    "></i>
                          </IconButton>
                        </Stack>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {/* <Table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Question</th>
                  <th>Option A</th>
                  <th>Option B</th>
                  <th>Option C</th>
                  <th>Option D</th>
                  <th>Correct Answer</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((c, i) => (
                  <tr key={i}>
                    <td>{startIndex + i}</td>
                    <td>{parse(c.question)}</td>
                    <td>{parse(c.optionA)}</td>
                    <td>{parse(c.optionB)}</td>
                    <td>{parse(c.optionC)}</td>
                    <td>{parse(c.optionD)}</td>
                    <td>{parse(c.correctAns)}</td>
                    <td>
                      <Stack direction="row" spacing={2}>
                        <IconButton onClick={() => deleteQuestion(c._id)}>
                          <i class="fas fa-trash    "></i>
                        </IconButton>
                        <IconButton>
                          <i class="fas fa-edit    "></i>
                        </IconButton>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table> */}
            <div className="mt-2">
              <div className="d-flex justify-content-end">
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <div className="d-flex align-items-center">
                    {fetching ? <Spinner size="sm" animation="border" /> : null}
                  </div>
                  <div className="d-flex align-items-center">
                    <Typography variant="caption">Rows per page</Typography>
                    <TextField
                      value={query.limit}
                      select
                      variant="standard"
                      className="ms-2"
                      onChange={paginationResult2}
                    >
                      <MenuItem value={10}>10</MenuItem>
                      <MenuItem value={20}>20</MenuItem>
                      <MenuItem value={50}>50</MenuItem>
                      <MenuItem value={100}>100</MenuItem>
                    </TextField>
                  </div>

                  <div className="d-flex align-items-center">
                    <Typography variant="caption">
                      Page: {query.page}
                    </Typography>
                  </div>

                  <Pagination
                    count={Math.ceil(length / query.limit)}
                    onClick={paginationResult}
                    showFirstButton
                    showLastButton
                  />
                </Stack>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
