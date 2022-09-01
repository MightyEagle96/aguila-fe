import React, { useState } from "react";
import { Container, Spinner } from "react-bootstrap";
import { Button, TextField, Typography } from "@mui/material";
import { Login } from "@mui/icons-material";
import { httpService } from "../httpService";
import { SuccessAlert, ErrorAlert } from "../components/MyAlerts";
import "./HomePage.css";

export default function HomePage() {
  const [loginData, setLoginData] = useState({});
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setLoginData({ ...loginData, [e.target.name]: e.target.value });

  const centreLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const path = "login";
      const res = await httpService.post(path, loginData);
      if (res) {
        if (res.type) {
          setInfo({ type: res.type, message: res.message });
          setLoading(false);
        }
        if (res.data) {
          //setInfo({ type: "success", message: res.data });
          setTimeout(() => {
            window.location.assign("/dashboard");
          }, 500);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <div className="d-flex align-items-center homePage">
      <div className="col-12">
        <Container>
          <div className="border  rounded shadow ">
            <div className="row p-0">
              <div className="col-md-8 d-flex align-items-center m-0 banner text-white p-5">
                <div>
                  <Typography variant="h3" fontWeight={600} gutterBottom>
                    Central Server Monitor <i class="fas fa-server    "></i>
                  </Typography>
                  <hr />
                  <Typography variant="h6" fontWeight={300}>
                    Administrative control centre
                  </Typography>
                </div>
              </div>
              <div className="col-md-4 border-start p-5">
                <form onSubmit={centreLogin}>
                  <div className="mb-4 mt-4">
                    <TextField
                      label="Username"
                      helperText="Your username"
                      name="username"
                      fullWidth
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-2">
                    <TextField
                      label="PASSWORD"
                      type="password"
                      name="password"
                      helperText="Your password"
                      onChange={handleChange}
                      fullWidth
                    />
                  </div>
                  <div>
                    <Button
                      endIcon={<Login />}
                      variant="contained"
                      type="submit"
                      fullWidth
                    >
                      {loading ? <Spinner animation="border" /> : "login"}
                    </Button>
                  </div>
                  <div className="mt-2">
                    {info ? (
                      info.type === "success" ? (
                        <SuccessAlert message={info.message} />
                      ) : (
                        <ErrorAlert message={info.message} />
                      )
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
