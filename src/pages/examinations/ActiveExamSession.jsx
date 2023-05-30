import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import ActiveExamCandidates from "./ActiveExamCandidates";
import ActiveExamCentres from "./ActiveExamCentres";
import { httpService } from "../../httpService";
import { AlertContext } from "../../contexts/AlertContext";

export default function ActiveExamSession() {
  const [value, setValue] = useState("1");

  const [activeSession, setActiveSession] = useState(null);
  const { setAlertData } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const viewActiveSession = async () => {
    setLoading(true);
    const { data, error } = await httpService(
      "aguila/examination/session/active"
    );

    if (data) {
      setActiveSession(data);
    }
    if (error) {
      setAlertData({ message: error, severity: "error", open: true });
    }
    setLoading(false);
  };

  useEffect(() => {
    viewActiveSession();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        {loading && <CircularProgress />}
        <div className="col-lg-4 mb-2">
          <Typography variant="h4" color="GrayText" fontWeight={700}>
            Active Exam Session
          </Typography>
        </div>
        {activeSession && (
          <div>
            <div
              className="col-lg-4 p-3 text-white"
              style={{ backgroundColor: "#479bb4" }}
            >
              <div>
                <Typography variant="overline">Exam</Typography>
                <Typography
                  variant="h5"
                  textTransform={"uppercase"}
                  fontWeight={700}
                >
                  {activeSession.examination.title}, {activeSession.session}
                </Typography>
              </div>
            </div>
            <div className="mt-4">
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange}>
                    <Tab label="Candidates summary" value={0} />
                    <Tab label="Centres report" value={1} />
                    <Tab label="download & upload" value={2} />
                  </TabList>
                </Box>
                <TabPanel value={0} index={0}>
                  <ActiveExamCandidates id={activeSession._id} />
                </TabPanel>
                <TabPanel value={1} index={1}>
                  <ActiveExamCentres />
                </TabPanel>
                <TabPanel value={2} index={2}>
                  <ActiveExamCentres />
                </TabPanel>
              </TabContext>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
