import React, { useState, useEffect } from "react";
import { Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { httpService } from "../httpService";

export default function DownloadExam() {
  const [centres, setCentres] = useState([]);
  const getCentres = async () => {
    const path = "viewCentres";
    const res = await httpService.get(path);

    if (res) {
      setCentres(res.data);
    }
  };

  const columns = [
    { name: "Centre Name", selector: (row) => row.name },
    { name: "Centre Id", selector: (row) => row.centreId },
    {
      name: "Downloaded",
      selector: (row) =>
        row.downloadedExam ? (
          <Badge bg="success">YES</Badge>
        ) : (
          <Badge bg="danger">NO</Badge>
        ),
    },
  ];
  useEffect(() => {
    getCentres();
  }, []);
  return (
    <div>
      <div className="mt-3">
        <div className="container">
          <DataTable data={centres} columns={columns} pagination />
        </div>
      </div>
    </div>
  );
}
