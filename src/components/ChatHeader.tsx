import React, { useState, useContext, useEffect, useCallback } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { ChatContext } from "../context/ChatContext";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import FlagIcon from "@mui/icons-material/Flag";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InfoIcon from "@mui/icons-material/Info";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import BlockRounded from "@mui/icons-material/BlockRounded";
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { formatDistanceToNow, format } from "date-fns";

const ChatHeader: React.FC = () => {
  const { state } = useContext(ChatContext);
  const [chatCreationTime, setChatCreationTime] = useState<string | null>(null);
  const [isFlagFilled, setIsFlagFilled] = useState(false);
  const [isInfoFilled, setIsInfoFilled] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleFlagClick = () => {
    setIsFlagFilled(!isFlagFilled);
  };

  const handleInfoClick = () => {
    setIsInfoFilled(!isInfoFilled);
  };

  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Fetch the last sign-in time of the user
  const fetchLastSignInTime = useCallback(async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", state.user.uid));
      const lastSignInTime = userDoc.data()?.userMetadata.lastSignInTime;
      const onlineStatus = userDoc.data()?.online ? "Online" : "Offline";

      if (onlineStatus === "Online") {
        return onlineStatus;
      }

      if (lastSignInTime) {
        const distance = formatDistanceToNow(new Date(lastSignInTime), {
          addSuffix: true,
        });
        return `${onlineStatus} - Last seen ${distance}`;
      } else {
        return "Unavailable";
      }
    } catch (error) {
      console.error("Error fetching lastSignInTime:", error);
      return "Unavailable";
    }
  }, [state.user.uid]);

  // Fetch the chat creation time
  const fetchChatCreationTime = useCallback(async () => {
    try {
      const combinedId = state.chatId;
      const chatCreationDoc = await getDoc(doc(db, "userChats", state.user.uid));

      if (chatCreationDoc.exists()) {
        const chatCreationData = chatCreationDoc.data()[combinedId];
        if (chatCreationData && chatCreationData.date) {
          const timestamp = chatCreationData.date;

          // Convert Firestore Timestamp to Date
          const date = timestamp.toDate();

          // Format the date as a string
          const formattedDate = format(date, "MMMM dd, yyyy h:mm a");

          return formattedDate;
        }
      }

      return null;
    } catch (error) {
      console.error("Error fetching chat creation time:", error);
      return null;
    }
  }, [state.chatId, state.user.uid]);

  const [lastSeenTime, setLastSeenTime] = useState("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      const time = await fetchLastSignInTime();
      setLastSeenTime(time);

      const chatCreationTime = await fetchChatCreationTime();
      if (chatCreationTime) {
        setChatCreationTime(chatCreationTime);
      }
    };

    fetchData();
  }, [fetchLastSignInTime, fetchChatCreationTime, state.chatId, state.user.uid]);

  return (
    <div className="chatHeader">
      <div className="chatUser">
        <img
          src={state.user.photoURL}
          alt={`${state.user.displayName}'s profile picture`}
          className="chatImg"
          data-online={lastSeenTime === "Online"}
        />
        <div className="chatInfo">
          <h4 className="chatName">{state.user.displayName}</h4>
          <p className="chatStatus">{lastSeenTime}</p>
        </div>
      </div>
      <div className="chatActions">
        <div
          className="chatAction"
          onMouseEnter={() => setIsFlagFilled(true)}
          onMouseLeave={() => setIsFlagFilled(false)}
          onClick={handleFlagClick}
        >
          {isFlagFilled ? (
            <IconButton>
              <Tooltip title="Report">
                <FlagIcon />
              </Tooltip>
            </IconButton>
          ) : (
            <IconButton>
              <FlagOutlinedIcon />
            </IconButton>
          )}
        </div>
        <div
          className="chatAction"
          onMouseEnter={() => setIsInfoFilled(true)}
          onMouseLeave={() => setIsInfoFilled(false)}
          onClick={handleInfoClick}
        >
          {isInfoFilled ? (
            <IconButton>
              <Tooltip title={`Chat Created at ${chatCreationTime}`} arrow>
                <InfoIcon />
              </Tooltip>
            </IconButton>
          ) : (
            <IconButton>
              <InfoOutlinedIcon />
            </IconButton>
          )}
        </div>
        <div className="chatAction">
          <IconButton onClick={handleClick}>
            <Tooltip title="More">
              <MoreVertOutlinedIcon />
            </Tooltip>
          </IconButton>
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
        >
          <MenuItem>
            <ListItemIcon>
              <NotificationsOffRoundedIcon
                sx={{ color: "#9474f4", fontSize: "20px" }}
              />
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                sx={{ color: "#5e5e5e", fontSize: "14px", fontWeight: "600" }}
              >
                Notifications
              </Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <ArchiveRoundedIcon sx={{ color: "#9474f4", fontSize: "20px" }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                sx={{ color: "#5e5e5e", fontSize: "14px", fontWeight: "600" }}
              >
                Archive
              </Typography>
            </ListItemText>
          </MenuItem>
          <MenuItem>
            <ListItemIcon>
              <BlockRounded sx={{ color: "#9474f4", fontSize: "20px" }} />
            </ListItemIcon>
            <ListItemText>
              <Typography
                variant="body2"
                sx={{ color: "#5e5e5e", fontSize: "14px", fontWeight: "600" }}
              >
                Block
              </Typography>
            </ListItemText>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default ChatHeader;
