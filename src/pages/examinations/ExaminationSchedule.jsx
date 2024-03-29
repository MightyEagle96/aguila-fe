import { Button, LinearProgress, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import ExamSessionModelComponent from "../../components/ExamSessionModelComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AddComment } from "@mui/icons-material";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { LoadingButton } from "@mui/lab";
export default function ExaminationSchedule() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState({
    total: 0,
    assigned: 0,
    unassigned: 0,
  });

  const [showInstructionField, setShowInstructionField] = useState(false);

  const getExamination = async () => {
    setLoading(true);
    const path = `aguila/examination/${id}/view`;

    const res = await httpService.get(path);

    if (res) {
      setExamination(res.data);
    }
    setLoading(false);
  };

  async function getAnalysis() {
    setLoading(true);
    const { data } = await httpService(`aguila/candidates/${id}/analysis`);

    if (data) {
      setAnalysis(data);
    }

    setLoading(false);
  }
  useEffect(() => {
    getExamination();

    getAnalysis();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5 p-3">
        {loading && <LinearProgress />}
        {examination ? (
          <div>
            <div className="row">
              <div className="">
                <Typography
                  variant="h4"
                  textTransform={"capitalize"}
                  fontWeight={600}
                >
                  {examination.title} schedule
                </Typography>

                <div className="row mt-3">
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
                <div className="mt-3">
                  <ExamSessions examination={examination} />
                </div>
              </div>
              {/* <div className="col-lg-3 shadow-sm">
                <Typography textTransform={"uppercase"} variant="h6">
                  Instructions for this examination
                </Typography>
                <div className="mt-2">
                  {examination.instructions.length === 0 && (
                    <Typography variant="subtitle1" color="GrayText">
                      No instructions yet
                    </Typography>
                  )}

                  <Button
                    startIcon={<AddComment />}
                    onClick={() =>
                      setShowInstructionField(!showInstructionField)
                    }
                  >
                    Add Instruction
                  </Button>
                  {showInstructionField && (
                    <div className="mt-2">
                      <TextField fullWidth multiline maxRows={6} />
                      <div className="mt-2">
                        <LoadingButton>update</LoadingButton>
                      </div>
                    </div>
                  )}
                </div>
              </div> */}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ExamSessions({ examination }) {
  const [sessions, setSessions] = useState([]);

  const getData = async () => {
    const { data } = await httpService("aguila/centres/examsessions");

    if (data) setSessions(data);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div
        className="col-lg-3 p-3"
        style={{ backgroundColor: "#f2f2eb", color: "GrayText" }}
      >
        <Typography gutterBottom>Available sessions for this exam</Typography>
        <div className="d-flex justify-content-end">
          <Typography variant="h3" fontWeight={700}>
            {sessions.length}
          </Typography>
        </div>
      </div>
      <div className="mt-2">
        {sessions.map((c, i) => (
          <div key={i} className="p-3 shadow-sm mb-3">
            <ExamSessionModelComponent c={c} examination={examination} />
          </div>
        ))}
      </div>
    </div>
  );
}
