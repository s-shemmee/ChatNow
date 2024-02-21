import React, { useContext, useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import { doc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import MarkChatUnreadRoundedIcon from '@mui/icons-material/MarkChatUnreadRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { IconButton, Tooltip, Divider, ListItemIcon, ListItemText, Typography } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { formatDistanceToNow } from "date-fns";
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
    text: string;
    date: Timestamp;
  }>;
}

interface ChatsProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
}

const Chats: React.FC<ChatsProps> = ({ onSelectChat, selectedChatId }) => {
  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chatData, setChatData] = useState<Record<string, ChatData>>({});
  const [lastMessages, setLastMessages] = useState<Record<string, { message: string, date: string }>>({});
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  useEffect(() => {
    const unsubscribe = currentUser && onSnapshot(
      doc(db, "userChats", currentUser.uid),
      async (snapshot) => {
        const data = snapshot.data();
        setChatData(data || {});

        if (data && data.userInfo) {
          const userDoc = await getDoc(doc(db, "users", data.userInfo.uid));
          const userMetadata = userDoc.data()?.metadata || {};

          dispatch({
            type: 'CHANGE_USER',
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
    );

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
          const formattedDistance = formatDistanceToNow(lastMessage.date.toDate(), { locale: enUS });
          setLastMessages((prev) => ({ ...prev, [chatId]: { message: lastMessage.message?.text || 'No messages yet', date: formattedDistance } }));
        }
      });
    });

    return () => unsubscribeMessages.forEach((unsubscribe) => unsubscribe());
  }, [chatData]);

  const openChat = (chatId: string) => {
    const chat = chatData[chatId];
    if (chat?.userInfo) {
      onSelectChat(chatId);
      dispatch({ type: 'CHANGE_USER', payload: { ...chat.userInfo } });
    }
  };

  const renderChatsList = () => {
    return Object.keys(chatData).map((chatId) => {
      const { userInfo } = chatData[chatId];
  
      if (!userInfo) {
        return null;
      }
  
      const lastMessage = lastMessages[chatId];
      const truncatedMessage = lastMessage?.message.split(' ').slice(0, 6).join(' ') || 'No messages yet'; // Displaying the first 6 words
  
      return (
        <div key={chatId} className={`chatCard ${selectedChatId === chatId ? 'selected' : ''}`} onClick={() => openChat(chatId)}>
          <div className="chatUserInfo">
            <img src={userInfo.photoURL} alt={userInfo.displayName} className="chatUserImg" />
            <div className="chatContent">
              <div className="chatUser">
                <h4 className="chatUserName">{userInfo.displayName}</h4>
                <span className="chatUserProfession">{userInfo.profession}</span>
              </div>
              <p className="chatLastMessage">{truncatedMessage}</p>
            </div>
          </div>
          <div className="chatUserDetails">
            <IconButton onClick={handleClick}>
              <Tooltip title="More" className="button">
                <MoreHorizRoundedIcon />
              </Tooltip>
            </IconButton>
            {lastMessage && <p className="timestamp">{lastMessage.date}</p>}
          </div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem>
              <ListItemIcon>
                <MarkChatUnreadRoundedIcon sx={{ color: "#9474f4", fontSize: "20px" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" sx={{ color: "#5e5e5e", fontSize: '14px', fontWeight: '600' }}>
                  Mark as unread
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <ArchiveRoundedIcon sx={{ color: "#9474f4", fontSize: "20px" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" sx={{ color: "#5e5e5e", fontSize: '14px', fontWeight: '600' }}>
                  Archive Chat
                </Typography>
              </ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <DeleteRoundedIcon sx={{ color: "#9474f4", fontSize: "20px" }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2" sx={{ color: "#5e5e5e", fontSize: '14px', fontWeight: '600' }}>
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
