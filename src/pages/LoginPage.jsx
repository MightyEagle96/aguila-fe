import {
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import React, { useState } from "react";
import { httpService } from "../httpService.js";

import "./HomePage.css";
import { LoadingButton } from "@mui/lab";

import MySnackBar from "../components/MySnackBar.jsx";
import { Login } from "@mui/icons-material";
import logo from "./logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloud } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [type, setType] = useState("password");

  const [loginCredentials, setLoginCredentials] = useState({});

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      setType("text");
    } else {
      setType("password");
    }
  };

  const handleChange = (e) => {
    setLoginCredentials({
      ...loginCredentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    setLoading(true);

    const { data, error } = await httpService.post(
      "auth/v1/login",
      loginCredentials
    );

    if (data) {
      localStorage.setItem(
        process.env.REACT_APP_PROJECT_USER,
        JSON.stringify(data)
      );
      window.location.assign("/");
    }
    if (error) {
      setMessage(error);
      setOpen(true);
      setSeverity("error");
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="row m-0">
        <div className="col-lg-6 homeBanner d-flex justify-content-center align-items-center text-white text-center">
          <div>
            <div className="mb-2">
              <img src={logo} height={100} width={170} alt="logo" />
            </div>
            <Typography
              variant="h2"
              textTransform={"capitalize"}
              fontWeight={700}
              gutterBottom
            >
              Central Server <FontAwesomeIcon icon={faCloud} />
            </Typography>
            <hr />
            <div className="mt-2">
              <Typography fontWeight={300}>AGUILA</Typography>
            </div>
          </div>
        </div>
        <div className="col-lg-6 d-flex align-items-center justify-content-center">
          <div className="col-lg-6">
            <div className="d-none d-lg-block">
              <div className="">
                <form onSubmit={handleSubmit}>
                  <div className="mt-3">
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      name="emailAddress"
                      onChange={handleChange}
                      value={loginCredentials.emailAddress}
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <TextField
                      fullWidth
                      required
                      label="Password"
                      type={type}
                      name="password"
                      onChange={handleChange}
                      value={loginCredentials.password}
                    />
                  </div>
                  <div className="mt-1">
                    <FormGroup>
                      <FormControlLabel
                        onChange={handleCheckbox}
                        control={<Checkbox />}
                        label="Show Password"
                      />
                    </FormGroup>
                  </div>
                  <div className="mt-4">
                    <LoadingButton
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="success"
                      loadingPosition="end"
                      endIcon={<Login />}
                      loading={loading}
                    >
                      login
                    </LoadingButton>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MySnackBar
        open={open}
        setOpen={setOpen}
        message={message}
        severity={severity}
      />
    </div>
  );
}
