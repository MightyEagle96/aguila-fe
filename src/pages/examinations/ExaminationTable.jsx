import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { Link, Typography } from "@mui/material";
function ExaminationTable() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [sessions, setSessions] = useState([]);
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

  useEffect(() => {
    getExamination();
    getExamSessions();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        {examination ? (
          <div>
            <Link href={`/examSchedule/${id}`}>Back to Schedule</Link>
            <Typography variant="h4" fontWeight={600} className="mt-2">
              {examination.title} examination table
            </Typography>

            <div className="mt-4">
              {sessions.map((c) => (
                <div className="alert alert-light shadow mb-1">
                  <Typography fontWeight={600}>{c}</Typography>
                  <div className="mt-1">
                    <Typography variant="overline">subjects</Typography>
                    <div className="d-flex flex-wrap">
                      {examination.subjects.map((d) => (
                        <div className="col-md-2">{d.name}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ExaminationTable;
