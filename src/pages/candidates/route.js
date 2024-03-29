import React from "react";
import { Route, Routes } from "react-router-dom";

import NotFound from "../NotFound";
import { loggedInUser } from "../../httpService";
import CandidatesList from "./CandidatesList";
import PerformSyncOperations from "./PerformSyncOperations";
import SearchCandidate from "./SearchCandidate";

const privateRoutes = [
  { path: "/:id/list", component: CandidatesList },
  { path: "/sync", component: PerformSyncOperations },
  { path: "/search", component: SearchCandidate },
  { path: "*", component: NotFound },
];

const publicRoutes = [{ path: "*", component: NotFound }];

export default function CandidatesRoutes() {
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
