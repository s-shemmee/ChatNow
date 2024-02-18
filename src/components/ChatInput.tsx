import React, { useRef, useContext, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import AuthContext from "../context/AuthContext";
import { arrayUnion, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MoodRoundedIcon from '@mui/icons-material/MoodRounded';
import FormatColorTextRoundedIcon from '@mui/icons-material/FormatColorTextRounded';
import { IconButton, InputBase, Tooltip } from "@mui/material";

const ChatInput: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { state } = useContext(ChatContext);
  const currentUser = useContext(AuthContext);

  interface Message {
    id: string;
    senderId: string | undefined;
    senderName: string | null | undefined;
    senderAvatar: string | null | undefined;
    date: Timestamp;
    text?: string; 
    img?: string;  
  }

  const handleSend = async () => {
    if (text.trim() || img) {
      const message: Message = {
        id: uuidv4(),
        senderId: currentUser?.uid,
        senderName: currentUser?.displayName,
        senderAvatar: currentUser?.photoURL,
        date: Timestamp.now(),
      };
  
      if (img) {
        const imgId = uuidv4();
        const imgRef = ref(storage, `chats/${state.chatId}/${imgId}`);
        const uploadTask = uploadBytesResumable(imgRef, img);
  
        uploadTask.on("state_changed", null, (error) => {
          console.error(error);
        }, () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            // For image messages, store the URL in the 'img' property
            message.img = downloadURL;
  
            // Add the message to the messages array
            await updateDoc(doc(db, "chats", state.chatId), {
              messages: arrayUnion(message),
            });
          });
        });
      } else {
        // For text messages, store the text in the 'text' property
        message.text = text.trim();
  
        // Add the message to the messages array
        await updateDoc(doc(db, "chats", state.chatId), {
          messages: arrayUnion(message),
        });
      }
    }
    setText("");
    setImg(null);
  };

  const handleFileIconClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className="chatInput">
      <form>
        <InputBase
          placeholder="Type a message"
          inputProps={{ 'aria-label': 'type a message' }}
          className="inputBase"
          name="input"
          onChange={(e) => setText(e.target.value)}
          value={text}
        />
      </form>
      <div className="chatIcons">
        <div className="chatOptions">
          <IconButton className="chatIcon">
            <Tooltip title="Text Format" placement="bottom" arrow enterDelay={500} leaveDelay={200} aria-label="text format">
              <FormatColorTextRoundedIcon />
            </Tooltip>
          </IconButton>           
          <IconButton className="chatIcon" onClick={handleFileIconClick}>
            <Tooltip
              title="Attach a file"
              placement="bottom"
              arrow
              enterDelay={500}
              leaveDelay={200}
              aria-label="attach a file"
            >
              <AttachFileRoundedIcon />
            </Tooltip>
          </IconButton>
          <input
            ref={fileInputRef}
            type="file"
            id="fileInput"
            name="fileInput"
            style={{ display: "none" }}
            onChange={(e) => setImg(e.target.files![0])}
          />
          <IconButton className="chatIcon">
            <Tooltip title="Emoji" placement="bottom" arrow enterDelay={500} leaveDelay={200} aria-label="emoji">
              <MoodRoundedIcon />
            </Tooltip>
          </IconButton>
        </div>
        <div className="chatSend">
          <IconButton className="chatIcon">
            <Tooltip title="Voice message" placement="bottom" enterDelay={500} leaveDelay={200} aria-label="voice message">
              <MicRoundedIcon />
            </Tooltip>
          </IconButton>
          <IconButton className="chatIconSend" onClick={handleSend}>
            <Tooltip title="Send" placement="bottom" enterDelay={500} leaveDelay={200} aria-label="send">
              <SendRoundedIcon />
            </Tooltip>
          </IconButton>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
