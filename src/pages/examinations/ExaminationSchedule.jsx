import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import CentresAndSessions from "./CentresAndSessions";
import SessionCandidate from "./SessionCandidate";

export default function ExaminationSchedule() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const getExamination = async () => {
    const path = `viewExamination/${id}`;

    const res = await httpService.get(path);

    if (res) {
      setExamination(res.data);
    }
  };

  const getExamSessions = async () => {
    const path = `getExamSessions/${id}`;
    const res = await httpService(path);

    if (res) {
      setSessions(res.data);
    }
  };

  const getTotalCandidates = async () => {
    const path = `getTotalCandidates/${id}`;

    const res = await httpService(path);

    if (res) {
      setTotalCandidates(res.data);
    }
  };

  useEffect(() => {
    getExamination();
    getExamSessions();
    getTotalCandidates();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        {examination ? (
          <div>
            <Typography variant="h4" fontWeight={600}>
              {examination.title} examination schedule
            </Typography>

            <div className="mt-3">
              <div className="col-md-3">
                <div className="alert alert-success">
                  Total Candidates:{" "}
                  <strong>{totalCandidates.toLocaleString()}</strong>
                </div>
              </div>
            </div>
            <div className="mt-3 col-lg-12">
              <Typography color="GrayText" gutterBottom>
                All sessions for this examination and the candidates
              </Typography>
              <div className="d-flex flex-wrap">
                {sessions.map((c) => (
                  <div className="col-md-3">
                    <SessionCandidate examination={id} session={c} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 col-lg-12">
              <Typography color="GrayText" gutterBottom>
                Centres and sessions
              </Typography>
              <div className="d-flex flex-wrap">
                {sessions.map((c) => (
                  <div className="col-md-3">
                    <CentresAndSessions session={c} />
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 col-lg-12">
              <Typography color="GrayText" gutterBottom>
                Subjects for this examination
              </Typography>
              <div className="mt-2">
                <Typography variant="h5" fontStyle={"italic"} fontWeight={600}>
                  {examination.subjects
                    .map(({ name }) => {
                      return name;
                    })
                    .join(", ")}
                </Typography>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
