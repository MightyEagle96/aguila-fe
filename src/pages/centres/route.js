import React from "react";
import { Route, Routes } from "react-router-dom";

import NotFound from "../NotFound";
import { loggedInUser } from "../../httpService";
import AllCentres from "./AllCentres";

const privateRoutes = [
  { path: "/all", component: AllCentres },

  { path: "*", component: NotFound },
];

const publicRoutes = [{ path: "*", component: NotFound }];

export default function CentresRoutes() {
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
