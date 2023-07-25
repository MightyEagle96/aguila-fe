import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import {
  CircularProgress,
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
  Search,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loggedInUser, httpService } from "../httpService";

export default function SideMenu() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
      text: "Active Exam Session",
      icon: <FontAwesomeIcon icon={faClock} />,
      redirectTo: "/examination/activesession",
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
      text: "Search Candidates",
      icon: <Search />,
      redirectTo: `/candidates/search`,
    },
    {
      text: "Admin Panel",
      icon: <AdminPanelSettings />,
      redirectTo: `/adminPanel`,
    },
  ];
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
              onClick={() => navigate(item.redirectTo)}
              sx={{ ":hover": { color: "GrayText" } }}
            >
              <ListItemIcon sx={{ color: "#282828" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        {loggedInUser && (
          <ListItem>
            <ListItemButton
              onClick={logout}
              sx={{ ":hover": { color: "GrayText" } }}
            >
              <ListItemIcon sx={{ color: "#282828" }}>
                {loading ? <CircularProgress size={20} /> : <Logout />}
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </div>
  );
}
