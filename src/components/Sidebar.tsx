import React from "react";
import logo from "../assets/logo.png";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { IconButton } from "@mui/material";

const Sidebar:React.FC = () => {

  const navigate = useNavigate();
  function handleSignOut() {
    signOut(auth).then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/login");
    }).catch((error) => {
      console.error('Error:', error);
    });
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="sidebarMenu">
        <IconButton>
          <HomeRoundedIcon className="sidebarIcon"/>
        </IconButton>
        <IconButton>
          <SmsRoundedIcon className="sidebarIcon"/>
        </IconButton>
        <IconButton>
          <SettingsRoundedIcon className="sidebarIcon"/>
        </IconButton>
      </div>

      <div className="sidebarUser">
        <img src="https://picsum.photos/200" alt="avatar" className="userImg"/>
        <IconButton onClick={handleSignOut}>
          <LogoutRoundedIcon className="userSignOut"/>
        </IconButton>
      </div>

    </div>
  );
};

export default Sidebar;