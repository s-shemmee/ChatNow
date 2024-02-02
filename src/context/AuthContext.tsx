import React, { createContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import 'ldrs/dotStream'; // Import the desired loading spinner

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
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once the authentication state is determined
      console.log("User state after reload:", user);
    });

    return () => unsub();
  }, []);

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
