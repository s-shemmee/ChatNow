import { createRoot } from 'react-dom/client';
import { AuthProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <AuthProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AuthProvider>
  );
} else {
  console.error("Root element not found.");
}
