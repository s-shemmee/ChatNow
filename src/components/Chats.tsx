import React from "react";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { IconButton } from "@mui/material";

const Chats:React.FC = () => {
  return (
    <div className="chats">
      {/* searchbar*/}
      <div className="searchbar">
        <input type="text" placeholder="Search for users..." />
        <IconButton>
          <SearchRoundedIcon className="searchIcon"/>
        </IconButton>
      </div>

      {/* chats*/}
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
    </div>
  );
};

export default Chats;