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
import { IconButton, Tooltip } from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import WavingHandRoundedIcon from "@mui/icons-material/WavingHandRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LoadingScreen from "./LoadingScreen";

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
  const [loading, setLoading] = useState(false);

  const currentUser = React.useContext(AuthContext);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "users"), where("displayName", "==", username));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setError(true);
        setUser(null);
      } else {
        setError(false);
        setUser(querySnapshot.docs[0].data() as UserData);
      }
    } catch (err) {
      console.error("Error searching for user:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!currentUser || !user || currentUser.uid === user.uid) {
      // Ensure currentUser and user are defined and not the same user
      return;
    }

    const combinedId = currentUser.uid > user.uid ? `${currentUser.uid}${user.uid}` : `${user.uid}${currentUser.uid}`;

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

        const currentUserDoc = await getDoc(doc(db, "users", currentUser.uid));
        const currentUserProfession = currentUserDoc.data()?.profession || "";

        await updateDoc(doc(db, "userChats", user.uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            profession: currentUserProfession,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error("Error handling selection:", err);
    } finally {
      setUser(null);
      setUsername("");
    }
  };

  return (
    <div className="searchbar">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Search for a user..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKey}
        />
        <IconButton onClick={handleSearch}>
          <SearchRoundedIcon className="searchIcon" />
        </IconButton>
      </div>
      {loading && <LoadingScreen />}
      {error && <p className="error-message">User not found</p>}
      {user && (
        <div className="searchResult">
          <div className="searchResultUser">
            <img src={user.avatarURL} alt={user.displayName} className="searchResultUserImg" />
            <div className="searchResultUserInfo">
              <h4 className="searchResultUserName">{user.displayName}</h4>
              <p className="searchResultUserProfession">{user.profession}</p>
            </div>
            <div className="searchResultbuttons">
              {!currentUser || currentUser.uid !== user.uid && (
                <IconButton onClick={handleSelect}>
                  <Tooltip title="Say Hi!">
                    <WavingHandRoundedIcon className="searchResultbutton" />
                  </Tooltip>
                </IconButton>
              )}
              <IconButton onClick={() => setUser(null)}>
                <Tooltip title="Remove">
                  <CloseRoundedIcon className="searchResultbutton" />
                </Tooltip>
              </IconButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;
