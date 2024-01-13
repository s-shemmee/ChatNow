import React from "react";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";

const Chat:React.FC = () => {
  return (
    <div className="chat">
      <ChatHeader />
      <ChatInput />
    </div>
  );
};

export default Chat;