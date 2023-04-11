import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { CircularProgress, Typography } from "@mui/material";

export default function ViewSubject() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const [subject, setSubject] = useState(null);

  const getSubject = async () => {
    setLoading(true);
    const { data } = await httpService(`aguila/subject/view/${id}`);

    if (data) {
      setSubject(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getSubject();
  }, []);
  return (
    <div className="mt-5 mb-5 p-3">
      {loading && <CircularProgress />}
      {subject && (
        <>
          <div className="alert alert-light col-lg-6">
            <Typography variant="caption">Subject</Typography>
            <Typography
              variant="h4"
              textTransform={"uppercase"}
              fontWeight={700}
            >
              {subject.name}
            </Typography>
          </div>
        </>
      )}
    </div>
  );
}
