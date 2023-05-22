import axios from "axios";

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

export const backendURL = process.env.REACT_APP_BACKEND_URL;

// httpService.interceptors.request.use(
//   function (config) {
//     console.log(loggedInUser);
//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      await httpService.post("auth/v1/refreshtoken", {
        id: loggedInUser.user._id,
      });
      return httpService(error.config);
    }
    // } else if (error.response)
    //   return { error: error.response.data, status: error.response.status };
    if (error.response)
      return { error: error.response.data, status: error.response.status };
    return { error: "Lost connection to the server" };
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
