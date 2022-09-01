import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import CandidatesHandler from "../pages/CandidatesHandler";
import CentresHandler from "../pages/CentresHandler";
import Dashboard from "../pages/Dashboard";
import HomePage from "../pages/HomePage";
import ViewCentre from "../pages/ViewCentre";

function MainRoutes() {
  const routes = [
    { path: "/", component: HomePage },
    { path: "/dashboard", component: Dashboard },
    { path: "/candidates", component: CandidatesHandler },
    { path: "/centres", component: CentresHandler },
    { path: "/centres/:id", component: ViewCentre },
  ];
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((c, i) => (
          <Route key={i} path={c.path} element={<c.component />} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default MainRoutes;
