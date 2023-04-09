import MainRoutes from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "./App.css";
import NavigationBar from "./components/NavigationBar";
import ErrorBoundary from "./components/ErrorBoundary";

import "./components/SideMenu.css";

function App() {
  return (
    <>
      <NavigationBar />
      <ErrorBoundary>
        <MainRoutes />
      </ErrorBoundary>
    </>
  );
}

export default App;
