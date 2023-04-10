import { CircularProgress, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import React, { useEffect, useState } from "react";

export default function CandidatesList() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(false);

  const getExamination = async () => {
    setLoading(true);

    const { data } = await httpService(`aguila/examination/${id}`);
    if (data) {
      setExamination(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    getExamination();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        {loading && <CircularProgress />}
        {examination && (
          <div className="alert alert-light col-lg-6">
            <Typography
              textTransform={"uppercase"}
              variant="h4"
              fontWeight={600}
            >
              {examination.title}
            </Typography>
            <hr />
            <Typography>Candidates List</Typography>
          </div>
        )}
      </div>
    </div>
  );
}
