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
import { httpService } from "../../httpService";
import Swal from "sweetalert2";

import { colors } from "../../util";
import { Stack } from "@mui/system";
import { Alert, Spinner, Table } from "react-bootstrap";
import { examTowns, states } from "../../utils";

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

  const rowClick = (e) => {
    window.location.assign(`/centres/${e}`);
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
          <Stack direction="row" spacing={2} className="mb-4">
            <div>
              <Typography fontWeight={600} variant="h4">
                CBT Centres
              </Typography>
            </div>
            <div>{processing ? <Spinner animation="grow" /> : null}</div>
          </Stack>
          <div className="row">
            <div className="col-lg-8">
              <Table hover>
                <thead>
                  <tr>
                    <th>
                      <Typography fontWeight={600}>Name</Typography>
                    </th>
                    <th>
                      <Typography fontWeight={600}>Centre Id</Typography>
                    </th>
                    <th>
                      <Typography fontWeight={600}>Password</Typography>
                    </th>
                    <th>
                      <Typography fontWeight={600}>Candidates</Typography>
                    </th>
                    <th>
                      <Typography fontWeight={600}>Capacity</Typography>
                    </th>
                    <th>
                      <Typography fontWeight={600}>Sessions</Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {centres.map((c, i) => (
                    <tr onClick={() => rowClick(c._id)} key={i}>
                      <td>
                        <Typography>{c.name}</Typography>
                      </td>
                      <td>
                        <Typography>{c.centreId}</Typography>
                      </td>
                      <td>
                        <Typography>{c.password}</Typography>
                      </td>
                      <td>
                        <Typography>{c.totalCandidates}</Typography>
                      </td>
                      <td>
                        <Typography>{c.capacity}</Typography>
                      </td>
                      <td>
                        <Typography>{c.sessions}</Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="border-start col-lg-4">
              <Typography fontWeight={600} gutterBottom>
                Create centre
              </Typography>

              <form onSubmit={createCentre}>
                <div className="">
                  <div className="">
                    <div className="mb-3">
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
                        name="examState"
                        label="State"
                        required
                        helperText="State for this centre"
                        value={data.examState}
                        onChange={handleChange}
                      >
                        {states.map((c, i) => (
                          <MenuItem key={i} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                  </div>
                  <div className="">
                    <div className="mb-3">
                      <TextField
                        select
                        required
                        fullWidth
                        name="examTown"
                        label="Exam Town"
                        helperText="Town where this centre is located"
                        value={data.examTown}
                        onChange={handleChange}
                      >
                        {examTowns.map((c, i) => (
                          <MenuItem key={i} value={c}>
                            {c}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="mb-3">
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
                    </div>
                    <div className="">
                      <TextField
                        label="Capacity"
                        helperText="Centre's capacity"
                        type="number"
                        value={data.capacity}
                        required
                        name="capacity"
                        onChange={handleChange}
                        fullWidth
                      />
                    </div>
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
                  </div>
                </div>
              </form>

              {/* <div className="mt-3">
                <Button color="error" onClick={deleteCentres}>
                  delete centres
                </Button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
