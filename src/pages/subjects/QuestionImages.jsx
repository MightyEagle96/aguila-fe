import { CircularProgress, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { httpService } from "../../httpService";

export default function QuestionImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    setLoading(true);
    const { data } = await httpService.get(
      "aguila/subject/questionbank/questionimages"
    );

    if (data) {
      setImages(data);
    }

    setLoading(false);
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
        {loading && <CircularProgress />}
        <div className="row">
          {images.map((c, i) => (
            <div className="col-lg-4" key={i}>
              <img className="img-fluid" src={c.imageURL} alt="" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
