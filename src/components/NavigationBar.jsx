import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { loggedInUser } from "../httpService";
import { Button, Typography, Avatar } from "@mui/material";
import { logout } from "../httpService";
import logo from "../images/logo-2.png";
import { Logout } from "@mui/icons-material";

export default function NavigationBar() {
  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <Avatar
            src={logo}
            className="d-inline-block align-top me-2"
            sx={{ height: 30, width: 30 }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {loggedInUser ? (
              <>
                <div className="d-flex align-items-center">
                  <Typography color="GrayText" className="me-2">
                    {loggedInUser.lastName}
                  </Typography>
                </div>
                <Button
                  variant="outlined"
                  color="error"
                  endIcon={<Logout />}
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : null}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
