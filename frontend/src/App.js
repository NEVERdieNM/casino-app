import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GameLobbyPage from './pages/GameLobbyPage';
import GamePage from './pages/GamePage';
import ProfilePage from './pages/ProfilePage';
import WalletPage from './pages/WalletPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminGamesPage from './pages/admin/AdminGamesPage';
import AdminTransactionsPage from './pages/admin/AdminTransactionsPage';
import NotFoundPage from './pages/NotFoundPage';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import { checkAuth } from './store/slices/authSlice';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-casino-secondary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/games" />} />
        <Route path="register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/games" />} />
        
        {/* Protected Routes */}
        <Route path="games" element={
          <ProtectedRoute>
            <GameLobbyPage />
          </ProtectedRoute>
        } />
        <Route path="games/:id" element={
          <ProtectedRoute>
            <GamePage />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="wallet" element={
          <ProtectedRoute>
            <WalletPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        } />
        <Route path="users" element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        } />
        <Route path="games" element={
          <AdminRoute>
            <AdminGamesPage />
          </AdminRoute>
        } />
        <Route path="transactions" element={
          <AdminRoute>
            <AdminTransactionsPage />
          </AdminRoute>
        } />
      </Route>

      {/* 404 Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;