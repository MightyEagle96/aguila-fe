import { CircularProgress, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import React, { useEffect, useState } from "react";
import { Save } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import Swal from "sweetalert2";

export default function CandidatesList() {
  const { id } = useParams();
  const [examination, setExamination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [limit, setLimit] = useState(0);

  const getExamination = async () => {
    setLoading(true);

    const { data } = await httpService(`aguila/examination/${id}`);
    if (data) {
      setExamination(data);
    }
    setLoading(false);
  };
  useEffect(() => {
    getExamination();
  }, []);

  const createDummyCandidates = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: `Create ${limit} dummy candidates?`,
      showCancelButton: true,
    }).then(async (result) => {
      setLoading(true);
      if (result.isConfirmed) {
        const { data, error } = await httpService.post(
          `aguila/candidates/${id}/createdummycandidates`,
          { limit }
        );

        if (data) {
          console.log(data);
        }
        setLoading(false);
      }
    });
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        {loading && <CircularProgress />}
        {examination && (
          <div className="row">
            <div className="alert alert-light col-lg-6">
              <Typography
                textTransform={"uppercase"}
                variant="h4"
                fontWeight={600}
              >
                {examination.title}
              </Typography>
              <hr />
              <Typography>Candidates List</Typography>
            </div>
            <div className="col-lg-4">
              <Typography gutterBottom>Dummy Candidates</Typography>
              <form onSubmit={createDummyCandidates}>
                <TextField
                  limit
                  type="number"
                  min={1}
                  onChange={(e) => setLimit(e.target.value)}
                />
                <LoadingButton type="submit" endIcon={<Save />}>
                  create{" "}
                </LoadingButton>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
