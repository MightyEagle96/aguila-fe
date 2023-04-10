import MainRoutes from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import ErrorBoundary from "./components/ErrorBoundary";

import { AlertContext } from "./contexts/AlertContext";

import "./components/SideMenu.css";
import { MySnackBarContext } from "./components/MySnackBar";
import React, { useState } from "react";

function App() {
  const [alertData, setAlertData] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <>
      <AlertContext.Provider value={{ alertData, setAlertData }}>
        <NavigationBar />
        <ErrorBoundary>
          <MainRoutes />
        </ErrorBoundary>
        <MySnackBarContext alertData={alertData} setAlertData={setAlertData} />
      </AlertContext.Provider>
    </>
  );
}

export default App;
