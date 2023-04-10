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

import ExaminationRegistrationPage from "../pages/registrations/ExaminationRegistrationPage";
import ViewExamRegistrations from "../pages/registrations/ViewExamRegistrations";
import StateData from "../pages/registrations/StateData";
import ExaminationSchedule from "../pages/examinations/ExaminationSchedule";
import ExaminationTable from "../pages/examinations/ExaminationTable";
import AdminResults from "../pages/results/AdminResults";
import SideMenu from "../components/SideMenu";
import EbubeCV from "../pages/EbubeCV";
import MyFooter from "../components/MyFooter";
import SubjectRoutes from "../pages/subjects/route";
import ExaminationRoutes from "../pages/examinations/route";

const privateRoutes = [
  { path: "/", component: Dashboard },
  { path: "/candidates", component: CandidatesHandler },
  { path: "/centres", component: CentresHandler },
  { path: "/centres/:id", component: ViewCentre },
  { path: "/examination/*", component: ExaminationRoutes },
  { path: "/questionBank/:id", component: QuestionBank },
  { path: "/postExamQuestions/:id", component: ExamQuestionUpload },
  { path: "/examDownload", component: DownloadExam },
  { path: "/results", component: ResultsPage },
  { path: "/createdExamination", component: CreatedExamination },
  { path: "/dashboard/:id", component: ExaminationDashboard },
  { path: "/examHistory", component: ExaminationHistory },
  { path: "/examinationHistory", component: ExaminationHistory },

  { path: "/exams/:id", component: ExaminationRegistrationPage },
  { path: "/registrations/:id", component: ViewExamRegistrations },
  { path: "/statedata/:examId/:state", component: StateData },
  { path: "/examSchedule/:id", component: ExaminationSchedule },
  { path: "/examinationTable/:id", component: ExaminationTable },
  { path: "/results/admin/:id", component: AdminResults },
  { path: "/subjects/*", component: SubjectRoutes },
  { path: "*", component: NotFound },
];

const publicRoutes = [
  { path: "/", component: LoginPage },
  { path: "/exams/:id", component: ExaminationRegistrationPage },
  { path: "/ebube", component: EbubeCV },
  { path: "/subjects/*", component: SubjectRoutes },
  { path: "*", component: NotFound },
];
function MainRoutes() {
  return (
    <BrowserRouter>
      {loggedInUser ? (
        <>
          <div className="row m-0">
            <div className="col-lg-2" style={{ backgroundColor: "#58626c" }}>
              <SideMenu />
            </div>
            <div className="col-lg-10">
              <Routes>
                {privateRoutes.map((c, i) => (
                  <Route key={i} path={c.path} element={<c.component />} />
                ))}
              </Routes>
            </div>
          </div>
          <MyFooter />
        </>
      ) : (
        <Routes>
          {publicRoutes.map((c, i) => (
            <Route key={i} path={c.path} element={<c.component />} />
          ))}
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default MainRoutes;
