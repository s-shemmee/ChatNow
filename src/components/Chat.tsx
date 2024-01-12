import React, { useState } from "react";
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

const Chat: React.FC = () => {
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

  return (
    <div className="chatMain">
      <div className="chatHeader">
        <div className="chatUser">
          <img src="https://picsum.photos/200" alt="" className="chatImg" />
          <div className="chatInfo">
            <h4 className="chatName">Room Name</h4>
            <span className="chatStatus">
              <p>Last seen at...</p>
            </span>
          </div>
        </div>
        <div className="chatActions">
          <div
            className="chatAction"
            onMouseEnter={() => setIsFlagFilled(true)}
            onMouseLeave={() => setIsFlagFilled(false)}
            onClick={handleFlagClick}
          >
            {isFlagFilled ? <FlagIcon /> : <FlagOutlinedIcon />}
          </div>
          <div
            className="chatAction"
            onMouseEnter={() => setIsInfoFilled(true)}
            onMouseLeave={() => setIsInfoFilled(false)}
            onClick={handleInfoClick}
          >
            {isInfoFilled ? <InfoIcon /> : <InfoOutlinedIcon />}
          </div>
          <div
            className="chatAction"
            onClick={handleMoreVertClick}
          >
            <MoreVertOutlinedIcon />
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <NotificationsOffRoundedIcon />
              Mute Chat
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ArchiveRoundedIcon />
              Archive Chat
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <DeleteRoundedIcon />
              Delete Chat
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default Chat;
