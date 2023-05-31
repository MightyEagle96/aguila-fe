import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckSquare,
  faHandPaper,
} from "@fortawesome/free-regular-svg-icons";
import { People } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { httpService } from "../../httpService";

export default function ActiveExamCandidates({ examination, examSession }) {
  const [analysis, setAnalysis] = useState({});
  const getData = async () => {
    const { data } = await httpService.post(
      "aguila/candidates/sessioncandidatesanalysis",
      { examSession, examination }
    );

    if (data) {
      setAnalysis(data);
    }
  };

  useEffect(() => {
    getData();

    const timer = setInterval(() => {
      getData();
    }, 20 * 1000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div>
      <div className="row">
        <div className="col-lg-4 p-3 totalcandidates d-flex align-items-center justify-content-center col-12 text-white">
          <div className="text-center">
            <People sx={{ height: 100, width: 100 }} />
            <div className="mt-3 mb-3">
              <Typography variant="h1" textAlign={"center"}>
                {analysis.sessionCandidates}
              </Typography>
            </div>
            <div className="mt-2">
              <Typography variant="h5">Total Candidates</Typography>
            </div>
          </div>
        </div>
        <div className="col-lg-4 p-3 currentlywriting d-flex align-items-center justify-content-center col-12 ">
          <div className="text-center">
            <FontAwesomeIcon icon={faHandPaper} style={{ height: 80 }} />
            <div className="mt-3 mb-3">
              <Typography variant="h1" textAlign={"center"}>
                {analysis.stillWriting}
              </Typography>
            </div>
            <div className="mt-2">
              <Typography variant="h5">Currently Writing</Typography>
            </div>
          </div>
        </div>
        <div className="col-lg-4 p-3 totalsubmitted  d-flex align-items-center justify-content-center col-12">
          <div className="text-center">
            <FontAwesomeIcon icon={faCheckSquare} style={{ height: 80 }} />
            <div className="mt-3 mb-3">
              <Typography variant="h1" textAlign={"center"}>
                {analysis.hasSubmitted}
              </Typography>
            </div>
            <div className="mt-2">
              <Typography variant="h5">Total Submitted</Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
