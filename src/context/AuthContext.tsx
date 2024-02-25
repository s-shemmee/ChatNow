import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import LoadingScreen from "../components/LoadingScreen";

export const AuthContext = createContext<User | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in, update online status to true in Firestore
        try {
          await updateDoc(doc(db, "users", user.uid), {
            online: true,
          });
        } catch (error) {
          console.error("Error updating online status:", error);
        }
      }

      setCurrentUser(user);
      setLoading(false); // Set loading to false once the authentication state is determined
    });

    // Cleanup function
    return () => {
      if (currentUser) {
        // User is signed out, update online status to false in Firestore
        try {
          updateDoc(doc(db, "users", currentUser.uid), {
            online: false,
          });
        } catch (error) {
          console.error("Error updating online status:", error);
        }
      }

      unsub(); // Unsubscribe from onAuthStateChanged
    };
  }, [currentUser]);

  // Return loading state and user information
  if (loading) {
    return (
      <div>
        <LoadingScreen />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
