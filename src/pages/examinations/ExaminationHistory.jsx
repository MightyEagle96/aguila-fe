import React, { useState, useEffect } from "react";
import { Link, Typography } from "@mui/material";
import { httpService } from "../../httpService";
import { Badge, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";

function ExaminationHistory() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const viewCreatedExaminations = async () => {
    setLoading(true);
    const path = "viewCreatedExaminations";

    const res = await httpService(path);

    if (res) {
      setData(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    viewCreatedExaminations();
  }, []);

  const columns = [
    { name: "TITLE", selector: (row) => row.title },
    {
      name: "DATE CREATED",
      selector: (row) => new Date(row.createdOn).toDateString(),
    },
    {
      name: "STATUS",
      selector: (row) =>
        row.active ? <Badge color="success">ACTIVE</Badge> : null,
    },
    {
      name: "ACTION",
      selector: (row) => (
        <Link href={`/results/admin/${row._id}`}>view results</Link>
      ),
    },
  ];
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="row">
          <div className="col-lg-3">
            <Typography variant="h4" fontWeight={600}>
              Examination History
            </Typography>
          </div>
          <div className="col-lg-3">
            {loading ? <Spinner animation="border" /> : null}
          </div>
        </div>

        <div className="mt-2">
          <DataTable data={data} columns={columns} pagination />
        </div>
      </div>
    </div>
  );
}

export default ExaminationHistory;
