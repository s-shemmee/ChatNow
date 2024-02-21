import React, { useRef, useContext, useState, useEffect } from "react";
import { arrayUnion, doc, updateDoc, Timestamp } from "firebase/firestore";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MoodRoundedIcon from '@mui/icons-material/MoodRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import TextFieldsRoundedIcon from '@mui/icons-material/TextFieldsRounded';
import InsertLinkRoundedIcon from '@mui/icons-material/InsertLinkRounded';
import { IconButton, InputBase, Tooltip } from "@mui/material";
import { ChatContext } from "../context/ChatContext";
import AuthContext from "../context/AuthContext";

interface Message {
  id: string;
  senderId: string | undefined;
  senderName: string | null | undefined;
  senderAvatar: string | undefined;
  date: Timestamp;
  message?: {
    text?: string;
    img?: string;
  };
}

const ChatInput: React.FC = () => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { state } = useContext(ChatContext);
  const currentUser = useContext(AuthContext);

  // Reset input state when the chatId changes
  useEffect(() => {
    setText("");
    setImg(null);
  }, [state.chatId]);

  const handleSend = async () => {
    if (text.trim() || img) {
      const message: Message = {
        id: uuidv4(),
        senderId: currentUser?.uid,
        senderName: currentUser?.displayName,
        senderAvatar: currentUser?.photoURL || "",
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
            message.message = { img: downloadURL };
  
            // Add the message to the messages array
            await updateDoc(doc(db, "chats", state.chatId), {
              messages: arrayUnion(message),
            });
          });
        });
      } else {
        // For text messages, store the text in the 'text' property
        message.message = { text: text.trim() };

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

  const handleRemoveFile = () => {
    setImg(null);
  };

  const renderFilePreview = () => {
    if (img) {
      // Check if the selected file is an image
      if (img.type.startsWith("image/")) {
        return (
          <div className="imgPreviewContainer">
            <img src={URL.createObjectURL(img)} alt="Image Preview" className="imgPreview" />
            <IconButton className="removeImgIcon" onClick={handleRemoveFile}>
              <CloseRoundedIcon />
            </IconButton>
          </div>
        );
      } else {
        return (
          <div className="filePreviewContainer">
            <p>{img.name}</p>
            <IconButton className="removeFileIcon" onClick={handleRemoveFile}>
              <CloseRoundedIcon />
            </IconButton>
          </div>
        );
      }
    }
    return null;
  };

  const handleEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="chatInput">
      <form>
        {renderFilePreview()}
        <InputBase
          placeholder={img ? "" : "Type a message..."}
          inputProps={{ 'aria-label': 'type a message' }}
          className="inputBase"
          name="input"
          onChange={(e) => setText(e.target.value)}
          value={text}
          onKeyDown={handleEnterKey}
        />
      </form>
      <div className="chatIcons">
        <div className="chatOptions">
          <IconButton className="chatIcon">
            <Tooltip title="Text Format" placement="bottom" arrow enterDelay={500} leaveDelay={200} aria-label="text format">
              <TextFieldsRoundedIcon />
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
          <IconButton className="chatIcon">
            <Tooltip title="Insert Link" placement="bottom" arrow enterDelay={500} leaveDelay={200} aria-label="insert link">
              <InsertLinkRoundedIcon />
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
