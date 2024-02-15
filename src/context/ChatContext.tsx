import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import { AuthContext } from './AuthContext';
import { Timestamp } from 'firebase/firestore';
import { UserMetadata } from 'firebase/auth';

interface UserData {
  uid: string;
  displayName: string;
  photoURL: string;
  profession: string;
  metadata?: UserMetadata;
  date?: Timestamp;
}

interface ChatState {
  chatId: string;
  user: UserData;
}

interface ChatAction {
  type: string;
  payload?: Partial<UserData>; 
}

export interface ChatContextProps {
  state: ChatState;
  dispatch: Dispatch<ChatAction>;
}

export const ChatContext = createContext<ChatContextProps>({
  state: { chatId: 'null', user: { uid: '', displayName: '', profession: '', photoURL: '' } },
  dispatch: () => null,
});

interface ChatContextProviderProps {
  children: ReactNode;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const currentUser = React.useContext(AuthContext);
  const INITIAL_STATE: ChatState = {
    chatId: 'null',
    user: { uid: '', displayName: '', profession: '', photoURL: '' },
  };

  const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: {
            ...state.user,
            ...action.payload,
            metadata: {
              ...state.user.metadata,
              ...action.payload?.metadata,
            },
          },
          chatId:
            currentUser?.uid && action.payload?.uid
              ? currentUser.uid > action.payload.uid
                ? currentUser.uid + action.payload.uid
                : action.payload.uid + currentUser.uid
              : 'null',
        };
  
      default:
        return state;
    }
  };
  
  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  const contextValue: ChatContextProps = { state, dispatch };

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};
