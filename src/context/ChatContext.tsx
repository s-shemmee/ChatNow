import React, { createContext, useReducer, ReactNode } from "react";
import { AuthContext } from "./AuthContext";

interface UserData {
  uid: string;
  displayName: string;
  photoURL: string;
  profession: string;
}

interface ChatState {
  chatId: string;
  user: UserData;
}

interface ChatAction {
  type: string;
  payload?: UserData;
}

interface ChatContextProps {
  data: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}

export const ChatContext = createContext<ChatContextProps | undefined>(undefined);

interface ChatContextProviderProps {
  children: ReactNode;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const currentUser = React.useContext(AuthContext);
  const INITIAL_STATE: ChatState = {
    chatId: "null",
    user: { uid: "", displayName: "", profession: "", photoURL:"" }, // Initialize user with empty values
  };

  const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload || { uid: "", displayName: "", profession: "", photoURL: "" }, // Use empty values as fallback
          chatId:
            currentUser?.uid && action.payload?.uid
              ? currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid
              : "null",
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const contextValue: ChatContextProps = { data: state, dispatch };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};
