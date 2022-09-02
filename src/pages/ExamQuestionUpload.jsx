import { Upload } from "@mui/icons-material";
import {
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { httpService } from "../httpService";
import { Table } from "react-bootstrap";

import "quill/dist/quill.snow.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Stack } from "@mui/system";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import parse from "html-react-parser";

export default function ExamQuestionUpload() {
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
  const [examType, setExamType] = useState(null);
  const [questions, setQuestions] = useState([]);

  const { id } = useParams();

  const handleChange = (e) => {
    setQuestionData({ ...questionData, [e.target.name]: e.target.value });
  };
  const getExamType = async () => {
    const path = `viewExamType/${id}`;
    const res = await httpService.get(path);

    if (res) {
      setExamType(res.data);
      setQuestions(res.data.questions);
    }
  };

  const postQuestion = async (e) => {
    e.preventDefault();
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
    }
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
      <div className="mt-3 mb-3">
        {examType ? (
          <div className="p-3 ">
            <div className="d-flex justify-content-between">
              <div>
                <Typography variant="caption">Exam Type:</Typography>
                <Typography fontWeight={600} variant="h5">
                  {examType.examType}
                </Typography>
              </div>
              <div>
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
            </div>
            <form onSubmit={postQuestion}>
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
                          post question
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
                          post question
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </form>

            <div className="mt-3">
              <Table striped bordered>
                <thead>
                  <tr>
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
                      <td>{parse(c.question)}</td>
                      <td>{c.optionA}</td>
                      <td>{c.optionB}</td>
                      <td>{c.optionC}</td>
                      <td>{c.optionD}</td>
                      <td>{c.correctAns}</td>
                      <td>
                        <Stack direction="row" spacing={2}>
                          <IconButton>
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
              </Table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
