import {
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";
import React, { useState } from "react";
import { httpService } from "../httpService.js";
import { Spinner } from "react-bootstrap";

export default function LoginPage() {
  const [type, setType] = useState("password");
  const defaultData = { emailAddress: "", password: "" };
  const [data, setData] = useState(defaultData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      setType("text");
    } else {
      setType("password");
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const path = "login";
    const res = await httpService.post(path, data);

    if (res.type) {
      setLoading(false);
      setError(res);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }

    if (res.data) {
      localStorage.setItem(
        process.env.REACT_APP_PROJECT_USER,
        JSON.stringify(res.data.user)
      );

      //window.location.assign("/");
    }
    setLoading(false);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <div className="container">
          {/* desktop */}
          <div className="d-none d-lg-block">
            <div className="d-flex justify-content-center">
              <div className="col-md-5 ">
                <Typography textAlign={"center"} variant="h4" fontWeight={600}>
                  Login Here
                </Typography>
                <form onSubmit={handleSubmit}>
                  <div className="mt-3">
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      name="emailAddress"
                      onChange={handleChange}
                      value={data.emailAddress}
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
                      value={data.password}
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
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="success"
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" /> : "Login"}
                    </Button>
                  </div>
                </form>
                {error ? (
                  <div className="mt-1">
                    <Alert severity="error">
                      <AlertTitle>Error</AlertTitle>
                      {error.message}
                    </Alert>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          {/* ipad */}
          <div className="d-none d-md-block d-lg-none">
            <div className="d-flex justify-content-center">
              <div className="col-md-6 ">
                <Typography textAlign={"center"} variant="h4" fontWeight={600}>
                  Login Here
                </Typography>
                <form onSubmit={handleSubmit}>
                  <div className="mt-3">
                    <TextField
                      fullWidth
                      label="Email Address"
                      type="email"
                      name="emailAddress"
                      onChange={handleChange}
                      value={data.emailAddress}
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
                      value={data.password}
                    />
                  </div>
                  <div className="mt-2">
                    <FormGroup>
                      <FormControlLabel
                        onChange={handleCheckbox}
                        control={<Checkbox />}
                        label="Show Password"
                      />
                    </FormGroup>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      color="success"
                      disabled={loading}
                    >
                      {loading ? <Spinner animation="border" /> : "Login"}
                    </Button>
                  </div>
                </form>
                <div className="mt-2">
                  {error ? (
                    <div className="mt-1">
                      <Alert severity="error">
                        <AlertTitle>Error</AlertTitle>
                        {error.message}
                      </Alert>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {/* mobile */}
          <div className="d-sm-block d-md-none">
            <Typography textAlign={"center"} variant="h4" fontWeight={600}>
              Login Here
            </Typography>
            <form onSubmit={handleSubmit}>
              <div className="mt-3">
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  name="emailAddress"
                  onChange={handleChange}
                  value={data.emailAddress}
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
                  value={data.password}
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
                <Button
                  variant="contained"
                  type="submit"
                  fullWidth
                  color="success"
                  disabled={loading}
                >
                  {loading ? <Spinner animation="border" /> : "Login"}
                </Button>
              </div>
            </form>
            {error ? (
              <div className="mt-1">
                <Alert severity="error">
                  <AlertTitle>Error</AlertTitle>
                  {error.message}
                </Alert>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
