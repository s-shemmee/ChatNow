import React from "react";
import Sidebar from "../components/Sidebar";
import Chats from "../components/Chats";
import Chat from "../components/Chat"

const Home:React.FC = () => {
  return (
    <div className="home">
      <Sidebar />
      <Chats />
      <Chat />
    </div>
  );
};

export default Home;