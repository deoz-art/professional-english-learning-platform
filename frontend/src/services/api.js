import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Admin API
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard-stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (userId, userData) => api.put(`/admin/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  getUserProgress: (userId) => api.get(`/admin/progress/${userId}`),
};

// Level API
export const levelAPI = {
  getAllLevels: () => api.get('/levels'),
  getStudentLevels: () => api.get('/levels/student'),
  getLevelQuestions: (levelNumber) => api.get(`/levels/${levelNumber}/questions/student`),
  checkAnswer: (data) => api.post('/levels/quiz/check-answer', data),
  createLevel: (levelData) => api.post('/levels', levelData),
  updateLevel: (levelId, levelData) => api.put(`/levels/${levelId}`, levelData),
  deleteLevel: (levelId) => api.delete(`/levels/${levelId}`),
  createQuestion: (levelId, questionData) => api.post(`/levels/${levelId}/questions`, questionData),
  updateQuestion: (questionId, questionData) => api.put(`/levels/questions/${questionId}`, questionData),
  deleteQuestion: (questionId) => api.delete(`/levels/questions/${questionId}`),
};

// Progress API
export const progressAPI = {
  getProgress: () => api.get('/progress'),
  completeLevel: (data) => api.post('/progress/complete-level', data),
};

export default api;