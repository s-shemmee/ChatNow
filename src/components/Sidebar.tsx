import React from "react";
import logo from "../assets/logo.png";
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import SmsRoundedIcon from '@mui/icons-material/SmsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';

const Sidebar:React.FC = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="" />
      </div>
      <div className="sidebarMenu">
        <HomeRoundedIcon className="menuIcon"/>
        <SmsRoundedIcon className="menuIcon"/>
        <SettingsRoundedIcon className="menuIcon"/>
      </div>

      <div className="user">
        <img src="https://picsum.photos/200" alt="avatar" className="userImg"/>
        <LogoutRoundedIcon className="userIcon"/>
      </div>

    </div>
  );
};

export default Sidebar;