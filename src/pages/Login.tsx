import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import HttpsOutlinedIcon from '@mui/icons-material/HttpsOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';

// Define the Login component
const Login: React.FC = () => {
  // Define the navigate function
  const navigate = useNavigate();

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

  //Redirect to the home page after successful Login
  navigate("/home");

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="loginForm">
      <div className="logo">
        <h1>Chat<span>Now</span></h1>
        <img src={logo} alt="" />
      </div>
      <div className="heading">
        <h2>Sign in</h2>
        <p>Welcome back! Please sign in to your account.</p>
      </div>
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <div className="inputGroup">
            <MailOutlineRoundedIcon className="inputIcon" />
            <input
              type="email"
              name="email"
              placeholder="name@example.com"
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
          
        {/* Remember Me & Forget Password */}
        <div className="remember_forget">
          <div className="formCheckbox">
            <input type="checkbox" id="checkbox" className="checkbox" name="checkbox" />
            <label htmlFor="rememberMe">Remember me</label>
          </div>
          <a href="" className="forgetPassword">Forget password?</a>
        </div>

        {/* Submit Button */}
        <button className="formButton" type="submit" onClick={handleLogin}>
          Sign in
        </button>

        {/* Sign Up Link */}
        <span>
          Don’t have an account yet? <a href="/">Sign up</a>
        </span>
      </form>
    </div>
  );
};

export default Login;
