import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { CircularProgress, Typography } from "@mui/material";
export default function SubjectQuestionBank() {
  const { id } = useParams();
  const [questionBank, setQuestionBank] = useState(null);
  const [loading, setLoading] = useState(false);

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
        </div>
      )}
    </div>
  );
}
