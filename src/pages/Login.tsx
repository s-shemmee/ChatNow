import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { auth, db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import Checkbox from "@mui/material/Checkbox";
import { Typography } from "@mui/material";
import LoadingScreen from "../components/LoadingScreen";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { email, password } = formData;

      // Custom validation
      if (!email) {
        setErrorMessage("Please enter your email.");
        return;
      }

      if (!password) {
        setErrorMessage("Please enter your password.");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Handle successful login 
      console.log("User logged in successfully:", user);

      // Fetch the latest user metadata from Firebase Auth
      const updatedUser = auth.currentUser;

      if (updatedUser) {
        // Check if the user document exists before updating
        const usersCollectionRef = doc(db, "users", updatedUser.uid);
        const userDoc = await getDoc(usersCollectionRef);

        if (userDoc.exists()) {
          // Document exists, update it
          await updateDoc(usersCollectionRef, {
            userMetadata: {
              creationTime: updatedUser.metadata.creationTime,
              lastSignInTime: updatedUser.metadata.lastSignInTime,
            },
          });
        } else {
          // Handle the case where the document doesn't exist
          console.error("User document does not exist:", updatedUser.uid);
        }
      }

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      setErrorMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="loginForm">
      <div className="logo">
        <h1>
          Chat<span>Now</span>
        </h1>
        <img src={logo} alt="" />
      </div>
      <div className="heading">
        <h3>
          Welcome back! Please <span>sign in</span> to your account.
        </h3>
      </div>
      <form onSubmit={handleLogin}>
        {/* Email Input */}
        <div className="formGroup">
          <label htmlFor="email">Email</label>
          <div className="inputGroup">
            <MailOutlineRoundedIcon className="inputIcon" />
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={formData.email}
              required
              onChange={handleInputChange}
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
              autoComplete="current-password"
              placeholder="********"
              value={formData.password}
              required
              onChange={handleInputChange}
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

        {/* Remember Me & Forget Password */}
        <div className="remember_forget">
          <div className="remember">
            <Checkbox
              checked={formData.rememberMe}
              onChange={(e) =>
                setFormData({ ...formData, rememberMe: e.target.checked })
              }
            />
            <span>Remember me</span>
          </div>
          <Link to="/forgot-password" className="forget">
            Forget password?
          </Link>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="error-message">
            <Typography color="error">{errorMessage}</Typography>
          </div>
        )}

        {/* Submit Button */}
        <button className="formButton" type="submit">
          Sign in
        </button>

        {/* Sign Up Link */}
        <span>
          Don’t have an account yet? <Link to="/register">Sign up</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
