import React, { useContext, useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import { doc, getDoc, onSnapshot, Timestamp } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { Tooltip } from "@mui/material";

interface ChatData {
  userInfo: {
    uid: string;
    displayName: string;
    photoURL: string;
    profession: string;
  };
  date: Timestamp;
  lastMessage?: string;
}

interface ChatsProps {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
}

const Chats: React.FC<ChatsProps> = ({ onSelectChat, selectedChatId }) => {
  const currentUser = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);
  const [chatData, setChatData] = useState<Record<string, ChatData>>({});

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
            <div className="chatUser">
              <h4 className="chatUserName">{userInfo.displayName}</h4>
              <p className="lastMessage">{lastMessage || "No messages yet"}</p>
            </div>
          </div>
          <div className="chatUserDetails">
            <Tooltip title="More Options" className="button">
              <MoreHorizRoundedIcon />
            </Tooltip>
            {formattedTime && <p className="timestamp">{formattedTime}</p>}
          </div>
        </div>
      );
    });
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
