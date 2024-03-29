import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { httpService } from "../../httpService";

export default function ActiveExamCentres({ examSession, examination }) {
  const [result, setResult] = useState([]);
  const getData = async () => {
    const { data } = await httpService.post("aguila/centres/sessionreport", {
      examination,
      examSession,
    });
    if (data) setResult(data);
  };
  useEffect(() => {
    getData();

    const interval = setInterval(() => {
      getData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div>
      <div className="mb-3">
        <div className="col-lg-4 p-3 alert alert-light shadow-sm">
          <Typography>Centres for this exam session</Typography>
          <div className="mt-4">
            <Typography variant="h4">200</Typography>
          </div>
        </div>
        <div className="mt-3">
          <Table striped borderless>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Centre ID</th>
                <th>Assigned Candidates</th>
                <th>Time Downloaded</th>
                <th>Time Uploaded</th>
                <th>Number Started</th>
                <th>Number Submitted</th>
              </tr>
            </thead>
            <tbody>
              {result.map((c, i) => (
                <tr>
                  <td>{i + 1}</td>
                  <td>
                    <Typography>{c.centre.centreId}</Typography>
                  </td>
                  <td>
                    <Typography>{c.assignedCandidates}</Typography>
                  </td>
                </tr>
              ))}
              {/* <tr>
                <td>1</td>
                <td>123</td>
                <td>150</td>
                <td>{new Date().toLocaleTimeString()}</td>
                <td>{new Date().toLocaleTimeString()}</td>
                <td>1</td>
                <td>1</td>
              </tr> */}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
