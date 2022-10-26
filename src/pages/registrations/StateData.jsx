import { Typography, Stack, Skeleton, Link } from "@mui/material";
import React, { useState } from "react";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";

function StateData() {
  const { examId, state } = useParams();
  const [data, setData] = useState(null);
  const getData = async () => {
    const path = `/stateData/${examId}/${state}`;

    const res = await httpService.get(path);
    if (res) {
      setData(res.data);
      console.log(res.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const expandableComponent = ({ data }) => {
    return (
      <div className="alert alert-success">
        <div className="row">
          <div className="col-md-4">
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
          <div className="col-md-4">
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
        </div>
      </div>
    );
  };

  const columns = [
    {
      name: "First Name",
      selector: (row) => (
        <Typography variant="body1" textTransform={"capitalise"}>
          {row.firstName}
        </Typography>
      ),
    },
    {
      name: "Last Name",
      selector: (row) => (
        <Typography variant="body1" textTransform={"capitalise"}>
          {row.lastName}
        </Typography>
      ),
    },
    {
      name: "Registration Number",
      selector: (row) => (
        <Typography variant="body1" textTransform={"uppercase"}>
          {row.registrationNumber}
        </Typography>
      ),
    },
    {
      name: "Total Score",
      selector: (row) => (
        <Typography variant="body1" textTransform={"uppercase"}>
          {row.totalScore}
        </Typography>
      ),
    },
  ];
  return (
    <div>
      <div className="mt-5 mb-5">
        <Typography variant="h4" fontWeight={600}>
          {state} Candidates
        </Typography>

        <div className="mt-2">
          <Link href={`/registrations/${examId}`}>Back to registrations</Link>
        </div>

        <div className="mt-5">
          {data ? (
            <div>
              <DataTable
                title={
                  <Typography fontWeight={600}>
                    {data.examination.title}
                  </Typography>
                }
                data={data.candidates}
                columns={columns}
                pagination
                expandableRows
                expandableRowsComponent={expandableComponent}
              />
            </div>
          ) : (
            <Stack spacing={2}>
              <Skeleton variant="rectangular" height={60} />
              <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
              <Skeleton variant="rectangular" height={60} />
            </Stack>
          )}
        </div>
      </div>
    </div>
  );
}

export default StateData;
