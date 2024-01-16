import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './App.scss'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from './pages/Login.tsx';
import Register from './pages/Register.tsx';
import Protected from './components/Protected.tsx';
import Home from './pages/Home.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="register" element={<Register />} />
      <Route path="login" element={<Login />} />
      <Route path="/" element={<Protected />} >
        <Route path="/" index element={<Home />} />
      </Route>
    </Route>
  )
);

const rootElement = document.getElementById('root') as Element | null;

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <RouterProvider router={router} />
  );
} else {
  console.error("Root element not found.");
}
