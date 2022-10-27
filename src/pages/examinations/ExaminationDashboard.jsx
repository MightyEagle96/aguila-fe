import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton, Typography } from "@mui/material";
import { httpService } from "../../httpService";
import { Alert, Table } from "react-bootstrap";

export default function ExaminationDashboard() {
  const { id } = useParams();

  const [data, setData] = useState(null);

  const getUpdates = async () => {
    const path = `statusReports/${id}`;

    const res = await httpService.get(path);

    if (res) setData(res.data);
  };

  useEffect(() => {
    getUpdates();

    setTimeout(() => {
      getUpdates();
    }, 10000);
  }, []);
  return (
    <div>
      <div className="mt-2 mb-2">
        <div>
          {data ? (
            <div>
              <div className="container">
                <Alert>
                  <Typography variant="caption" gutterBottom>
                    Examination:
                  </Typography>
                  <Typography variant="h4">
                    {data.createdExamination.title}
                  </Typography>
                </Alert>
              </div>
              <div className="mt-2 p-3">
                <Table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Centre</th>
                      <th>Time Started</th>
                      <th>Time Stopped</th>
                      <th>Total Candidates</th>
                      <th>Total Writing</th>
                      <th>Total Submitted</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.reports.map((c, i) => (
                      <tr key={i}>
                        <td>{c.centre.centreId}</td>
                        <td>{c.centre.name}</td>
                        <td>
                          {c.timeStarted
                            ? new Date(c.timeStarted).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td>
                          {c.timeStopped
                            ? new Date(c.timeStopped).toLocaleTimeString()
                            : "-"}
                        </td>
                        <td>{c.totalCandidates}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="container">
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <div className="mt-1">
                <Skeleton variant="rectangular" height={60} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
