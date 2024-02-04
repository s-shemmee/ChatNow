import React from "react";
import Searchbar from "../components/Searchbar";
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { IconButton, Tooltip } from "@mui/material";

const Chats:React.FC = () => {
  return (
    <div className="chatsContainer">
      {/* searchbar*/}
      <Searchbar />

      {/* chats */}
      <div className="chatsList">
        <div className="chat">
          <img src="https://randomuser.me/api/portraits/men/95.jpg" alt="" />
          <div className="chatInfo">
            <div className="chatUser">
              <span className="chatName">Username</span>
              <span className="chatProfession">developer</span>
            </div>
            <span className="chatMsg">
              Lorem ipsum dolor sit
            </span>
          </div>
            <div className="chatDetails">
              <span className="chatTime">10:34</span>
              <Tooltip title="Options">
                <IconButton>
                  <MoreHorizRoundedIcon />
                </IconButton>
              </Tooltip>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;