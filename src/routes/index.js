import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "../pages/Dashboard";

import { loggedInUser } from "../httpService";
import NotFound from "../pages/NotFound";
import LoginPage from "../pages/LoginPage";

import ExaminationRegistrationPage from "../pages/registrations/ExaminationRegistrationPage";

import SideMenu from "../components/SideMenu";
import EbubeCV from "../pages/EbubeCV";
import MyFooter from "../components/MyFooter";
import SubjectRoutes from "../pages/subjects/route";
import ExaminationRoutes from "../pages/examinations/route";
import CandidatesRoutes from "../pages/candidates/route";
import CentresRoutes from "../pages/centres/route";
import CandidateResult from "../pages/CandidateResult";
import VincentWork from "../pages/Vincent";

const privateRoutes = [
  { path: "/", component: Dashboard },
  { path: "/candidates/*", component: CandidatesRoutes },
  { path: "/centres/*", component: CentresRoutes },
  { path: "/examination/*", component: ExaminationRoutes },
  { path: "/subjects/*", component: SubjectRoutes },
  { path: "*", component: NotFound },
];

const publicRoutes = [
  { path: "/", component: LoginPage },
  { path: "/exams/:id", component: ExaminationRegistrationPage },
  { path: "/ebube", component: EbubeCV },
  { path: "/subjects/*", component: SubjectRoutes },
  { path: "/result", component: CandidateResult },
  { path: "/vincent", component: VincentWork },
  { path: "*", component: NotFound },
];
function MainRoutes() {
  return (
    <BrowserRouter>
      {loggedInUser ? (
        <>
          <div className="row m-0">
            <div className="col-lg-2" style={{ backgroundColor: "#FAFAFA" }}>
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
