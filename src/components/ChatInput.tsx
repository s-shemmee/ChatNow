import React, { useRef, ChangeEvent } from "react";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MoodRoundedIcon from '@mui/icons-material/MoodRounded';
import FormatColorTextRoundedIcon from '@mui/icons-material/FormatColorTextRounded';
import { IconButton, InputBase, Tooltip } from "@mui/material";

const ChatInput: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      // Handle the file upload logic here
      console.log("File uploaded:", selectedFile);
    }
  };

  return (
    <div className="chatInput">
      <form>
        <InputBase
          placeholder="Type a message"
          inputProps={{ 'aria-label': 'type a message' }}
          className="inputBase"
          name="input"
        />
      </form>
      <div className="chatIcons">
        <div className="chatOptions">
          <IconButton className="chatIcon">
            <Tooltip title="Text Format" placement="bottom" arrow enterDelay={500} leaveDelay={200} aria-label="text format">
              <FormatColorTextRoundedIcon />
            </Tooltip>
          </IconButton>
          <IconButton onClick={handleAttachmentClick} className="chatIcon">
            <Tooltip title="Attach a file" placement="bottom" arrow enterDelay={500} leaveDelay={200} aria-label="attach a file">
              <AttachFileRoundedIcon />
            </Tooltip>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </IconButton>
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
          <IconButton className="chatIconSend">
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
