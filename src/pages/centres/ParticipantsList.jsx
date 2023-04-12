import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { Box, CircularProgress, Typography, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Table } from "react-bootstrap";

export default function ParticipantsList() {
  const { id } = useParams();
  const [centre, setCentre] = useState(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(0);
  const getCentre = async () => {
    setLoading(true);
    const { data } = await httpService(`aguila/centres/view/${id}`);

    if (data) {
      setCentre(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCentre();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="mt-5 mb-5 p-3">
      {loading && <CircularProgress />}
      {centre && (
        <div>
          <div className="alert alert-light col-lg-6 shadow-sm">
            <Typography varaint="caption" gutterBottom>
              Participants list
            </Typography>
            <Typography
              variant="h4"
              textTransform={"uppercase"}
              fontWeight={700}
            >
              {centre.name}
            </Typography>
          </div>
          <div className="mt-2">
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <TabList onChange={handleChange}>
                  {centre.sessions.map((c, i) => (
                    <Tab key={i} label={c} value={i}></Tab>
                  ))}
                </TabList>
              </Box>
              {centre.sessions.map((c, i) => (
                <SessionPanel session={c} centre={id} value={i} />
              ))}
            </TabContext>
          </div>
        </div>
      )}
    </div>
  );
}

function SessionPanel({ session, centre, value }) {
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState([]);

  const getCandidates = async () => {
    setLoading(true);
    const { data } = await httpService.post(
      "aguila/centres/sessioncandidates",
      { session, centre }
    );

    if (data) {
      setCandidates(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getCandidates();
  }, []);

  return (
    <TabPanel value={value}>
      {loading && <CircularProgress />}
      <div className="">
        <Table bordered>
          <thead>
            <tr>
              <th>S/N</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Reg Number</th>
              <th>Seat Number</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c, i) => (
              <tr key={i}>
                <td>
                  <Typography>{i + 1}</Typography>
                </td>
                <td>
                  <Typography>{c.firstName}</Typography>
                </td>
                <td>
                  <Typography>{c.lastName}</Typography>
                </td>
                <td>
                  <Typography textTransform={"uppercase"}>
                    {c.registrationNumber}
                  </Typography>
                </td>
                <td>
                  <Typography>{c.seatNumber}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </TabPanel>
  );
}
