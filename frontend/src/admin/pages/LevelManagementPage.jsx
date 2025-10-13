import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { levelAPI } from '../../services/api';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function LevelManagementPage() {
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, level: null });
  const [createModal, setCreateModal] = useState(false);
  const [newLevel, setNewLevel] = useState({
    levelNumber: '',
    title: '',
    theme: '',
    imageUrl: ''
  });
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

  const handleCreateLevel = async (e) => {
    e.preventDefault();
    try {
      await levelAPI.createLevel({
        levelNumber: Number(newLevel.levelNumber),
        title: newLevel.title,
        theme: newLevel.theme,
        imageUrl: newLevel.imageUrl
      });
      setCreateModal(false);
      setNewLevel({
        levelNumber: '',
        title: '',
        theme: '',
        imageUrl: ''
      });
      fetchLevels();
    } catch (err) {
      console.error('Failed to create level:', err);
      alert(err.response?.data?.message || 'Failed to create level');
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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '32px' 
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: 0, color: '#111827' }}>
          Content Management
        </h1>
        <button
          onClick={() => setCreateModal(true)}
          className="btn btn-primary"
          style={{ padding: '12px 24px', fontSize: '16px' }}
        >
          ➕ Create New Level
        </button>
      </div>
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

        {/* Create Level Modal */}
        {createModal && (
          <div className="modal-overlay" onClick={() => setCreateModal(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '600px' }}
            >
              <h3 className="modal-header">Create New Level</h3>
              <form onSubmit={handleCreateLevel}>
                <div className="input-group">
                  <label>Level Number</label>
                  <input
                    type="number"
                    value={newLevel.levelNumber}
                    onChange={(e) => setNewLevel({ ...newLevel, levelNumber: e.target.value })}
                    min="1"
                    required
                    placeholder="Enter level number (e.g., 4)"
                  />
                </div>

                <div className="input-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={newLevel.title}
                    onChange={(e) => setNewLevel({ ...newLevel, title: e.target.value })}
                    required
                    placeholder="Enter level title (e.g., Present Tense)"
                  />
                </div>

                <div className="input-group">
                  <label>Theme</label>
                  <input
                    type="text"
                    value={newLevel.theme}
                    onChange={(e) => setNewLevel({ ...newLevel, theme: e.target.value })}
                    required
                    placeholder="Enter theme (e.g., Grammar basics)"
                  />
                </div>

                <div className="input-group">
                  <label>Image URL</label>
                  <input
                    type="url"
                    value={newLevel.imageUrl}
                    onChange={(e) => setNewLevel({ ...newLevel, imageUrl: e.target.value })}
                    required
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={() => {
                      setCreateModal(false);
                      setNewLevel({
                        levelNumber: '',
                        title: '',
                        theme: '',
                        imageUrl: ''
                      });
                    }} 
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Level
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
  );
}