import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PollProvider } from './context/PollContext';
import { TokenProvider } from './context/TokenContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PollsPage from './pages/PollsPage';
import PollDetailPage from './pages/PollDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TokenProvider>
          <PollProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="polls" element={<PollsPage />} />
                <Route path="polls/:id" element={<PollDetailPage />} />
                <Route 
                  path="profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="admin/*" 
                  element={
                    <AdminRoute>
                      <AdminDashboardPage />
                    </AdminRoute>
                  } 
                />
              </Route>
            </Routes>
          </PollProvider>
        </TokenProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
