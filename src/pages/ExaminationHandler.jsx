import React from "react";
import {
  Button,
  Stack,
  TextField,
  Typography,
  FormGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
} from "@mui/material";

import { pink } from "@mui/material/colors";
import { FavoriteBorder, Favorite } from "@mui/icons-material";
import { httpService } from "../httpService";
import { useState, useEffect } from "react";
import { Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ExaminationHandler() {
  const [loading, setLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  const [examination, setExamination] = useState("");

  const createNewExamination = async (e) => {
    e.preventDefault();

    Swal.fire({
      icon: "question",
      title: "Confirm",
      text: "Create new examination",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "createNewExamination";

        const res = await httpService.post(path, { name: examination });

        if (res) {
          Swal.fire({ icon: "success", title: "Success", text: res.data });
        }
      }
    });
  };

  useEffect(() => {}, []);

  return (
    <div>
      <div className="mt-5 mb-5">
        <div>
          <div className="d-flex justify-content-between">
            <div>
              <Typography fontWeight={600} variant="h4" gutterBottom>
                Examination Control
              </Typography>
              <hr />
            </div>
            <div>{processLoading ? <Spinner animation="grow" /> : null}</div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <form onSubmit={createNewExamination}>
                <TextField
                  label="Examination"
                  fullWidth
                  required
                  value={examination}
                  name="name"
                  helperText="Create a new examination"
                  onChange={(e) => setExamination(e.target.value)}
                />
                <br />
                <Button variant="contained" className="mt-2" type="submit">
                  {loading ? <Spinner animation="border" /> : "create"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
