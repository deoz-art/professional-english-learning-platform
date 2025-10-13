import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LevelSelectionPage from './pages/LevelSelectionPage';
// Admin Pages
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import UserManagementPage from './admin/pages/UserManagementPage';
import UserEditPage from './admin/pages/UserEditPage';
import LevelManagementPage from './admin/pages/LevelManagementPage';
import LevelEditPage from './admin/pages/LevelEditPage';

function App() {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Public Routes */}
          
          {/* Protected Student Routes */}
          <Route
            path="/levels"
            element={
              <ProtectedRoute>
                <LevelSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:levelNumber"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          
          {/* Protected Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute adminOnly>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/new"
            element={
              <ProtectedRoute adminOnly>
                <UserEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <ProtectedRoute adminOnly>
                <UserEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/levels"
            element={
              <ProtectedRoute adminOnly>
                <LevelManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/levels/new"
            element={
              <ProtectedRoute adminOnly>
                <LevelEditPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/levels/:levelId"
            element={
              <ProtectedRoute adminOnly>
                <LevelEditPage />
              </ProtectedRoute>
            }
          />
          
            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;