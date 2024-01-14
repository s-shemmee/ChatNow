import React from "react";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";

const Chat:React.FC = () => {
  return (
    <div className="chat">
      <ChatHeader />
      <div className="chatMessages">
        <p>Messages will go here</p>
      </div>
      <ChatInput />
    </div>
  );
};

export default Chat;