import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import { IconButton, Tooltip } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import WavingHandRoundedIcon from '@mui/icons-material/WavingHandRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

interface UserData {
  uid: string;
  avatarURL: string;
  displayName: string;
  profession: string;
}

const Searchbar: React.FC = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<UserData | null>(null);
  const [error, setError] = useState(false);

  const currentUser = React.useContext(AuthContext);

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

  const handleSelect = async () => {
    if (!currentUser || !user) {
      // Ensure currentUser and user are defined
      return;
    }
  
    const combinedId = currentUser.uid > user.uid
      ? `${currentUser.uid}${user.uid}`
      : `${user.uid}${currentUser.uid}`;
  
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
  
      if (!res.exists()) {
        // Create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
  
        // Create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.avatarURL,
            profession: user.profession,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
  
        await updateDoc(doc(db, "userChats", user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error handling selection:", err);
    }
  
    setUser(null);
    setUsername("");
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
              <Tooltip title="Say Hey!" onClick={handleSelect}>
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
