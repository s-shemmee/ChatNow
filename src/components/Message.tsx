import React, { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import ShortcutRoundedIcon from '@mui/icons-material/ShortcutRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { IconButton, ListItemIcon, ListItemText, Tooltip, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Timestamp } from "firebase/firestore";

interface MessageData {
  id: string;
  senderId: string | undefined;
  senderName: string | null | undefined;
  senderAvatar: string | undefined;
  date: Timestamp;
  message?: {
    text?: string;
    img?: string;
  };
}

const Message: React.FC<{ message: MessageData }> = ({ message }) => {
  const currentUser = useContext(AuthContext);
  const ref = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
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
        {message.message?.text && <p className="messageText">{message.message?.text}</p>}
        {message.message?.img && <img className="messageImg" src={message.message?.img} alt="message" />}
      </div>
      {message.senderId === currentUser?.uid && (
        <div className="messageActions">
          <IconButton onClick={handleClick}>
            <Tooltip title="More options">
              <MoreHorizRoundedIcon />
            </Tooltip>
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem>
              <ListItemIcon>
                <ReplyRoundedIcon sx={{ color: "#9474f4", fontSize:"20px" }}/>
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" sx={{ color: "#5e5e5e", fontSize: '14px'}}>
                  Reply
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ContentCopyRoundedIcon sx={{ color: "#9474f4", fontSize:"20px" }}/>
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" sx={{ color: "#5e5e5e", fontSize: '14px'}}>
                  Copy
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ShortcutRoundedIcon sx={{ color: "#9474f4", fontSize:"20px" }}/>
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" sx={{ color: "#5e5e5e", fontSize: '14px'}}>
                  Forward
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <DeleteRoundedIcon sx={{ color: "#9474f4", fontSize:"20px" }}/>
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" sx={{ color: "#5e5e5e", fontSize: '14px'}}>
                  Delete
                </Typography>
              </ListItemText>
            </MenuItem>
          </Menu>
        </div>
      )}
    </div>
  );
};

export default Message;
