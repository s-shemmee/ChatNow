import React, {
  createContext,
  useReducer,
  ReactNode,
  Dispatch,
} from 'react';
import { AuthContext } from './AuthContext';
import { Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getDoc, doc } from 'firebase/firestore';

interface UserData {
  uid: string;
  displayName: string;
  photoURL: string;
  profession: string;
  date?: Timestamp;
  userMetadata: {
    creationTime: string;
    lastSignInTime: string;
  };
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
  state: { chatId: 'null', user: { uid: '', displayName: '', profession: '', photoURL: '', userMetadata : { creationTime : '', lastSignInTime: '' } } },
  dispatch: () => null,
});

interface ChatContextProviderProps {
  children: ReactNode;
}

export const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const currentUser = React.useContext(AuthContext);
  const INITIAL_STATE: ChatState = {
    chatId: 'null',
    user: { uid: '', displayName: '', profession: '', photoURL: '', userMetadata : { creationTime:  "", lastSignInTime: "" } },
  };

  const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: { ...state.user, ...action.payload },
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

  // Fetch user metadata from Firestore "users" collection when the component mounts
  React.useEffect(() => {
    const fetchUserMetadata = async () => {
      // Check if currentUser is available and has uid
      if (currentUser?.uid) {
        const userDocSnapshot = await getDoc(doc(db, 'users', currentUser.uid));

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as Partial<UserData>;

          // Update the user metadata in the context
          dispatch({ type: 'CHANGE_USER', payload: userData });
        }
      }
    };

    fetchUserMetadata();
  }, [currentUser]);

  const contextValue: ChatContextProps = { state, dispatch };

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
};
