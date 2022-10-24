import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CandidatesHandler from "../pages/CandidatesHandler";
import CentresHandler from "../pages/CentresHandler";
import CreatedExamination from "../pages/CreatedExamination";
import Dashboard from "../pages/Dashboard";
import DownloadExam from "../pages/DownloadExam";
import ExaminationDashboard from "../pages/ExaminationDashboard";
import ExaminationHandler from "../pages/ExaminationHandler";
import ExamQuestionUpload from "../pages/ExamQuestionUpload";
import QuestionBank from "../pages/QuestionBank";
import ResultsPage from "../pages/ResultsPage";
import ViewCentre from "../pages/ViewCentre";
import { loggedInUser } from "../httpService";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/LoginPage";
import ExaminationHistory from "../pages/ExaminationHistory";
import SubjectsControl from "../pages/SubjectsControl";
import SubjectQuestionBanks from "../pages/SubjectQuestionBanks";
import ExaminationRegistrationPage from "../pages/ExaminationRegistrationPage";

const privateRoutes = [
  { path: "/", component: Dashboard },
  { path: "/candidates", component: CandidatesHandler },
  { path: "/centres", component: CentresHandler },
  { path: "/centres/:id", component: ViewCentre },
  { path: "/examination", component: ExaminationHandler },
  { path: "/questionBank/:id", component: QuestionBank },
  { path: "/postExamQuestions/:id", component: ExamQuestionUpload },
  { path: "/examDownload", component: DownloadExam },
  { path: "/results", component: ResultsPage },
  { path: "/createdExamination", component: CreatedExamination },
  { path: "/dashboard/:id", component: ExaminationDashboard },
  { path: "/examHistory", component: ExaminationHistory },
  { path: "/examinationHistory", component: ExaminationHistory },
  { path: "/subjects", component: SubjectsControl },
  { path: "/subjects/:id", component: SubjectQuestionBanks },
  { path: "/exams/:id", component: ExaminationRegistrationPage },
  { path: "*", component: NotFound },
];

const publicRoutes = [
  { path: "/", component: LoginPage },
  { path: "/exams/:id", component: ExaminationRegistrationPage },
  { path: "*", component: NotFound },
];
function PublicRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {publicRoutes.map((c, i) => (
          <Route key={i} path={c.path} element={<c.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

function PrivateRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {privateRoutes.map((c, i) => (
          <Route key={i} path={c.path} element={<c.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

const MainRoutes = loggedInUser ? PrivateRoutes : PublicRoutes;
export default MainRoutes;
