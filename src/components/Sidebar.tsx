import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SmsRoundedIcon from "@mui/icons-material/SmsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { IconButton, Tooltip } from "@mui/material";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  // Get current user data when component mounts
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to the login page after successful logout
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        (error as Error).message || "An error occurred"
      );
    }
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="sidebarMenu">
        <Tooltip title="Home">
          <IconButton>
            <HomeRoundedIcon className="sidebarIcon" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Messages">
          <IconButton>
            <SmsRoundedIcon className="sidebarIcon" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Settings">
          <IconButton>
            <SettingsRoundedIcon className="sidebarIcon" />
          </IconButton>
        </Tooltip>
      </div>

      <div className="sidebarUser">
        {user && user.photoURL && (
          <Tooltip title={user.displayName}>
            <img src={user.photoURL} alt="avatarURL" className="userImg" />
          </Tooltip>
        )}
        <Tooltip title="Logout">
          <IconButton onClick={handleLogout}>
            <LogoutRoundedIcon className="userSignOut" />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar;
