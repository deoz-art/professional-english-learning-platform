import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import UsersTable from '../components/UsersTable';
import ConfirmationModal from '../../components/ConfirmationModal';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, user: null });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers({ search });
      setUsers(response.data.users);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (user) => {
    setDeleteModal({ isOpen: true, user });
  };

  const confirmDelete = async () => {
    try {
      await adminAPI.deleteUser(deleteModal.user._id);
      setDeleteModal({ isOpen: false, user: null });
      fetchUsers();
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user');
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
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#111827' }}>
          User Management
        </h1>
        <button
          onClick={() => navigate('/admin/users/new')}
          className="btn btn-primary"
        >
          ➕ Add New User
        </button>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '12px',
            border: '2px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '16px',
          }}
        />
      </div>

      <UsersTable users={users} onDelete={handleDelete} />

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, user: null })}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete user "${deleteModal.user?.username}"? This action cannot be undone.`}
        confirmText="Delete"
      />
    </div>
  );
}