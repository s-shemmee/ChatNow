import React, { useContext, useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import { doc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import MarkChatUnreadRoundedIcon from '@mui/icons-material/MarkChatUnreadRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import { IconButton, Tooltip } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface ChatData {
  userInfo: {
    uid: string;
    displayName: string;
    photoURL: string;
    profession: string;
  };
  date: Timestamp;
  lastMessage: {
    text: string;
    img: string;
  }
}

interface ChatsProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
}

const Chats: React.FC<ChatsProps> = ({ onSelectChat, selectedChatId }) => {
  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chatData, setChatData] = useState<Record<string, ChatData>>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  const openChat = (chatId: string) => {
    const chat = chatData[chatId];
    if (chat && chat.userInfo) {
      onSelectChat(chatId);
      dispatch({ type: 'CHANGE_USER', payload: { ...chat.userInfo, date: chat.date } });
    }
  };

  const renderChatsList = () => {
    return Object.keys(chatData).map((chatId) => {
      const { userInfo, lastMessage, date } = chatData[chatId];

      if (!userInfo) {
        return null;
      }

      const formattedTime = date ? date.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : '';

      return (
        <div key={chatId} className={`chatCard ${selectedChatId === chatId ? 'selected' : ''}`} onClick={() => openChat(chatId)}>
          <div className="chatUserInfo">
            <img src={userInfo.photoURL} alt={userInfo.displayName} className="chatUserImg" />
            <div className="chatContent">
              <div className="chatUser">
                <h4 className="chatUserName">{userInfo.displayName}</h4>
                <span className="chatUserProfession">{userInfo.profession}</span>
              </div>
              <p className="chatLastMessage">{lastMessage?.text ? lastMessage.text :  'No  messages yet'}</p>
            </div>
          </div>
          <div className="chatUserDetails">
            <IconButton onClick={(event) => handleMoreHorizClick(event, chatId)}>
              <Tooltip title="More" className="button">
                <MoreHorizRoundedIcon />
              </Tooltip>
            </IconButton>
            {formattedTime && <p className="timestamp">{formattedTime}</p>}
          </div>
          <Menu
            id={`menu-${chatId}`}
            anchorEl={anchorEl}
            open={Boolean(anchorEl && anchorEl.getAttribute('data-chat-id') === chatId)}
            onClose={handleMenuClose}
            className="Menu"
          >
            <MenuItem>
              <IconButton>
                <MarkChatUnreadRoundedIcon />
              </IconButton>
              Mark as unread
            </MenuItem>
            <MenuItem>
              <IconButton>
                <ArchiveRoundedIcon />
              </IconButton>
              Archive Chat
            </MenuItem>
            <MenuItem>
              <IconButton>
                <AutoAwesomeRoundedIcon />
              </IconButton>
              Block User
            </MenuItem>
          </Menu>
        </div>
      );
    });
  };

  const handleMoreHorizClick = (event: React.MouseEvent<HTMLElement>, chatId: string) => {
    setAnchorEl(event.currentTarget);
    event.currentTarget.setAttribute('data-chat-id', chatId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="chatsContainer">
      <Searchbar />
      <div className="chatsList">
        {renderChatsList()}
      </div>
    </div>
  );
};

export default Chats;
