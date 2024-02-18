import React, { useContext, useEffect, useState } from "react";
import { Timestamp, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import Message from "./Message";
import { ChatContext } from "../context/ChatContext";

interface MessageData {
  id: string;
  senderId: string | undefined;
  senderName: string | null | undefined;
  senderAvatar: string | undefined;
  date: Timestamp;
  text?: string; 
  img?: string; 
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
