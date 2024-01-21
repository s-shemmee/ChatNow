import React, { useRef } from "react";
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import MicRoundedIcon from '@mui/icons-material/MicRounded';
import MoodRoundedIcon from '@mui/icons-material/MoodRounded';
import FormatColorTextRoundedIcon from '@mui/icons-material/FormatColorTextRounded';
import { IconButton, InputBase } from "@mui/material";

const ChatInput: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
          {renderIconButton(<FormatColorTextRoundedIcon />, 'chatIcon')}
          <IconButton onClick={handleAttachmentClick}>
            <AttachFileRoundedIcon className="chatIcon" />
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={(e) => handleFileUpload(e)}
            />
          </IconButton>
          {renderIconButton(<MoodRoundedIcon />, 'chatIcon')}
        </div>
        <div className="chatSend">
          {renderIconButton(<MicRoundedIcon />, 'chatIcon')}
          {renderIconButton(<SendRoundedIcon />, 'chatIconSend')}
        </div>
      </div>
    </div>
  );
};

// Helper function to render IconButtons with consistent styling
const renderIconButton = (icon: React.ReactElement, className: string) => (
  <IconButton className={className}>
    {icon}
  </IconButton>
);

const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = event.target.files?.[0];

  if (selectedFile) {
    // Handle the file upload logic here
    console.log("File uploaded:", selectedFile);
  }
};

export default ChatInput;
