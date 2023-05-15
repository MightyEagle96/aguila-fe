import { Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { httpService } from "../../httpService";

export default function QuestionImages() {
  const [images, setImages] = useState([]);
  const getData = async () => {
    const { data } = await httpService.get(
      "aguila/subject/questionbank/questionimages"
    );

    if (data) {
      setImages(data);
    }
  };
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="mt-5">
        <div className="col-lg-4">
          <Typography variant="h4" fontWeight={700}>
            Question Images
          </Typography>
        </div>
      </div>
    </div>
  );
}
