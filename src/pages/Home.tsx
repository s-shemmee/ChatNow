import React from "react";
import Sidebar from "../components/Sidebar";
import Chats from "../components/Chats"

const Home:React.FC = () => {
  return (
    <div className="home">
      <Sidebar />
      <Chats />
    </div>
  );
};

export default Home;