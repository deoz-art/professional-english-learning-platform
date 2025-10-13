import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import LevelSelectionPage from './pages/LevelSelectionPage';
import QuizPage from './pages/QuizPage';
import AdminLayout from './admin/components/AdminLayout';
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
          <Route path="/login" element={<LoginPage />} />
          
          {/* Student Routes */}
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
          
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="users/new" element={<UserEditPage />} />
            <Route path="users/:userId/edit" element={<UserEditPage />} />
            <Route path="content/levels" element={<LevelManagementPage />} />
            <Route path="content/levels/:levelId/edit" element={<LevelEditPage />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;