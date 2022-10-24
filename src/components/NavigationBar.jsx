import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { loggedInUser } from "../httpService";
import { Button, Typography, Avatar } from "@mui/material";
import { logout } from "../httpService";
import aguila from "../images/aguila.png";
import { Logout } from "@mui/icons-material";

export default function NavigationBar() {
  return (
    <Navbar bg="light" variant="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">
          <Avatar
            src={aguila}
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
                  <Typography className="me-2">
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
