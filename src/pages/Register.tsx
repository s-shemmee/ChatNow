import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { app, auth } from "../firebase"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const database = getDatabase(app);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      // Register the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store additional user data in the Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        username,
        email,
        avatar,
      });
  
      // Save token and user data in localStorage
      localStorage.setItem('token', user.accessToken);
      localStorage.setItem('user', JSON.stringify(user));
  
      // Redirect to the home page after successful registration
      navigate("/");
  
    } catch (error) {
      console.error('Error: chi haja mahiyach', error);
    }
  
    // Clear input fields after submission (optional)
    setUsername("");
    setEmail("");
    setAvatar("");
    setPassword("");
  };
  
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="registerForm">
      <div className="logo">
        <h1>Chat<span>Now</span></h1>
        <img src={logo} alt="" />
      </div>
      <div className="heading">
        <h2>Create an account</h2>
        <p>Sign up to get started with ChatNow!</p>
      </div>
      <form onSubmit={handleRegister}>
        {/* Username Input */}
        <div className="formGroup">
          <label htmlFor="username">Username</label>
          <div className="inputGroup">
            <AccountCircleOutlinedIcon className="inputIcon" />
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              placeholder="Your username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
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
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              required
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
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
          <label htmlFor="avatar">
            Avatar (optional)
          </label>
          <div className="inputGroup">
            <AddPhotoAlternateRoundedIcon className="inputIcon" />
            <input
              type="file"
              id="avatar"
              name="avatar"
              placeholder="Your avatar"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
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
