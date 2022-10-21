import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import { httpService } from "../httpService";
import Swal from "sweetalert2";
import DataTable from "react-data-table-component";
import { colors } from "../util";
import { Stack } from "@mui/system";
import { Spinner } from "react-bootstrap";
import { states } from "../utils";

export default function CentresHandler() {
  const defaultData = { name: "", centreId: "", password: "" };
  const [data, setData] = useState(defaultData);
  const [processing, setProcessing] = useState(false);
  const [centres, setCentres] = useState([]);
  const [type, setType] = useState("password");

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      setType("text");
    } else {
      setType("password");
    }
  };
  const createCentre = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Create Centre",
      text: "Do you wish to create this centre?",
      cancelButtonColor: colors.primary,
      showCancelButton: true,
      cancelButtonText: "NO",
      confirmButtonColor: colors.secondary,
      confirmButtonText: "YES",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setProcessing(true);
          const path = "createCentre";

          const res = await httpService.post(path, data);
          if (res) {
            setData(defaultData);
            viewCentres();
            setProcessing(false);
          }
        } catch (error) {
          setProcessing(false);
        }
      }
    });
  };

  const viewCentres = async () => {
    setProcessing(true);
    const path = "viewCentres";

    const res = await httpService(path);

    if (res) {
      setCentres(res.data);
      setProcessing(false);
    }
  };

  useEffect(() => {
    viewCentres();
  }, []);
  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const columns = [
    { name: "Centre Name", selector: (row) => row.name },
    { name: "Centre Id", selector: (row) => row.centreId },
    { name: "Candidates", selector: (row) => row.candidates.length },
  ];

  const rowClick = (e) => {
    window.location.assign(`/centres/${e._id}`);
  };

  const deleteCentres = () => {
    Swal.fire({
      icon: "question",
      title: "Confirm",
      text: "Do you wish to delete all centes?",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        const path = "deleteCentres";

        const res = await httpService.delete(path);
        if (res) {
          viewCentres();
          Swal.fire({ icon: "success", title: res.data });
        }
      }
    });
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="">
          <Stack direction="row" spacing={2}>
            <div>
              <Typography fontWeight={600} variant="h4">
                CBT Centres
              </Typography>
            </div>
            <div>{processing ? <Spinner animation="grow" /> : null}</div>
          </Stack>
          <div className="row">
            <div className="col-md-8 ">
              <DataTable
                data={centres}
                columns={columns}
                pagination
                onRowClicked={rowClick}
                highlightOnHover
                pointerOnHover
              />
            </div>
            <div className="col-md-4">
              <Typography fontWeight={600} gutterBottom>
                Create centre
              </Typography>

              <form onSubmit={createCentre}>
                <div className="mb-3 mt-3">
                  <TextField
                    label="Centre Name"
                    helperText="Name for this centre"
                    name="name"
                    value={data.name}
                    multiline
                    required
                    fullWidth
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <TextField
                    label="Centre ID"
                    name="centreId"
                    helperText="ID for this centre"
                    value={data.centreId}
                    required
                    fullWidth
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <TextField
                    select
                    fullWidth
                    name="state"
                    label="State"
                    helperText="State for this centre"
                    value={data.state}
                    onChange={handleChange}
                  >
                    {states.map((c, i) => (
                      <MenuItem key={i} value={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </TextField>
                </div>
                <div className="">
                  <TextField
                    label="Password"
                    helperText="Centre's password"
                    type={type}
                    value={data.password}
                    required
                    name="password"
                    onChange={handleChange}
                    fullWidth
                  />
                </div>{" "}
                <div className="mb-2">
                  <FormGroup>
                    <FormControlLabel
                      onChange={handleCheckbox}
                      control={<Checkbox />}
                      label="Show Password"
                    />
                  </FormGroup>
                </div>
                <Button variant="contained" type="submit">
                  Create Centre
                </Button>
              </form>

              <div className="mt-3">
                <Button color="error" onClick={deleteCentres}>
                  delete centres
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
