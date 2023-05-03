import { CircularProgress, TextField, Typography } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { httpService } from "../../httpService";
export default function PerformSyncOperations() {
  //select the exam
  const [activeExam, setActiveExam] = useState(null);
  const [loading, setLoading] = useState(false);

  const getExams = async () => {
    setLoading(true);
    const { data } = await httpService("aguila/examination/active");

    if (data) {
      setActiveExam(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getExams();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="col-lg-4 alert alert-light mb-2">
          <Typography variant="h4" fontWeight={600}>
            SYNC OPERATION
          </Typography>
        </div>
        {loading && <CircularProgress />}
        {activeExam && (
          <div>
            <div className="alert alert-success col-lg-4">
              <Typography variant="caption" gutterBottom>
                Active Exam
              </Typography>
              <Typography
                variant="h4"
                fontWeight={700}
                textTransform={"uppercase"}
              >
                {activeExam.title}
              </Typography>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
