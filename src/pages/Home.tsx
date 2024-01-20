import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Chats from "../components/Chats";
import Chat from "../components/Chat";

const Home: React.FC = () => {
  // State to track whether a chat is selected or not
  const [selectedChat, setSelectedChat] = useState<number | null>(null);

  return (
    <div className="home">
      <Sidebar />
      <Chats onSelectChat={(chatId: number) => setSelectedChat(chatId)} />
      
      {/* Display message when no chat is selected */}
      {selectedChat === null ? (
        <div className="noChatMessage">
          <h3>Hey there!</h3> 
          <p>No chats yet. Click on a user chat to kick off a conversation. 😊</p>    
        </div>
      ) : (
        // Render the Chat component when a chat is selected
        <Chat />
      )}
    </div>
  );
};

export default Home;
