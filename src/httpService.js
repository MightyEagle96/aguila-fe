import axios from "axios";
import Swal from "sweetalert2";

const httpService = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
httpService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const failed = { error };

    if (failed.error) {
      return Swal.fire({ icon: "error", text: failed.error.response.data });
    }
  }
);

export { httpService };
