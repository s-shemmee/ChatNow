import React, { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";

interface MessageData {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp?: Date;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const { state } = useContext(ChatContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "chats", state.chatId), (doc) => {
      doc.exists() && setMessages(doc.data()?.messages || []);
    });

    return () => {
      unsubscribe();
    };
  }, [state.chatId]);

  console.log(state.chatId, messages);

  return (
    <div className="Messages">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};

export default Messages;
