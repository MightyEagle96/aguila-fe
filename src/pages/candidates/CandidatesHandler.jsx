import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { httpService } from "../../httpService";
import CentreCard from "../centres/CentreCard";

export default function CandidatesHandler() {
  const [examinations, setExaminations] = useState([]);
  const viewExaminations = async () => {
    const path = "viewCreatedExaminations";

    const res = await httpService.get(path);

    if (res) {
      setExaminations(res.data);
    }
  };

  useEffect(() => {
    viewExaminations();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        <Typography variant="h4" fontWeight={600} color="#f50057">
          Candidates' Dashboard
        </Typography>
        <div className="mt-3">
          <div className="d-flex flex-wrap">
            {examinations.map((c) => (
              <CentreCard data={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
