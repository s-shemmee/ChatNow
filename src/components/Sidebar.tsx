import React from "react";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { IconButton, Tooltip } from "@mui/material";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Redirect to the login page after successful logout
      navigate('/login');
    } catch (error: Error ) {
      console.error('Logout failed:', error.message || 'An error occurred');
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
        <img src="https://picsum.photos/200" alt="avatar" className="userImg" />
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
