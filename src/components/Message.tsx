import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import { IconButton } from "@mui/material";

const Message = () => {
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
      <div className='messageAction'>
        <IconButton>
          <MoreHorizRoundedIcon />
        </IconButton>
      </div>
    </div>
  )
}

export default Message