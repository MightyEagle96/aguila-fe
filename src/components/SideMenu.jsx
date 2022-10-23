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
  Logout,
  People,
  History,
  House,
  Book,
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
      redirectTo: "/centres",
    },
    {
      text: "Candidates",
      icon: <People />,
      redirectTo: `/candidates`,
    },
    {
      text: "Examination Control",
      icon: <Quiz />,
      redirectTo: `/examination`,
    },
    {
      text: "Examination History",
      icon: <History />,
      redirectTo: `/examination`,
    },
    {
      text: "Subjects Control",
      icon: <Book />,
      redirectTo: `/subjects`,
    },
  ];

  return (
    <div>
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
