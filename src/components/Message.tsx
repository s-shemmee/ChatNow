import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import ShortcutRoundedIcon from '@mui/icons-material/ShortcutRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface MessageData {
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp?: Date;
}

const Message: React.FC<{ message: MessageData }> = ({ message }) => {
  const currentUser = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleMoreHorizClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser?.uid ? "Sender" : ""}`}>
      <div className="messageInfo">
        <img src={message.senderAvatar} alt={message.senderId} />
        <p>{message.senderName}</p>
        <span>{message.timestamp?.getDate()}</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        <span>{message.senderId}</span>
      </div>
      {message.senderId === currentUser?.uid && (
        <div className="messageActions">
          <IconButton onClick={handleMoreHorizClick}>
            <MoreHorizRoundedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>
              <ReplyRoundedIcon />
              Reply
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ShortcutRoundedIcon />
              Forward
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <DeleteRoundedIcon />
              Delete
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <ContentCopyRoundedIcon />
              Copy
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default Message;
