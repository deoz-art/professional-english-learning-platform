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
        return '#1a1a1a';
      case 'unlocked':
        return '#757575';
      case 'locked':
        return '#e0e0e0';
      default:
        return '#e0e0e0';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'unlocked':
        return 'Available';
      case 'locked':
        return 'Locked';
      default:
        return 'Locked';
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', fontSize: '14px', color: '#757575' }}>Loading levels...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', background: '#ffffff' }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid #e0e0e0',
          flexWrap: 'wrap',
          gap: '16px',
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>
              {user?.username}
            </h1>
            <p style={{ fontSize: '14px', color: '#757575' }}>
              Select a level to continue
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
                opacity: level.status === 'locked' ? 0.5 : 1,
                position: 'relative',
              }}
            >
              <div style={{
                width: '100%',
                height: '180px',
                borderRadius: '2px',
                marginBottom: '16px',
                overflow: 'hidden',
                border: '1px solid #e0e0e0',
              }}>
                <img
                  src={level.imageUrl}
                  alt={level.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: level.status === 'locked' ? 'grayscale(100%)' : 'none',
                  }}
                />
              </div>

              <div style={{
                display: 'inline-block',
                padding: '4px 10px',
                borderRadius: '2px',
                background: getStatusColor(level.status),
                color: level.status === 'locked' ? '#757575' : '#ffffff',
                fontSize: '11px',
                fontWeight: '500',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                Level {level.levelNumber}
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '6px', color: '#1a1a1a' }}>
                {level.title}
              </h3>

              <p style={{ fontSize: '13px', color: '#757575', marginBottom: '12px' }}>
                {level.theme}
              </p>

              {level.highScore > 0 && (
                <div style={{
                  padding: '8px',
                  background: '#fafafa',
                  borderRadius: '2px',
                  border: '1px solid #e0e0e0',
                  marginTop: '12px',
                }}>
                  <p style={{ fontSize: '12px', color: '#1a1a1a', fontWeight: '500' }}>
                    Best: {level.highScore}%
                  </p>
                </div>
              )}

              {level.status === 'locked' && (
                <p style={{ fontSize: '12px', color: '#757575', marginTop: '12px' }}>
                  Complete previous levels
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}