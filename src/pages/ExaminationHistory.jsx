import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { httpService } from "../httpService";
import { Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";

function ExaminationHistory() {
  const [data, setData] = useState([]);

  const viewCreatedExaminations = async () => {
    const path = "viewCreatedExaminations";

    const res = await httpService(path);

    if (res) {
      setData(res.data);
    }
  };

  useEffect(() => {
    viewCreatedExaminations();
  }, []);

  const columns = [
    { name: "TITLE", selector: (row) => row.title },
    {
      name: "DATE CREATED",
      selector: (row) => new Date(row.dateCreated).toDateString(),
    },
    {
      name: "ACTIVE",
      selector: (row) =>
        row.active ? <Badge color="success">ACTIVE</Badge> : null,
    },
  ];
  return (
    <div>
      <div className="mt-5 mb-5">
        <Typography variant="h4" fontWeight={600}>
          Examination History
        </Typography>

        <div className="mt-2">
          <DataTable data={data} columns={columns} pagination />
        </div>
      </div>
    </div>
  );
}

export default ExaminationHistory;
