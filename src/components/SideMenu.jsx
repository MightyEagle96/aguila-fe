import React from "react";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Quiz,
  Dashboard,
  House,
  Book,
  AdminPanelSettings,
  Chat,
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
      </List>
    </div>
  );
}
