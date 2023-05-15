import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { loggedInUser } from "../httpService";
import { Typography, Avatar, Stack } from "@mui/material";
import { httpService } from "../httpService";
import aguila from "../images/aguila.png";
import { Logout } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export default function NavigationBar() {
  const [loading, setLoading] = useState(false);
  const logout = async () => {
    setLoading(true);
    const { data } = await httpService.get("auth/v1/logout");

    if (data) {
      localStorage.removeItem(process.env.REACT_APP_PROJECT_USER);
      window.location.assign("/");
    }
    setLoading(false);
  };
  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <Stack direction="row">
            {" "}
            <Avatar
              src={aguila}
              className="d-inline-block align-top me-2"
              sx={{ height: 30, width: 30 }}
            />
            <div className="d-flex align-items-center">
              <Typography color="Gray" variant="overline">
                AGUILA
              </Typography>
            </div>
          </Stack>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {loggedInUser ? (
              <>
                <div className="d-flex align-items-center">
                  <Typography className="me-2">
                    {loggedInUser.lastName}
                  </Typography>
                </div>
                <LoadingButton
                  color="error"
                  endIcon={<Logout />}
                  onClick={logout}
                  loadingPosition="end"
                  loading={loading}
                >
                  Logout
                </LoadingButton>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
