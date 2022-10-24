import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../httpService";
import { Typography } from "@mui/material";

function ExaminationRegistrationPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const examRegistrationPage = async () => {
    const path = `exam/${id}`;

    const res = await httpService(path);

    if (res) {
      setData(res.data);
    }
  };

  useEffect(() => {
    examRegistrationPage();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          {data ? (
            <div>
              <Typography variant="h4" fontWeight={600}>
                {data.title} Registration Portal
              </Typography>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ExaminationRegistrationPage;
