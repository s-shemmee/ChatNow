import React, { useContext, useState } from "react";
import logo from "../assets/logo.png";
import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { IconButton, Tooltip } from "@mui/material";
import LoadingScreen from "./LoadingScreen";

interface SidebarProps {
  onHomeClick: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onHomeClick }) => {
  const currentUser = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      // Set loading to true before the asynchronous operations
      // This will trigger the loading screen
      setLoading(true);

      // Set the online status to false in Firestore
      const usersCollectionRef = doc(db, "users", currentUser?.uid || "");
      await updateDoc(usersCollectionRef, {
        online: false,
      });

      // Sign out the user
      await signOut(auth);

      // Redirect to the login page after successful logout
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", (error as Error).message || "An error occurred");
    } finally {
      // Set loading back to false after the asynchronous operations
      // This will hide the loading screen
      setLoading(false);
    }
  };

  const handleClickHome = () => {
    onHomeClick(); // Call the onHomeClick callback to clear the selected chat
  };

  if (loading) {
    // Render the LoadingScreen component if loading is true
    return <LoadingScreen />;
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <img src={logo} alt="chatNow Logo" />
      </div>
      <div className="sidebarMenu">
        <IconButton onClick={handleClickHome}>
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
          <Tooltip title={currentUser.displayName || "User"}>
            <img src={currentUser.photoURL} alt="avatarURL" className="userImg" />
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
