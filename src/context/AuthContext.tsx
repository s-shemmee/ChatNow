import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// Define a type for the user
type AuthUser = User | null;

// Create a context object
export const AuthContext = createContext<AuthUser>(null);

// Define a type for AuthProvider props
type AuthProviderProps = {
  children: React.ReactNode;
};

// Create a provider for components to consume and subscribe to changes
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser>(null);

  // Get current user data when component mounts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

// Export the context object
export default AuthContext;
