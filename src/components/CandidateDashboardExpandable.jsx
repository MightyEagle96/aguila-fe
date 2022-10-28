import React from "react";
import { Typography } from "@mui/material";

export default function CandidateDashboardExpandable({ data }) {
  return (
    <div className="alert alert-success">
      <div className="row">
        <div className="col-md-3">
          <Typography variant="caption" gutterBottom>
            Subject Combinations
          </Typography>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {data.subjectCombinations.map((c, i) => (
                <tr key={i}>
                  <td>{c.subject.name}</td>
                  <td>{c.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-md-3">
          <div className="mb-2">
            <Typography variant="caption" gutterBottom>
              Exam State
            </Typography>
            <Typography variant="h5">
              <strong>{data.examState}</strong>
            </Typography>
          </div>
          <div className="mb-2">
            <Typography variant="caption" gutterBottom>
              Exam Town
            </Typography>
            <Typography variant="h5">
              <strong>{data.examTown}</strong>
            </Typography>
          </div>
        </div>
        <div className="col-md-3">
          {data.centre ? (
            <div>
              <Typography variant="caption" gutterBottom>
                CBT Centre
              </Typography>
              <Typography gutterBottom variant="h5">
                {data.centre.name}
              </Typography>
              <Typography variant="subtitle1">
                {data.centre.examTown}, {data.centre.examState}
              </Typography>

              <div className="mt-3">
                <Typography variant="h5">
                  Centre ID: <strong>{data.centre.centreId}</strong>
                </Typography>
              </div>
            </div>
          ) : null}
        </div>
        <div className="col-md-3">
          {data.seatNumber ? (
            <>
              <Typography variant="caption" gutterBottom>
                Seat Number
              </Typography>
              <Typography variant="h5">
                <strong>{data.seatNumber}</strong>
              </Typography>
            </>
          ) : (
            <Typography>Not yet assigned a seat number</Typography>
          )}
          {data.session ? (
            <>
              <Typography variant="caption" gutterBottom>
                Session
              </Typography>
              <Typography variant="h5">
                <strong>{data.session}</strong>
              </Typography>
            </>
          ) : (
            <Typography>Not yet assigned a session</Typography>
          )}
        </div>
      </div>
    </div>
  );
}
