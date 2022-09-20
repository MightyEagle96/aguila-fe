import React, { useState, useEffect } from "react";
import { Button, Typography } from "@mui/material";
import { Badge, Table } from "react-bootstrap";
import { httpService } from "../httpService";
import Swal from "sweetalert2";

export default function CreatedExamination() {
  const [data, setData] = useState([]);

  const viewCreatedExaminations = async () => {
    const path = "viewCreatedExaminations";

    const res = await httpService.get(path);
    if (res) {
      setData(res.data);
    }
  };

  const activateExamination = (id) => {
    Swal.fire({
      icon: "question",
      title: "Make active",
      text: "Do you want to make this particular examination the active examination for all centres to download?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = `activateExamination/${id}`;
        const res = await httpService.get(path);
        viewCreatedExaminations();
        if (res) {
          Swal.fire({
            icon: "success",
            title: "SUCCESS",
            text: res.data,
            timer: 3000,
          });
        }
      }
    });
  };

  const deactivateExamination = (id) => {
    Swal.fire({
      icon: "question",
      title: "Make inactive",
      text: "Do you want to deactivate this examination",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = `deactivateExamination/${id}`;
        const res = await httpService.get(path);
        viewCreatedExaminations();
        if (res) {
          Swal.fire({
            icon: "success",
            title: "SUCCESS",
            text: res.data,
            timer: 3000,
          });
        }
      }
    });
  };
  useEffect(() => {
    viewCreatedExaminations();
  }, []);
  return (
    <div>
      <div className="container mt-2">
        <Typography variant="h5" fontWeight={600}>
          CREATED EXAMINATIONS
        </Typography>
        <div className="mt-3">
          <Table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Question Banks</th>
                <th>Date Created</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr>
                  <td>{c.title}</td>
                  <td>{c.questionBanks.length}</td>
                  <td>{new Date(c.dateCreated).toDateString()}</td>
                  <td>
                    {c.active ? (
                      <Badge bg="success">ACTIVE</Badge>
                    ) : (
                      <Badge bg="danger">INACTIVE</Badge>
                    )}
                  </td>
                  <td>
                    {!c.active ? (
                      <Button onClick={() => activateExamination(c._id)}>
                        activate
                      </Button>
                    ) : (
                      <Button onClick={() => deactivateExamination(c._id)}>
                        deactivate
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
