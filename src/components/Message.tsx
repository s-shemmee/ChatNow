import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import ShortcutRoundedIcon from '@mui/icons-material/ShortcutRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { IconButton, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Timestamp } from "firebase/firestore";

interface MessageData {
  id: string;
  senderId: string | undefined;
  senderName: string | null | undefined;
  senderAvatar: string | undefined;
  date: Timestamp;
  text?: string; 
  img?: string;
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

  const formattedTime = message.date.toDate().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser?.uid ? "Sender" : "Receiver"}`}>
      {message.senderId === currentUser?.uid ? (
        <div className="SenderInfo">
          <Tooltip title="You">
            <img className="SenderImg" src={message.senderAvatar} alt={message.senderId} />
          </Tooltip>
          <span className="timestamp">{formattedTime}</span>
        </div>
      ) : (
        <div className="ReceiverInfo">
          <Tooltip title= {message.senderName ?? `User #${message.senderId}`}>
            <img className="ReceiverImg" src={message.senderAvatar} alt={message.senderId} />
          </Tooltip>
          <span className="timestamp">{formattedTime}</span>
        </div>
      )}
      <div className="messageContent">
        {message.text && <p className="messageText">{message.text}</p>}
        {message.img && <img className="messageImg" src={message.img} alt="message" />}
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
