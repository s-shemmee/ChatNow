import { useState } from 'react';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import ReplyRoundedIcon from '@mui/icons-material/ReplyRounded';
import ShortcutRoundedIcon from '@mui/icons-material/ShortcutRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Message: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoreHorizClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='messageContent'>
      <div className='messageUser'>
        <img src='https://picsum.photos/200' alt='' className='messageImg' />
      </div>
      <div className='messageInfo'>
        <h4 className='messageText'>Hello World!</h4>
        <img src="https://picsum.photos/200" alt="" className="messageImgs" />
        <span className='messageTime'>10:23 PM</span>
      </div>
      <div className='messageAction' onClick={handleMoreHorizClick}>
        <IconButton>
          <MoreHorizRoundedIcon />
        </IconButton>
      </div>
      <Menu
        id="message-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{
          "aria-labelledby": "message-menu",
        }}

      >
        <MenuItem onClick={handleMenuClose}>
          <IconButton>
            <ReplyRoundedIcon />
          </IconButton>
          Reply
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <IconButton>
            <ShortcutRoundedIcon />
          </IconButton>
          Forward
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
        <IconButton>
            <ContentCopyRoundedIcon />
          </IconButton>
          Copy
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <IconButton>
            <DeleteRoundedIcon />
          </IconButton>
          Delete
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Message