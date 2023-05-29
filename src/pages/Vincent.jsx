import React, { useState, useEffect } from "react";
import { httpService } from "../httpService";
import { CircularProgress, Typography } from "@mui/material";
import { Table } from "react-bootstrap";

export default function VincentWork() {
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService("vincent");

    if (data) setResult(data);

    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="p-3">
        {loading && <CircularProgress />}
        {result.map((c, i) => (
          <div className="mb-4" key={i}>
            <div>
              <Typography variant="h5" fontWeight={600} color="GrayText">
                {i + 1}. {c.institution}
              </Typography>
            </div>
            <Table>
              <thead>
                <tr>
                  <th>S/N</th>
                  <th>Names</th>
                  <th>Registration Number</th>
                  <th>Qualification</th>
                  <th>Exam Year</th>
                </tr>
              </thead>
              <tbody>
                {c.candidates.map((d, k) => (
                  <tr>
                    <td className="col-lg-1">{k + 1}</td>
                    <td className="col-lg-3">{d.names}</td>
                    <td className="col-lg-3">{d.regNumber}</td>
                    <td className="col-lg-3">{d.qualification}</td>
                    <td className="col-lg-2">{d.examYear}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ))}
      </div>
    </div>
  );
}
