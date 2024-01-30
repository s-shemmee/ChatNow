import React from "react";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import SmsRoundedIcon from "@mui/icons-material/SmsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { IconButton, Tooltip } from "@mui/material";

const Sidebar: React.FC = () => {
  const currentUser = React.useContext(AuthContext);

  const navigate = useNavigate();

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
        <img src={logo} alt="chatNow Logo" />
      </div>
      <div className="sidebarMenu">
        <IconButton>
          <Tooltip title="Home">
            <HomeRoundedIcon className="sidebarIcon" />
          </Tooltip>
        </IconButton>

        <IconButton>
          <Tooltip title="Messages">
            <SmsRoundedIcon className="sidebarIcon" />
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
