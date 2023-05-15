import React, { useState, useContext } from "react";
import { AlertContext } from "../../contexts/AlertContext";
import { Modal } from "react-bootstrap";
import { LoadingButton } from "@mui/lab";
import { Button, TextField, MenuItem, Typography } from "@mui/material";
import { Save } from "@mui/icons-material";
import { httpService } from "../../httpService";
import parse from "html-react-parser";

export default function AddQuestionText({
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
