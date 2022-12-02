import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { httpService } from "../../httpService";

export default function AdminResults() {
  const [exam, setExam] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const { id } = useParams();
  const GetData = async () => {
    // .get("/viewExamination/:id", viewCreatedExamination)
    const path = `viewExamination/${id}`;

    httpService(path).then((res) => setExam(res.data));

    httpService(`adminViewResult/${id}`).then((res) => setCandidates(res.data));
  };

  useEffect(() => {
    GetData();
  }, []);

  return <div></div>;
}
