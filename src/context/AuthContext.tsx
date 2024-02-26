import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import LoadingScreen from "../components/LoadingScreen";

export const AuthContext = createContext<User | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Check if the user document exists before updating
            const usersCollectionRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(usersCollectionRef);

            if (userDoc.exists()) {
              // Document exists, update it
              await updateDoc(usersCollectionRef, {
                online: true,
              });
            } else {
              // Handle the case where the document doesn't exist
              console.error("User document does not exist", user.uid);
            }
          } catch (error) {
            console.error("Error updating online status:", error);
          }
        }

        setCurrentUser(user);
        setLoading(false);
      });

      // Cleanup function
      return () => {
        if (currentUser) {
          try {
            // Update online status to false in Firestore
            const usersCollectionRef = doc(db, "users", currentUser.uid);
            updateDoc(usersCollectionRef, {
              online: false,
            });
          } catch (error) {
            console.error("Error updating online status in cleanup:", error);
          }
        }

        unsub(); // Unsubscribe from onAuthStateChanged
      };
    };

    fetchData();
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
