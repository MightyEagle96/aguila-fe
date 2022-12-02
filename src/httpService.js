import axios from "axios";
import Swal from "sweetalert2";

export const loggedInUser =
  JSON.parse(localStorage.getItem(process.env.REACT_APP_PROJECT_USER)) || null;

const httpService = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 20000,
  withCredentials: "include",
  headers: {
    "Content-Type": "application/json",
  },
});

httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error && error.response.data) {
      if (error.response.status === 401) {
        const path = "refreshToken";
        await httpService.post(path, { id: loggedInUser._id });

        return httpService(error.config);
      } else if (error.response.status === 500) {
        return Swal.fire({
          icon: "error",
          title: "Server Error",
          text: error.response.data,
        });
      }
      return { type: "error", message: error.response.data };
    } else {
      return Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Cannot get data from the server at this time",
      });
    }
  }
);

const logout = async () => {
  const res = await httpService.get("logout");
  if (res) {
    localStorage.removeItem(process.env.REACT_APP_PROJECT_USER);
    window.location.assign("/");
  }
};
export { httpService, logout };
