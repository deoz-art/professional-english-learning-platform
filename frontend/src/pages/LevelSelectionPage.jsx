import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { levelAPI } from '../services/api';

export default function LevelSelectionPage() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await levelAPI.getStudentLevels();
      setLevels(response.data);
    } catch (err) {
      setError('Failed to load levels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelClick = (level) => {
    if (level.status === 'locked') {
      return;
    }
    navigate(`/quiz/${level.levelNumber}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#10b981';
      case 'unlocked':
        return '#667eea';
      case 'locked':
        return '#9ca3af';
      default:
        return '#9ca3af';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'unlocked':
        return '🔓';
      case 'locked':
        return '🔒';
      default:
        return '🔒';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', fontSize: '18px' }}>Loading levels...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h1 style={{ fontSize: '36px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>
              Welcome, {user?.username}! 🎓
            </h1>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)' }}>
              Choose a level to start learning
            </p>
          </div>
          <button onClick={logout} className="btn btn-secondary">
            Logout
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '24px' }}>
            {error}
          </div>
        )}

        <div className="grid grid-3">
          {levels.map((level) => (
            <div
              key={level._id}
              className="card"
              onClick={() => handleLevelClick(level)}
              style={{
                cursor: level.status === 'locked' ? 'not-allowed' : 'pointer',
                opacity: level.status === 'locked' ? 0.6 : 1,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                fontSize: '32px',
              }}>
                {getStatusIcon(level.status)}
              </div>

              <div style={{
                width: '100%',
                height: '200px',
                borderRadius: '8px',
                marginBottom: '16px',
                overflow: 'hidden',
              }}>
                <img
                  src={level.imageUrl}
                  alt={level.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '20px',
                background: getStatusColor(level.status),
                color: 'white',
                fontSize: '12px',
                fontWeight: '600',
                marginBottom: '12px',
              }}>
                Level {level.levelNumber}
              </div>

              <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
                {level.title}
              </h3>

              <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                Theme: {level.theme}
              </p>

              {level.highScore > 0 && (
                <div style={{
                  padding: '12px',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                  borderLeft: '4px solid #10b981',
                }}>
                  <p style={{ fontSize: '14px', color: '#065f46', fontWeight: '600' }}>
                    High Score: {level.highScore}%
                  </p>
                </div>
              )}

              {level.status === 'locked' && (
                <p style={{ fontSize: '14px', color: '#ef4444', marginTop: '12px', fontWeight: '600' }}>
                  Complete previous levels to unlock
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}