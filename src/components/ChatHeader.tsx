import React, { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { IconButton } from "@mui/material";

const ChatHeader: React.FC = () => {
  const { state } = useContext(ChatContext);
  const [isFlagFilled, setIsFlagFilled] = useState(false);
  const [isInfoFilled, setIsInfoFilled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFlagClick = () => {
    setIsFlagFilled(!isFlagFilled);
  };

  const handleInfoClick = () => {
    setIsInfoFilled(!isInfoFilled);
  };

  const handleMoreVertClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Use the timestamp from userChats for last seen time
  const formattedTime = state.user.date
    ? state.user.date.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : '';

  return (
    <div className="chatHeader">
      <div className="chatUser">
        <img src={state.user.photoURL} alt={state.user.photoURL} className="chatImg" />
        <div className="chatInfo">
          <h4 className="chatName">{state.user.displayName}</h4>
          <p className="chatStatus">Last seen at {formattedTime}</p>
        </div>
      </div>
        <div className="chatActions">
          <div
            className="chatAction"
            onMouseEnter={() => setIsFlagFilled(true)}
            onMouseLeave={() => setIsFlagFilled(false)}
            onClick={handleFlagClick}
          >
            {isFlagFilled ? <IconButton><FlagIcon /></IconButton> : <IconButton><FlagOutlinedIcon /></IconButton>}
          </div>
          <div
            className="chatAction"
            onMouseEnter={() => setIsInfoFilled(true)}
            onMouseLeave={() => setIsInfoFilled(false)}
            onClick={handleInfoClick}
          >
            {isInfoFilled ? <IconButton><InfoIcon /></IconButton> : <IconButton><InfoOutlinedIcon /></IconButton>}
          </div>
          <div
            className="chatAction"
            onClick={handleMoreVertClick}
          >
            <IconButton>
              <MoreVertOutlinedIcon />
            </IconButton>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className="Menu"
          >
            <MenuItem onClick={handleMenuClose}>
              <IconButton>
                <NotificationsOffRoundedIcon className="chatAction" />
              </IconButton>
              Mute Chat
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <IconButton>
                <ArchiveRoundedIcon className="chatAction" />
              </IconButton>
              Archive Chat
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <IconButton>
                <DeleteRoundedIcon className="chatAction" />
              </IconButton>
              Delete Chat
            </MenuItem>
          </Menu>
        </div>
      </div>
  );
};

export default ChatHeader;
