import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { CircularProgress, Typography } from "@mui/material";
import { Done } from "@mui/icons-material";
import parse from "html-react-parser";
export default function PreviewExam() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [questionBank, setQuestionBank] = useState(null);

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
  return (
    <div className="mt-1 mb-5 p-3">
      {loading && <CircularProgress />}
      {questionBank && (
        <div>
          <div className="alert alert-light col-lg-6 shadow-sm">
            <Typography variant="caption" gutterBottom>
              Examination Preview
            </Typography>
            <Typography
              textTransform={"uppercase"}
              variant="h4"
              fontWeight={700}
            >
              {questionBank.subject.name}
            </Typography>
          </div>

          {questionBank.questions.map((c, i) => (
            <QuestionCard c={c} i={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({ c, i }) {
  return (
    <div className="shadow-sm p-2 mb-1">
      {c.isRichText ? (
        <div>
          <Typography variant="h6">Question {i}</Typography>
          <div className="mt-3 mb-3">{parse(c.question)}</div>
          <div className="mb-1">
            <>
              A. {parse(c.optionA)} {c.optionA === c.correctAns && <Done />}
            </>
          </div>
          <div className="mb-1">
            <>
              B. {parse(c.optionB)} {c.optionB === c.correctAns && <Done />}
            </>
          </div>
          <div className="mb-1">
            <>
              C. {parse(c.optionC)} {c.optionC === c.correctAns && <Done />}
            </>
          </div>

          <div className="mb-1">
            <>
              D. {parse(c.optionD)} {c.optionD === c.correctAns && <Done />}
            </>
          </div>
        </div>
      ) : (
        <div>
          <Typography variant="h6">Question {i}</Typography>
          <div className="mt-3 mb-3">
            <Typography>{c.question} </Typography>
          </div>
          <div className="mb-1">
            <Typography>
              A. {c.optionA} {c.optionA === c.correctAns && <Done />}
            </Typography>
          </div>
          <div className="mb-1">
            <Typography>
              B. {c.optionB} {c.optionB === c.correctAns && <Done />}
            </Typography>
          </div>
          <div className="mb-1">
            <Typography>
              C. {c.optionC} {c.optionC === c.correctAns && <Done />}
            </Typography>
          </div>

          <div className="mb-1">
            <Typography>
              D. {c.optionD} {c.optionD === c.correctAns && <Done />}
            </Typography>
          </div>
        </div>
      )}
    </div>
  );
}
