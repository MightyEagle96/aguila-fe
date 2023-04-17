import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { httpService } from "../../httpService";
import { useParams } from "react-router-dom";
import MyPagination from "../../components/MyPagination";
import { Typography } from "@mui/material";
import { CircularProgress } from "@mui/material";

export default function ExamResults() {
  const { id } = useParams();

  const [totalCandidates, setTotalCandidates] = useState(0);
  const [results, setResults] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const getCandidates = async () => {
    setLoading(true);
    const { data } = await httpService(
      `aguila/candidates/${id}/view?page=${1}&limit=${50}`
    );

    if (data) {
      setResults(data.results);
      setStartIndex(data.startIndex);
      setTotalCandidates(data.allResultsLength);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCandidates();
  }, []);

  return (
    <div className="mb-5" style={{ marginTop: 100 }}>
      {loading && <CircularProgress />}
      <div className="alert alert-success col-lg-3">
        <Typography gutterBottom>Total Candidates</Typography>
        <Typography>{totalCandidates}</Typography>
      </div>
      <Table striped bordered>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Candidate</th>
            <th>Reg Number</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {results.map((c, i) => (
            <tr>
              <td>{startIndex + i}</td>
              <td>
                <Typography textTransform={"capitalize"}>
                  {c.firstName} {c.lastName}
                </Typography>
              </td>
              <td>
                <Typography textTransform={"uppercase"}>
                  {c.registrationNumber}
                </Typography>
              </td>
              <td>
                <Typography>{c.totalScore}</Typography>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <MyPagination
        rootPath={`aguila/candidates/${id}/view?`}
        setResults={setResults}
        setStartIndex={setStartIndex}
      />
    </div>
  );
}
