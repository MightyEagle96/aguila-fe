import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CandidatesHandler from "../pages/candidates/CandidatesHandler";
import CentresHandler from "../pages/centres/CentresHandler";
import CreatedExamination from "../pages/CreatedExamination";
import Dashboard from "../pages/Dashboard";
import DownloadExam from "../pages/DownloadExam";
import ExaminationDashboard from "../pages/examinations/ExaminationDashboard";
import ExaminationHandler from "../pages/examinations/ExaminationHandler";
import ExamQuestionUpload from "../pages/examinations/ExamQuestionUpload";
import QuestionBank from "../pages/examinations/QuestionBank";
import ResultsPage from "../pages/ResultsPage";
import ViewCentre from "../pages/centres/ViewCentre";
import { loggedInUser } from "../httpService";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/LoginPage";
import ExaminationHistory from "../pages/examinations/ExaminationHistory";
import SubjectsControl from "../pages/examinations/SubjectsControl";
import SubjectQuestionBanks from "../pages/examinations/SubjectQuestionBanks";
import ExaminationRegistrationPage from "../pages/registrations/ExaminationRegistrationPage";
import ViewExamRegistrations from "../pages/registrations/ViewExamRegistrations";
import StateData from "../pages/registrations/StateData";
import ExaminationSchedule from "../pages/examinations/ExaminationSchedule";
import ExaminationTable from "../pages/examinations/ExaminationTable";

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
  { path: "/registrations/:id", component: ViewExamRegistrations },
  { path: "/:examId/:state", component: StateData },
  { path: "/examSchedule/:id", component: ExaminationSchedule },
  { path: "/examinationTable/:id", component: ExaminationTable },
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
