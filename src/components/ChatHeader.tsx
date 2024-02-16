import React, { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import {
  FlagOutlined as FlagOutlinedIcon,
  Flag as FlagIcon,
  InfoOutlined as InfoOutlinedIcon,
  Info as InfoIcon,
  MoreVertOutlined as MoreVertOutlinedIcon,
  NotificationsOffRounded as NotificationsOffRoundedIcon,
  ArchiveRounded as ArchiveRoundedIcon,
  DeleteRounded as DeleteRoundedIcon,
} from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const ChatHeader: React.FC = () => {
  const { state } = useContext(ChatContext);
  const { user } = state;
  const [isFlagFilled, setIsFlagFilled] = useState(false);
  const [isInfoFilled, setIsInfoFilled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleFlagClick = () => setIsFlagFilled((prev) => !prev);
  const handleInfoClick = () => setIsInfoFilled((prev) => !prev);
  const handleMoreVertClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const chatCreationTime = user.date?.toDate().toLocaleString();
  const lastSeenTime = user.date?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const renderFlagIcon = () => (isFlagFilled ? <FlagIcon /> : <FlagOutlinedIcon />);
  const renderInfoIcon = () => (isInfoFilled ? <InfoIcon /> : <InfoOutlinedIcon />);

  return (
    <div className="chatHeader">
      <div className="chatUser">
        <img src={user.photoURL} alt={user.photoURL} className="chatImg" />
        <div className="chatInfo">
          <h4 className="chatName">{user.displayName}</h4>
          <p className="chatStatus">Last seen at {lastSeenTime}</p>
        </div>
      </div>
      <div className="chatActions">
        <div className="chatAction" onMouseEnter={() => setIsFlagFilled(true)} onMouseLeave={() => setIsFlagFilled(false)} onClick={handleFlagClick}>
          <IconButton>
            <Tooltip title="Report">{renderFlagIcon()}</Tooltip>
          </IconButton>
        </div>
        <div className="chatAction" onMouseEnter={() => setIsInfoFilled(true)} onMouseLeave={() => setIsInfoFilled(false)} onClick={handleInfoClick}>
          <IconButton>
            <Tooltip title={`Chat Created at ${chatCreationTime}`} arrow>{renderInfoIcon()}</Tooltip>
          </IconButton>
        </div>
        <div className="chatAction" onClick={handleMoreVertClick}>
          <IconButton>
            <Tooltip title="More">
              <MoreVertOutlinedIcon />
            </Tooltip>
          </IconButton>
        </div>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} className="Menu">
          <MenuItem>
            <NotificationsOffRoundedIcon className="chatAction"/>
            <span>Notifications</span>
          </MenuItem>
          <MenuItem>
            <ArchiveRoundedIcon className="chatAction"/>
            <span>Archive</span>
          </MenuItem>
          <MenuItem>
            <DeleteRoundedIcon className="chatAction"/>
            <span>Delete</span>
           </MenuItem>
        </Menu>
        </div>
      </div>
  );
};

export default ChatHeader;