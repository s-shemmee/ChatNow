import React, { useState } from "react";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { IconButton, Tooltip } from "@mui/material";
import LoadingScreen from "./LoadingScreen";

const Sidebar: React.FC = () => {
  const currentUser = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setLoggingOut(true); // Show loading screen during logout
      await signOut(auth);
      // Redirect to the login page after successful logout
      navigate("/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        (error as Error).message || "An error occurred"
      );
    } finally {
      setLoggingOut(false); 
    }
  };

  if (loggingOut) {
    return <LoadingScreen />;
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="chatNow Logo" />
      </div>
      <div className="sidebarMenu">
        <IconButton>
          <Tooltip title="Home">
            <HomeRoundedIcon className="sidebarIcon" />
          </Tooltip>
        </IconButton>

        <IconButton>
          <Tooltip title="Archive">
            <ArchiveRoundedIcon className="sidebarIcon" />
          </Tooltip>
        </IconButton>

        <IconButton>
          <Tooltip title="Settings">
            <SettingsRoundedIcon className="sidebarIcon" />
          </Tooltip>
        </IconButton>
      </div>

      <div className="sidebarUser">
        {currentUser && currentUser.photoURL && (
          <Tooltip title={currentUser.displayName}>
            <img
              src={currentUser.photoURL}
              alt="avatarURL"
              className="userImg"
            />
          </Tooltip>
        )}

        <IconButton onClick={handleLogout}>
          <Tooltip title="Logout">
            <LogoutRoundedIcon className="userSignOut" />
          </Tooltip>
        </IconButton>
      </div>
    </div>
  );
};

export default Sidebar;
