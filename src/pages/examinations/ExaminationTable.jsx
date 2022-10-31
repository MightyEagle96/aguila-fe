import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { Link, Typography } from "@mui/material";
function ExaminationTable() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const getExamination = async () => {
    const path = `viewExamination/${id}`;

    const res = await httpService.get(path);

    if (res) {
      setExamination(res.data);
    }
  };

  useEffect(() => {
    getExamination();
  }, []);
  return (
    <div>
      <div className="mt-5 mb-5">
        {examination ? (
          <div>
            <Link href={`/examSchedule/${id}`}>Back to Schedule</Link>
            <Typography variant="h4" fontWeight={600}>
              {examination.title} examination table
            </Typography>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default ExaminationTable;
