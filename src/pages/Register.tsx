import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { auth, db, storage } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, UserCredential, User, UserMetadata } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import AddPhotoAlternateRoundedIcon from "@mui/icons-material/AddPhotoAlternateRounded";
import WorkOutlineRoundedIcon from "@mui/icons-material/WorkOutlineRounded";
import LoadingScreen from "../components/LoadingScreen";

const Register: React.FC = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;

    const displayName = (form.elements.namedItem("displayName") as HTMLInputElement)?.value;
    const profession = (form.elements.namedItem("profession") as HTMLInputElement)?.value;
    const email = (form.elements.namedItem("email") as HTMLInputElement)?.value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)?.value;
    const avatarInput = form.elements.namedItem("avatar") as HTMLInputElement;
    const avatar = avatarInput?.files?.[0];

    try {
      setLoading(true);
      if (displayName && email && password && avatar) {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

        const user: User = userCredential.user;
        const userMetadata: UserMetadata = user.metadata;

        // Destination to upload avatars
        const storageRef = ref(storage, `avatars/${displayName}_${new Date().getTime()}_avatar`);
        // Upload avatar to the storage
        const uploadTask = uploadBytesResumable(storageRef, avatar);

        uploadTask.on(
          "state_changed",
          () => {},
          (error) => {
            console.error("Avatar upload failed:", (error as Error)?.message || "An error occurred");
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

              // Update user profile
              await updateProfile(user, {
                displayName: displayName,
                photoURL: downloadURL,
              });

              // Add user information to Firestore "users" collection
              const usersCollectionRef = doc(db, "users", user.uid);
              await setDoc(usersCollectionRef, {
                uid: user.uid,
                displayName: displayName,
                profession: profession,
                email: email,
                avatarURL: downloadURL,
                userMetadata: {
                  creationTime: userMetadata.creationTime,
                  lastSignInTime: userMetadata.lastSignInTime,
                },
              });

              // Add user chats to Firestore "userChats" collection
              const chatIdList: string[] = [];
              const userChatsCollectionRef = doc(db, "userChats", user.uid);
              await setDoc(userChatsCollectionRef, {
                chatIdList: chatIdList,
              });

              // Redirect to the home page after successful operations
              navigate("/");
            } catch (error) {
              console.error("Error updating user information:", (error as Error)?.message || "An error occurred");
            } finally {
              setLoading(false);
            }
          }
        );
      }
    } catch (error) {
      console.error("Registration failed:", (error as Error)?.message || "An error occurred");
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="registerForm">
      <div className="logo">
        <h1>
          Chat<span>Now</span>
        </h1>
        <img src={logo} alt="chatapp logo" />
      </div>
      <div className="heading">
        <h3>
          <span>Sign up</span> to get started with ChatNow!
        </h3>
      </div>
      <form onSubmit={handleRegister}>
        {/* displayName Input */}
        <div className="formGroup">
          <label htmlFor="displayName">Display Name</label>
          <div className="inputGroup">
            <AccountCircleOutlinedIcon className="inputIcon" />
            <input
              type="text"
              id="displayName"
              name="displayName"
              autoComplete="off"
              placeholder="Your Display Name"
              required
            />
          </div>
        </div>

        {/* Profession Input */}
        <div className="formGroup">
          <label htmlFor="profession">Profession</label>
          <div className="inputGroup">
            <WorkOutlineRoundedIcon className="inputIcon" />
            <input
              type="text"
              id="profession"
              name="profession"
              autoComplete="off"
              placeholder="Your Profession"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <div className="inputGroup">
            <MailOutlineRoundedIcon className="inputIcon" />
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="formGroup">
          <label htmlFor="password">Password</label>
          <div className="inputGroup">
            <HttpsOutlinedIcon className="inputIcon" />
            <input
              type={isPasswordVisible ? "text" : "password"}
              id="password"
              name="password"
              placeholder="********"
              required
              autoComplete="new-password"
            />
            <div className="show_hide" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? (
                <VisibilityOffOutlinedIcon className="inputIcon" />
              ) : (
                <RemoveRedEyeOutlinedIcon className="inputIcon" />
              )}
            </div>
          </div>
        </div>

        {/* Avatar Input*/}
        <div className="formGroup">
          <label htmlFor="avatar">Avatar</label>
          <div className="inputGroup">
            <AddPhotoAlternateRoundedIcon className="inputIcon" />
            <input type="file" id="avatar" name="avatar" required />
          </div>
        </div>

        {/* Submit Button */}
        <button className="formButton" type="submit">
          Sign up
        </button>

        {/* Already have an account Link */}
        <span>
          Already have an account? <Link to="/login">Sign in</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
