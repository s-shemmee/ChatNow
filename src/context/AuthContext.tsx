import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

interface DotStreamProps extends React.HTMLAttributes<HTMLElement> {
  size?: string;
  speed?: string;
  color?: string;
}

export const AuthContext = createContext<User | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'l-dot-stream': DotStreamProps;
    }
  }
}

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
      console.log("User state after reload:", user);
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
    // You can return the LDRS loading spinner or any other loading indicator here
    return (
      <div>
        <l-dot-stream size="60" speed="2.5" color="white"></l-dot-stream>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
