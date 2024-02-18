import React from "react";
import ChatHeader from "../components/ChatHeader";
import ChatInput from "../components/ChatInput";
import Messages from "../components/Messages";

interface ChatProps {
  chatId: string | null;
}

const Chat: React.FC<ChatProps> = () => {

  return (
    <div className="chat">
      <ChatHeader />
      <Messages /> 
      <ChatInput />
    </div>
  );
};

export default Chat;
