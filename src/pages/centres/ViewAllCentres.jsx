import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Link,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Cancel, Home, People, Refresh, Restore } from "@mui/icons-material";
import Swal from "sweetalert2";

import { httpService } from "../../httpService";
import { Table } from "react-bootstrap";
import { AlertContext } from "../../contexts/AlertContext";
export default function ViewAllCentres() {
  const { setAlertData } = useContext(AlertContext);
  const [limit, setLimit] = useState(0);
  const [creating, setCreating] = useState(false);

  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(false);
  const createCentres = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: `Create ${limit.toLocaleString()} centres?`,
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        setCreating(true);
        const { data, error } = await httpService.post(
          `aguila/centres/create`,
          {
            limit,
          }
        );
        if (data) {
          setAlertData({ severity: "success", message: data, open: true });

          viewCentres();
        }
        if (error) {
          setAlertData({ severity: "error", message: error, open: true });
        }
        setCreating(false);
      }
    });
  };

  const viewCentres = async () => {
    setLoading(true);
    const { data } = await httpService("aguila/centres/all");

    if (data) {
      setCentres(data);
    }
    setLoading(false);
  };

  return (
    <div>
      {loading && <CircularProgress />}
      <div className="col-lg-2">
        <Typography gutterBottom>Create CBT centre</Typography>
        <form onSubmit={createCentres}>
          <TextField
            fullWidth
            type="number"
            onChange={(e) => setLimit(e.target.value)}
          />
          <div className="mt-2">
            <LoadingButton
              type="submit"
              variant="contained"
              endIcon={<Home />}
              loading={creating}
              loadingPosition="end"
            >
              create centres
            </LoadingButton>
          </div>
        </form>
      </div>
      <div className="row mt-3">
        <div className="col-lg-8">
          <Table bordered>
            <thead>
              <tr>
                <th>S/N</th>
                <th>Centre Name</th>
                <th>Capacity</th>
                <th>Centre ID</th>
                <th>Password</th>
                <th>Sessions</th>
                <th>Candidates</th>
              </tr>
            </thead>
            <tbody>
              {centres.length > 0 ? (
                <>
                  {centres.map((c, i) => (
                    <tr key={i}>
                      <td className="col-lg-1">
                        <Typography>{i + 1}</Typography>
                      </td>
                      <td>
                        <Typography>{c.name}</Typography>
                      </td>
                      <td>
                        <Typography>{c.capacity}</Typography>
                      </td>
                      <td>
                        <Typography>{c.centreId}</Typography>
                      </td>
                      <td>
                        <Typography>{c.password}</Typography>
                      </td>
                      <td>
                        <Typography>{c.sessionLength}</Typography>
                      </td>
                      <td>
                        <Button href={`/centres/participants/${c._id}`}>
                          {c.candidates}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan={12} className="mt-5 mb-5">
                    <Typography textAlign={"center"}>NO DATA FOUND</Typography>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
