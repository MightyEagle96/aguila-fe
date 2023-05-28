import React from "react";
import { Route, Routes } from "react-router-dom";

import NotFound from "../NotFound";
import { loggedInUser } from "../../httpService";
import ExaminationHandler from "./ExaminationHandler";
import ExaminationSchedule from "./ExaminationSchedule";
import ExamResults from "./ExamResults";
import SessionReport from "./SessionReport";
import ActiveExamSession from "./ActiveExamSession";

const privateRoutes = [
  { path: "/", component: ExaminationHandler },
  { path: "/schedule/:id", component: ExaminationSchedule },
  { path: "/results/:id", component: ExamResults },
  { path: "/sessionreport", component: SessionReport },
  { path: "/activesession", component: ActiveExamSession },
  { path: "*", component: NotFound },
];

const publicRoutes = [{ path: "*", component: NotFound }];
export default function ExaminationRoutes() {
  return (
    <>
      {loggedInUser ? (
        <Routes>
          {privateRoutes.map((c, i) => (
            <Route key={i} path={c.path} element={<c.component />} />
          ))}
        </Routes>
      ) : (
        <Routes>
          {publicRoutes.map((c, i) => (
            <Route key={i} path={c.path} element={<c.component />} />
          ))}
        </Routes>
      )}
    </>
  );
}

export function sessionsList() {
  const sessions = [];
  for (let i = 0; i < 10; i++) {
    sessions.push(`Session ${i + 1}`);
  }

  return sessions;
}
