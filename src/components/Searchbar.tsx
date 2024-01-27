import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { IconButton, Tooltip } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WavingHandRoundedIcon from '@mui/icons-material/WavingHandRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface UserData {
  avatarURL: string;
  displayName: string;
  profession: string;
}

const Searchbar: React.FC = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState(false);

  const handleSearch = async () => {
    try {
      const q = query(collection(db, "users"), where("displayName", "==", username));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data() as UserData);
      });
      setError(false); 
    } catch (err) {
      setError(true);
    }
  };
  
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="searchbar">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search for a user"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
        <IconButton onClick={handleSearch}>
          <SearchRoundedIcon className="searchIcon"/>
        </IconButton>
      </div>
      {error && <p>User not found</p>}
      {user && (
        <div className="searchResult">
          <div className="searchResultUser">
            <img src={user.avatarURL} alt={user.displayName} className="searchResultUserImg"/>
            <div className="searchResultUserInfo">
              <h4 className="searchResultUserName">{user.displayName}</h4>
              <p className="searchResultUserProfession">{user.profession}</p>
            </div>
            <div className="searchResultbuttons">
              <Tooltip title="Say Hey!">
                <IconButton>
                  <WavingHandRoundedIcon className="searchResultbutton"/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Remove">
                <IconButton onClick={() => setUser(null)}>
                  <CloseRoundedIcon className="searchResultbutton"/>
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
