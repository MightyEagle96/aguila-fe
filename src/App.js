import MainRoutes from "./routes";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import MyFooter from "./components/MyFooter";
import NavigationBar from "./components/NavigationBar";
import SideMenu from "./components/SideMenu";
import { loggedInUser } from "./httpService";

function App() {
  return (
    <>
      <NavigationBar />
      {loggedInUser ? (
        <div>
          <div class="row m-0">
            <div className="col-md-3 sideMenu">
              <SideMenu />
            </div>
            <div className="col-md-9">
              <MainRoutes />
            </div>
          </div>
        </div>
      ) : (
        <MainRoutes />
      )}
      <MyFooter />
    </>
  );
}

export default App;
