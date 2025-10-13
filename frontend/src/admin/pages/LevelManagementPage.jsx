import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { levelAPI } from '../../services/api';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function LevelManagementPage() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, level: null });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const response = await levelAPI.getAllLevels();
      setLevels(response.data);
    } catch (err) {
      console.error('Failed to fetch levels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (level) => {
    setDeleteModal({ isOpen: true, level });
  };

  const confirmDelete = async () => {
    try {
      await levelAPI.deleteLevel(deleteModal.level._id);
      setDeleteModal({ isOpen: false, level: null });
      fetchLevels();
    } catch (err) {
      console.error('Failed to delete level:', err);
      alert('Failed to delete level');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px', color: '#111827' }}>
        Content Management
      </h1>

      <div className="grid grid-3">
        {levels.map((level) => (
          <div key={level._id} className="card">
            <div style={{
              width: '100%',
              height: '150px',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '16px',
            }}>
              <img
                src={level.imageUrl}
                alt={level.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            <div style={{
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '20px',
              background: '#667eea',
              color: 'white',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '12px',
            }}>
              Level {level.levelNumber}
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: '#111827' }}>
              {level.title}
            </h3>

            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '16px' }}>
              {level.questions.length} questions
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => navigate(`/admin/content/levels/${level._id}/edit`)}
                className="btn btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '14px' }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(level)}
                className="btn btn-danger"
                style={{ padding: '10px', fontSize: '14px' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, level: null })}
        onConfirm={confirmDelete}
        title="Delete Level"
        message={`Are you sure you want to delete "${deleteModal.level?.title}"? This will also delete all associated questions.`}
        confirmText="Delete"
      />
    </div>
  );
}