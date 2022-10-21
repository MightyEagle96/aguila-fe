import React from "react";

import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Start,
  Dashboard,
  Download,
  Logout,
  People,
  Upload,
  House,
} from "@mui/icons-material";

import { httpService } from "../httpService";
import Swal from "sweetalert2";
import "./SideMenu.css";

export default function SideMenu() {
  const listItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      redirectTo: "/",
    },
    {
      text: "CBT Centres",
      icon: <House />,
      redirectTo: "/centres",
    },
    {
      text: "Manage active exam",
      icon: <i class="fas fa-wrench    "></i>,
      redirectTo: `/manageActiveExam`,
    },
    {
      text: "Monitor active exam",
      icon: <i class="fas fa-binoculars    "></i>,
      redirectTo: `/subscriberRecords`,
    },
    {
      text: "Download Examinations",
      icon: <Download />,
      redirectTo: `/downloadExam`,
    },
    {
      text: "Download Candidates",
      icon: <People />,
      redirectTo: `/downloadCandidates`,
    },
    {
      text: "Upload Responses",
      icon: <Upload />,
      redirectTo: `/uploadResponses`,
    },
  ];

  const handleLogout = () => {
    Swal.fire({
      icon: "question",
      title: "Logout?",
      text: "You are about to logout as a centre administratior. Please ensure there is no current examination ongoing and then click ok.",
      showCancelButton: true,
    }).then(async (result) => {
      const path = "centreLogout";

      const res = await httpService.get(path);

      if (res) {
        localStorage.removeItem("centre");
        window.location.assign("/");
      }
    });
  };
  return (
    <div className="sideMenu">
      <List>
        {listItems.map((item, index) => (
          <ListItem key={index} sx={{ color: "white" }}>
            <ListItemButton
              onClick={() => window.location.assign(item.redirectTo)}
            >
              <ListItemIcon sx={{ color: "white" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem sx={{ color: "white" }}>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon sx={{ color: "white" }}>{<Logout />}</ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}
