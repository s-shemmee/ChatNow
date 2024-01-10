import React, { useState } from "react";
import logo from "../assets/logo.png";
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

// Define the Login component
const Login: React.FC = () => {
  // State to manage input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // State to manage password visibility
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Function to handle form submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Add authentication logic here (e.g., Firebase authentication)
    // For demonstration purposes, log the entered email and password
    console.log("Email:", email);
    console.log("Password:", password);

    // Clear input fields after submission (optional)
    setEmail("");
    setPassword("");
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="loginForm">
      <div className="logo">
        <img src={logo} alt="" />
        <h1>Chat<span>Now</span></h1>
      </div>
      <div className="heading">
        <h2>Login</h2>
        <p>Welcome back! Please login to your account.</p>
      </div>
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <div className="formGroup">
          <label htmlFor="email">Email Address</label>
          <div className="inputGroup">
            <MailOutlineRoundedIcon className="inputIcon" />
            <input
              type="email"
              name="email"
              placeholder="your.email@example.com"
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
              name="password"
              placeholder="********"
              value={password}
              required
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

        {/* Display error message if email or password is empty 
        {!email || !password ? (
          <div className="error">
            <p>Please enter your email and password.</p>
          </div>
        ) : null}*/}

        {/* Submit Button */}
        <button className="formButton" type="submit">
          Login
        </button>

        {/* Sign Up Link */}
        <span>
          You don't have an account? <a href="">Sign up</a>
        </span>
      </form>
    </div>
  );
};

export default Login;
