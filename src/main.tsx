import { createRoot } from 'react-dom/client';
import AuthProvider from './hooks/AuthProvider.tsx';
import { App } from './App.tsx';
import { Login } from './pages/Login/Login.tsx';
import { Signup } from './pages/Signup/Signup.tsx';

import './index.css';

import { BrowserRouter, Route, Routes } from 'react-router';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import SocketProvider from './hooks/SocketProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" Component={Login}></Route>
        <Route path="/signup" Component={Signup}></Route>
        <Route Component={ProtectedRoute}>
          <Route
            path="/"
            element={
              <SocketProvider>
                <App />
              </SocketProvider>
            }
          ></Route>
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);
