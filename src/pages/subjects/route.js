import React from "react";
import { Route, Routes } from "react-router-dom";

import NotFound from "../NotFound";
import { loggedInUser } from "../../httpService";
import AllSubjects from "./AllSubjects";
import ViewSubject from "./ViewSubject";
import SubjectQuestionBank from "./SubjectQuestionBank";
import PreviewExam from "./PreviewExam";
import QuestionImages from "./QuestionImages";

const privateRoutes = [
  { path: "/", component: AllSubjects },
  { path: "/view/:id", component: ViewSubject },
  { path: "/questionBank/:id", component: SubjectQuestionBank },
  { path: "/previewexam/:id", component: PreviewExam },
  { path: "/questionimages", component: QuestionImages },
  { path: "*", component: NotFound },
];

const publicRoutes = [{ path: "*", component: NotFound }];

export default function SubjectRoutes() {
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
