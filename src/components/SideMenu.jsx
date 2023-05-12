import React from "react";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import {
  Quiz,
  Dashboard,
  House,
  Book,
  AdminPanelSettings,
  Chat,
  Sync,
} from "@mui/icons-material";

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
      redirectTo: "/centres/centresmanager",
    },

    {
      text: "Examination Control",
      icon: <Quiz />,
      redirectTo: `/examination`,
    },
    {
      text: "Sync Operation",
      icon: <Sync />,
      redirectTo: `/candidates/sync`,
    },
    {
      text: "Session Report",
      icon: <Chat />,
      redirectTo: `/examination/sessionreport`,
    },
    {
      text: "Subjects Control",
      icon: <Book />,
      redirectTo: `/subjects`,
    },
    {
      text: "Admin Panel",
      icon: <AdminPanelSettings />,
      redirectTo: `/adminPanel`,
    },
  ];

  return (
    <div className="mt-5 mb-5">
      <div
        className="mt-5 mb-5 text-center p-3"
        style={{ backgroundColor: "#7da38c", color: "#fff" }}
      >
        <Typography letterSpacing={2} variant="h4" fontWeight={700}>
          AGUILA CENTRAL
        </Typography>
      </div>
      <List>
        {listItems.map((item, index) => (
          <ListItem key={index} sx={{ color: "#282828" }}>
            <ListItemButton
              href={item.redirectTo}
              sx={{ ":hover": { color: "GrayText" } }}
            >
              <ListItemIcon sx={{ color: "#282828" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
