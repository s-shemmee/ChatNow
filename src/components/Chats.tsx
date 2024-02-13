import React, { useContext, useEffect, useState } from "react";
import Searchbar from "../components/Searchbar";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
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

const Chats: React.FC = () => {
  const currentUser = useContext(AuthContext);
  const {dispatch} = useContext(ChatContext);
  const [chatData, setChatData] = useState<Record<string, ChatData>>({});

  useEffect(() => {
    const unsubscribe = currentUser && onSnapshot(
      doc(db, "userChats", currentUser.uid),
      (snapshot) => {
        const data = snapshot.data();
        setChatData(data || {});

        // Example: Dispatch CHANGE_USER action
        if (data && data.userInfo) {
          dispatch({ type: 'CHANGE_USER', payload: data.userInfo });
        }
      }
    );

    return () => {
      unsubscribe && unsubscribe();
    };
  }, [currentUser, dispatch]);

  const openChat = (chatId: string) => {
    // Example: Dispatch CHANGE_USER action
    const chat = chatData[chatId];
    if (chat && chat.userInfo) {
      dispatch({ type: 'CHANGE_USER', payload: { ...chat.userInfo, date: chat.date } });
    }
  };
  
  console.log(chatData);

  const renderChatsList = () => {
    return Object.keys(chatData).map((chatId) => {
      const { userInfo, lastMessage, date } = chatData[chatId];
  
      if (!userInfo) {
        return null;
      }
  
      // Check if the date exists before calling toDate()
      const formattedTime = date ? date.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }) : '';
  
      return (
        <div key={chatId} className="chatCard"  onClick={() => openChat(chatId)}>
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
            {/* Check if formattedTime is not an empty string before rendering */}
            {formattedTime && <p className="timestamp">{formattedTime}</p>}
          </div>
        </div>
      );
    });
  };
  
  return (
    <div className="chatsContainer">
      {/* searchbar*/}
      <Searchbar />

      {/* chats */}
      <div className="chatsList">
        {renderChatsList()}
      </div>
    </div>
  );
};

export default Chats;
