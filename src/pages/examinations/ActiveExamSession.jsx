import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { Tabs, Tab } from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";
import ActiveExamCandidates from "./ActiveExamCandidates";
import ActiveExamCentres from "./ActiveExamCentres";

export default function ActiveExamSession() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="col-lg-4 mb-2">
          <Typography variant="h4" color="GrayText" fontWeight={700}>
            Active Exam Session
          </Typography>
        </div>
        <div>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={value} onChange={handleChange}>
                <Tab label="Candidates summary" value={0} />
                <Tab label="Centres report" value={1} />
                <Tab label="download & upload" value={2} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <ActiveExamCandidates />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ActiveExamCentres />
            </TabPanel>
          </TabContext>
        </div>
      </div>
    </div>
  );
}
