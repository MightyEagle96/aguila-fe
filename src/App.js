import MainRoutes from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import MyFooter from "./components/MyFooter";
import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <>
      <NavigationBar />
      <MainRoutes />
      <MyFooter />
    </>
  );
}

export default App;
