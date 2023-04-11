import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { CircularProgress, IconButton, Link, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { AddTask, Delete } from "@mui/icons-material";
import { AlertContext } from "../../contexts/AlertContext";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";

export default function ViewSubject() {
  const { setAlertData } = useContext(AlertContext);
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [subject, setSubject] = useState(null);
  const [creating, setCreating] = useState(false);

  const getSubject = async () => {
    setLoading(true);
    const { data } = await httpService(`aguila/subject/view/${id}`);

    if (data) {
      setSubject(data);
    }
    setLoading(false);
  };

  const addQuestionBank = async () => {
    setCreating(true);
    const { data, error } = await httpService(
      `aguila/subject/questionbank/add/${id}`
    );

    if (data) {
      viewQuestionBanks();
      setAlertData({ message: data, severity: "success", open: true });
    }
    if (error) {
      setAlertData({ message: error, severity: "error", open: true });
    }
    setCreating(false);
  };
  const viewQuestionBanks = async () => {
    setLoading(true);
    const { data, error } = await httpService(
      `aguila/subject/questionbank/view/${id}`
    );

    if (data) {
      setQuestionBanks(data);
    }
    if (error) {
      setAlertData({ message: error, severity: "error", open: true });
    }
    setLoading(false);
  };

  useEffect(() => {
    getSubject();
    viewQuestionBanks();
  }, []);
  return (
    <div className="mt-5 mb-5 p-3">
      {loading && <CircularProgress />}
      {subject && (
        <>
          <div className="alert alert-light col-lg-6">
            <Typography variant="caption">Subject</Typography>
            <Typography
              variant="h4"
              textTransform={"uppercase"}
              fontWeight={700}
            >
              {subject.name}
            </Typography>
          </div>
          <div className="mt-2">
            <LoadingButton
              endIcon={<AddTask />}
              loadingPosition="end"
              onClick={addQuestionBank}
              loading={creating}
            >
              add question bank
            </LoadingButton>
          </div>
          <div className="mt-2 col-lg-6">
            <Table bordered>
              <thead>
                <tr>
                  <th>Question Banks</th>
                  <th>Questions</th>
                  <th>View Questions</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {questionBanks.map((c, i) => (
                  <tr key={i}>
                    <td>
                      <Typography>Bank {i + 1}</Typography>
                    </td>
                    <td>
                      <Typography>{c.questions}</Typography>
                    </td>
                    <td>
                      <Link href={`/subjects/questionbank/${c._id}`}>view</Link>
                    </td>
                    <td>
                      <DeleteQuestionBank
                        id={c._id}
                        viewQuestionBanks={viewQuestionBanks}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}

function DeleteQuestionBank({ id, viewQuestionBanks }) {
  const { setAlertData } = useContext(AlertContext);
  const [loading, setLoading] = useState(false);
  const deleteQuestionBank = () => {
    Swal.fire({
      icon: "question",
      title: "Delete Question bank",
      text: "Are you sure you want to delete this question bank?",
      showCancelButton: true,
    }).then(async () => {
      setLoading(true);
      const { data } = await httpService.delete(
        `aguila/subject/questionbank/delete/${id}`
      );

      if (data) {
        viewQuestionBanks();
        setAlertData({ message: data, open: true, severity: "success" });
      }
      setLoading(false);
    });
  };
  return (
    <>
      {loading ? (
        <CircularProgress size={20} />
      ) : (
        <IconButton onClick={deleteQuestionBank}>
          <Delete />
        </IconButton>
      )}
    </>
  );
}
