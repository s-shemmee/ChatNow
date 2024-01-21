import React from "react";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import Messages from "../components/Messages";

const Chat:React.FC = () => {
  return (
    <div className="chat">
      <ChatHeader />
      <Messages />
      <ChatInput />
    </div>
  );
};

export default Chat;