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
import { IconButton, Tooltip } from "@mui/material";

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

  // the full date of chat creation between two users from userChats
  const chatCreationTime = state.user.date?.toDate().toLocaleString();

  // the last seen time of the user who is currently chatting with you
  const lastSeenTime = state.user.userMetadata.lastSignInTime
    ? new Date(state.user.userMetadata.lastSignInTime).toLocaleString([], {hour: '2-digit', minute:'2-digit'} )
    : "Unavailable";

  return (
    <div className="chatHeader">
      <div className="chatUser">
        <img src={state.user.photoURL} alt={state.user.photoURL} className="chatImg" />
        <div className="chatInfo">
          <h4 className="chatName">{state.user.displayName}</h4>
          <p className="chatStatus">Last seen at {lastSeenTime}</p>
        </div>
      </div>
        <div className="chatActions">
          <div
            className="chatAction"
            onMouseEnter={() => setIsFlagFilled(true)}
            onMouseLeave={() => setIsFlagFilled(false)}
            onClick={handleFlagClick}
          >
            {isFlagFilled ? <IconButton><Tooltip title="Report"><FlagIcon /></Tooltip></IconButton> : <IconButton><FlagOutlinedIcon /></IconButton>}
          </div>
          <div
            className="chatAction"
            onMouseEnter={() => setIsInfoFilled(true)}
            onMouseLeave={() => setIsInfoFilled(false)}
            onClick={handleInfoClick}
          >
            {isInfoFilled ? <IconButton><Tooltip title={`Chat Created at ${chatCreationTime}`} arrow><InfoIcon /></Tooltip></IconButton> : <IconButton><InfoOutlinedIcon /></IconButton>}
          </div>
          <div
            className="chatAction"
            onClick={handleMoreVertClick}
          >
            <IconButton>
              <Tooltip title="More" arrow>
                <MoreVertOutlinedIcon />
              </Tooltip>
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
                <NotificationsOffRoundedIcon />
              </IconButton>
              <span>Notifications</span>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <IconButton>
                <ArchiveRoundedIcon />
              </IconButton>
              <span>Archive</span>
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <IconButton>
                <DeleteRoundedIcon />
              </IconButton>
              <span>Delete</span>
            </MenuItem>
          </Menu>
        </div>
      </div>
  );
};

export default ChatHeader;