import React, { useContext, useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import { doc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MarkChatUnreadRoundedIcon from "@mui/icons-material/MarkChatUnreadRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import {
  IconButton,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { formatDistanceStrict } from "date-fns";
import { enUS } from "date-fns/locale";

interface ChatData {
  userInfo: {
    uid: string;
    displayName: string;
    photoURL: string;
    profession: string;
  };
  messages: Array<{
    id: string;
    senderId: string;
    date: Timestamp;
    message?: {
      text?: string;
      img?: string;
    };
  }>;
}

interface ChatsProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
}

const Chats: React.FC<ChatsProps> = ({ onSelectChat, selectedChatId }) => {
  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [lastMessages, setLastMessages] = useState<Record<string, { message?: { text?: string; img?: string }; date: string }>>({});
  const [chatData, setChatData] = useState<Record<string, ChatData>>({});
  const [anchorEls, setAnchorEls] = useState<Record<string, HTMLElement | null>>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, chatId: string) => {
    setAnchorEls((prev) => ({
      ...prev,
      [chatId]: event.currentTarget,
    }));
  };
  
  const handleClose = (chatId: string) => {
    setAnchorEls((prev) => ({
      ...prev,
      [chatId]: null,
    }));
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const snapshot = await getDoc(doc(db, "userChats", currentUser.uid));
          const data = snapshot.data();
          setChatData(data || {});

          if (data && data.userInfo) {
            const userDoc = await getDoc(doc(db, "users", data.userInfo.uid));
            const userMetadata = userDoc.data()?.metadata || {};

            dispatch({
              type: "CHANGE_USER",
              payload: {
                ...data.userInfo,
                date: data.date,
                userMetadata: {
                  creationTime: userMetadata.creationTime || null,
                  lastSignInTime: userMetadata.lastSignInTime || null,
                },
              },
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user chats:", error);
      }
    };

    const unsubscribe = currentUser && onSnapshot(doc(db, "userChats", currentUser.uid), fetchData);

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [currentUser, dispatch]);

  useEffect(() => {
    const unsubscribeMessages = Object.keys(chatData).map((chatId) => {
      return onSnapshot(doc(db, "chats", chatId), (snapshot) => {
        const messages = snapshot.data()?.messages || [];
        const lastMessage = messages[messages.length - 1];

        if (lastMessage) {
          const formattedDistance = formatDistanceStrict(
            lastMessage.date.toDate(),
            new Date(),
            { locale: enUS }
          );
          setLastMessages((prev) => ({
            ...prev,
            [chatId]: {
              message: {
                text: lastMessage.message?.text || "",
                img: lastMessage.message?.img || "",
              },
              date: formattedDistance,
            },
          }));
        }
      });
    });

    return () => unsubscribeMessages.forEach((unsubscribe) => unsubscribe());
  }, [chatData]);

  const openChat = (chatId: string) => {
    const chat = chatData[chatId];
    if (chat?.userInfo) {
      onSelectChat(chatId);
      dispatch({ type: "CHANGE_USER", payload: { ...chat.userInfo } });
    }
  };

  const renderChatsList = () => {
    //TODO: sort chats by the last message or create a filter for this feature
    const sortedChats = Object.keys(chatData).sort((a, b) => {
      const dateA = lastMessages[a]?.date || "";
      const dateB = lastMessages[b]?.date || "";
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });

    return sortedChats.map((chatId) => {
      const { userInfo } = chatData[chatId];

      if (!userInfo) {
        return null;
      }

      const lastMessage = lastMessages[chatId];

      // Determine the value of truncatedMessage based on message type
      const truncatedMessage = lastMessage?.message?.text
        ? lastMessage.message.text.length > 20
          ? `${lastMessage.message.text.slice(0, 20)}...`
          : lastMessage.message.text
        : lastMessage?.message?.img
        ? "Attachment"
        : "No messages yet";

        return (
          <div key={chatId} className={`chatCard ${selectedChatId === chatId ? "selected" : ""}`} onClick={() => openChat(chatId)}>
            <div className="chatUserInfo">
              <img
                src={userInfo.photoURL}
                alt={userInfo.displayName}
                className="chatUserImg"
              />
              <div className="chatContent">
                <div className="chatUser">
                  <h4 className="chatUserName">{userInfo.displayName}</h4>
                  <span className="chatUserProfession">
                    {userInfo.profession || "No profession"}
                  </span>
                </div>
                <p className="chatLastMessage">{truncatedMessage}</p>
              </div>
            </div>
            <div className="chatUserDetails">
              <IconButton onClick={(e) => handleClick(e, chatId)}>
                <Tooltip title="More" className="button">
                  <MoreHorizRoundedIcon />
                </Tooltip>
              </IconButton>
              {lastMessage && <p className="timestamp">{lastMessage.date}</p>}
            </div>
            <Menu
              id={`basic-menu-${chatId}`}
              anchorEl={anchorEls[chatId]}
              open={Boolean(anchorEls[chatId])}
              onClose={() => handleClose(chatId)}
            >
              <MenuItem>
                <ListItemIcon>
                  <MarkChatUnreadRoundedIcon
                    sx={{ color: "#9474f4", fontSize: "20px" }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body2"
                    sx={{ color: "#5e5e5e", fontSize: "14px", fontWeight: "600" }}
                  >
                    Mark as unread
                  </Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ArchiveRoundedIcon
                    sx={{ color: "#9474f4", fontSize: "20px" }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body2"
                    sx={{ color: "#5e5e5e", fontSize: "14px", fontWeight: "600" }}
                  >
                    Archive Chat
                  </Typography>
                </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <DeleteRoundedIcon
                    sx={{ color: "#9474f4", fontSize: "20px" }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography
                    variant="body2"
                    sx={{ color: "#5e5e5e", fontSize: "14px", fontWeight: "600" }}
                  >
                    Delete Chat
                  </Typography>
                </ListItemText>
              </MenuItem>
            </Menu>
          </div>
        );
      });
    };

  return (
    <div className="chatsContainer">
      <Searchbar />
      <div className="chatsList">
        <Divider textAlign="left">
          <p className="chatTitle">Inbox</p>
        </Divider>
        {renderChatsList()}
      </div>
    </div>
  );
};

export default Chats;
