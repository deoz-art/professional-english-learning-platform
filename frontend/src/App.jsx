import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import LevelSelectionPage from './pages/LevelSelectionPage';
import QuizPage from './pages/QuizPage';

// Admin Pages
import AdminLayout from './admin/components/AdminLayout';
import AdminDashboardPage from './admin/pages/AdminDashboardPage';
import { UserManagementPage } from './admin/pages/UserManagementPage';
import UserEditPage from './admin/pages/UserEditPage';
import StudentScoresPage from './admin/pages/StudentScoresPage';
import LevelManagementPage from './admin/pages/LevelManagementPage';
import LevelEditPage from './admin/pages/LevelEditPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Routes */}
          <Route
            path="/levels"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <LevelSelectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:levelNumber"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="users/new" element={<UserEditPage />} />
            <Route path="users/:userId/edit" element={<UserEditPage />} />
            <Route path="users/:userId/scores" element={<StudentScoresPage />} />
            <Route path="levels" element={<LevelManagementPage />} />
            <Route path="levels/new" element={<LevelEditPage />} />
            <Route path="levels/:levelId/edit" element={<LevelEditPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;