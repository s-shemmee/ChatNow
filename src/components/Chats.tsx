import React from "react";
import Searchbar from "../components/Searchbar";

const Chats:React.FC = () => {
  return (
    <div className="chats">
      {/* searchbar*/}
      <Searchbar />

      {/* chats
      <div className="chatsContainer">
        <div className="chatCard">
          <div className="chatUser">
            <img src="https://picsum.photos/200" alt="" className="chatImg"/>
            <div className="chatInfo">
              <h3 className="chatName">Chat 1</h3>
              <p className="chatMsg">This is the last message</p>
            </div>
          </div>
          <span className="chatTime">
            1:00pm
          </span>
        </div>
      </div>
      */}
    </div>
  );
};

export default Chats;