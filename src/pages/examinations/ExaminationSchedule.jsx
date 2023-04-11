import { Link, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import CentresAndSessions from "./CentresAndSessions";
import SessionCandidate from "./SessionCandidate";

export default function ExaminationSchedule() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [analysis, setAnalysis] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
  });

  const getExamination = async () => {
    const path = `aguila/examination/${id}/view`;

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

  async function getAnalysis() {
    const { data } = await httpService(`aguila/candidates/${id}/analysis`);

    if (data) {
      setAnalysis(data);
    }
  }
  useEffect(() => {
    getExamination();

    getAnalysis();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5 p-3">
        {examination ? (
          <div>
            <Typography
              variant="h4"
              textTransform={"capitalize"}
              fontWeight={600}
            >
              {examination.title} examination schedule
            </Typography>
            <div className="mt-3">
              <div className="row">
                <div
                  className="col-lg-3 p-3"
                  style={{ backgroundColor: "#fdb874" }}
                >
                  <Typography>
                    Total Candidates: {analysis.total.toLocaleString()}
                  </Typography>
                </div>
                <div
                  className="col-lg-3 p-3"
                  style={{ backgroundColor: "#b088ad", color: "white" }}
                >
                  <Typography>
                    Unassigned: {analysis.unassigned.toLocaleString()}
                  </Typography>
                </div>
                <div
                  className="col-lg-3 p-3"
                  style={{ backgroundColor: "#1d2b67", color: "white" }}
                >
                  <Typography>
                    Assigned: {analysis.assigned.toLocaleString()}
                  </Typography>
                </div>
              </div>
            </div>

            {/* <div className="mt-3 col-lg-12">
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
            </div> */}
            {/* <div className="mt-3 col-lg-12">
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
            <div className="mt-3">
              <Link href={`/examinationTable/${id}`}>
                View Examination table
              </Link>
            </div>   */}
          </div>
        ) : null}
      </div>
    </div>
  );
}
