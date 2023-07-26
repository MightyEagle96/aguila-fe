import React, { useEffect, useState } from "react";
import { CircularProgress, Typography } from "@mui/material";
import {
  BookOutlined,
  CloudDoneOutlined,
  HouseOutlined,
  Laptop,
} from "@mui/icons-material";
import { httpService } from "../httpService";

function Dashboard() {
  const [result, setResult] = useState({});
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService.get("aguila/dashboard");

    if (data) setResult(data);
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5 p-3">
        <div className="mb-3">
          <div className="row">
            <div className="col-lg-3">
              <Typography variant="h4" fontWeight={300}>
                DASHBOARD {loading && <CircularProgress size={20} />}
              </Typography>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 mb-4 me-4  border rounded-3 p-3 d-flex justify-content-between align-items-center">
            <div>
              <Laptop style={{ height: 50, width: 50 }} />
              <Typography variant="h6" fontWeight={300}>
                Examinations
              </Typography>
            </div>
            <div>
              <Typography variant="h4" fontWeight={300}>
                {result.examinations}
              </Typography>
            </div>
          </div>
          <div className="col-lg-4 mb-4 me-4  border rounded-3 p-3 d-flex justify-content-between align-items-center">
            <div>
              <BookOutlined style={{ height: 50, width: 50 }} />
              <Typography variant="h6" fontWeight={300}>
                Subjects
              </Typography>
            </div>
            <div>
              <Typography variant="h4" fontWeight={300}>
                {result.subjects}
              </Typography>
            </div>
          </div>
          <div className="col-lg-4 mb-4 me-4   border rounded-3 p-3 d-flex justify-content-between align-items-center">
            <div>
              <HouseOutlined style={{ height: 50, width: 50 }} />
              <Typography variant="h6" fontWeight={300}>
                Centres
              </Typography>
            </div>
            <div>
              <Typography variant="h4" fontWeight={300}>
                {result.centres}
              </Typography>
            </div>
          </div>
          <div className="col-lg-4 mb-4 me-4  border rounded-3 p-3  d-flex justify-content-between align-items-center">
            <div>
              <CloudDoneOutlined style={{ height: 50, width: 50 }} />
              <Typography variant="h6" fontWeight={300}>
                Question Banks
              </Typography>
            </div>
            <div>
              <Typography variant="h4" fontWeight={300}>
                {result.questionBanks}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
