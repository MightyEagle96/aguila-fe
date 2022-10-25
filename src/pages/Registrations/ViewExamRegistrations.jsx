import { Skeleton, Stack, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";

function ViewExamRegistrations() {
  const [data, setData] = useState(null);
  const { id } = useParams();

  const getData = async () => {
    const path = `registrations/${id}`;

    const res = await httpService.get(path);

    if (res) {
      setData(res.data);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const expandableComponent = ({ data }) => {
    return (
      <div className="alert alert-success">
        <Typography variant="caption" gutterBottom>
          Subject Combinations
        </Typography>
        <Typography>
          {data.subjectCombinations.map((c) => c.name).join(", ")}
        </Typography>
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
      name: "Score",
      selector: (row) => (
        <Typography variant="body1" textTransform={"uppercase"}>
          {row.score}
        </Typography>
      ),
    },
  ];
  return (
    <div>
      <div className="container">
        <div className="mb-5 mt-5">
          {data ? (
            <div>
              <div className="mb-4">
                <Typography variant="h4" fontWeight={600}>
                  {data.examination.title} Data dashboard
                </Typography>
              </div>
              <DataTable
                title={
                  <Typography textTransform={"uppercase"}>
                    Candidates' Data
                  </Typography>
                }
                data={data.registrations}
                columns={columns}
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

export default ViewExamRegistrations;
