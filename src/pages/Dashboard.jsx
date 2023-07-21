import React from "react";
import { Typography } from "@mui/material";
import {
  BookOutlined,
  CloudDoneOutlined,
  HouseOutlined,
  Laptop,
  PeopleAltOutlined,
} from "@mui/icons-material";

function Dashboard() {
  return (
    <div>
      <div className="mt-5 mb-5 p-3">
        <div className="row">
          <TotalExaminations />
          <TotalCandidates />
          <TotalSubjects />
          <TotalCentres />
          <TotalQuestionBanks />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

function TotalExaminations() {
  return (
    <div className="col-lg-3 mb-4 me-4 shadow-sm p-3 bg-light d-flex justify-content-between align-items-center">
      <div>
        <Laptop />
        <Typography>Examinations</Typography>
      </div>
      <div>
        <Typography>10</Typography>
      </div>
    </div>
  );
}

function TotalCandidates() {
  return (
    <div className="col-lg-3 mb-4 me-4 shadow-sm p-3 bg-light d-flex justify-content-between align-items-center">
      <div>
        <PeopleAltOutlined />
        <Typography>Candidates</Typography>
      </div>
      <div>
        <Typography>10</Typography>
      </div>
    </div>
  );
}
function TotalSubjects() {
  return (
    <div className="col-lg-3 mb-4 me-4 shadow-sm p-3 bg-light d-flex justify-content-between align-items-center">
      <div>
        <BookOutlined />
        <Typography>Subjects</Typography>
      </div>
      <div>
        <Typography>10</Typography>
      </div>
    </div>
  );
}
function TotalCentres() {
  return (
    <div className="col-lg-3 mb-4 me-4 shadow-sm p-3 bg-light d-flex justify-content-between align-items-center">
      <div>
        <HouseOutlined />
        <Typography>Centers</Typography>
      </div>
      <div>
        <Typography>10</Typography>
      </div>
    </div>
  );
}
function TotalQuestionBanks() {
  return (
    <div className="col-lg-3 mb-4 me-4 shadow-sm p-3 bg-light d-flex justify-content-between align-items-center">
      <div>
        <CloudDoneOutlined />
        <Typography>Question Banks</Typography>
      </div>
      <div>
        <Typography>10</Typography>
      </div>
    </div>
  );
}
