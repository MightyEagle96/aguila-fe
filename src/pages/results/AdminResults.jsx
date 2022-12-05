import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { Spinner, Table } from "react-bootstrap";
import { Typography } from "@mui/material";

export default function AdminResults() {
  const [exam, setExam] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const GetData = async () => {
    setLoading(true);
    const path = `viewExamination/${id}`;

    httpService(path).then((res) => {
      setExam(res.data);
      console.log(res.data);
    });

    httpService(`adminViewResult/${id}`).then((res) => {
      setCandidates(res.data);
      console.log(res.data);
    });

    setLoading(false);
  };

  useEffect(() => {
    GetData();
  }, []);

  return (
    <div className="mt-5 mb-5">
      <div>{loading ? <Spinner animation="border" /> : null}</div>
      <div>
        {exam ? (
          <div>
            <Typography variant="h4">{exam.title} Results</Typography>
            <div className="mt-4">
              <Table>
                <thead>
                  <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Reg. Number</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {candidates.map((c) => (
                    <tr>
                      <td>{c.firstName}</td>
                      <td>{c.lastName}</td>
                      <td>{c.registrationNumber}</td>
                      <td>{c.totalScore}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
