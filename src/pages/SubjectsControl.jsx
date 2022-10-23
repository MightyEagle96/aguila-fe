import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import { httpService } from "../httpService";

export default function SubjectsControl() {
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");

  const viewSubjects = async () => {
    const path = "viewSubjects";

    const res = await httpService.get(path);
    if (res) setSubjects(res.data);
  };

  useEffect(() => {
    viewSubjects();
  }, []);

  const createSubject = async (e) => {
    e.preventDefault();
    const path = "createNewSubject";

    const res = await httpService.post(path, { name: subject });

    if (res) {
      viewSubjects();
      setSubject("");
      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data,
        timer: 3000,
      });
    }
  };

  const columns = [{ name: "SUBJECTS", selector: (row) => row.name }];

  const subjectDetails = (e) => {
    window.location.assign(`/subjects/${e._id}`);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <Typography variant="h4" fontWeight={600} gutterBottom color="blue">
          Subjects Control
        </Typography>
        <div className="row">
          <div className="col-lg-8">
            <div>
              <DataTable
                data={subjects}
                columns={columns}
                pagination
                onRowClicked={subjectDetails}
                pointerOnHover
                highlightOnHover
              />
            </div>
          </div>
          <div className="col-lg-4 border-start">
            <Typography variant="body2">Create new subject</Typography>
            <div className="mt-3">
              <form onSubmit={createSubject}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    required
                    label="Subject Name"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <Button variant="contained" color="secondary" type="submit">
                    create
                  </Button>
                </Stack>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
