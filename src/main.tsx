import { createRoot } from 'react-dom/client';
import { AuthProvider } from "./context/AuthContext";
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
} else {
  console.error("Root element not found.");
}
