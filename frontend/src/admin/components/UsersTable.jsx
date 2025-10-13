import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UsersTable({ users, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Date Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ fontWeight: '600' }}>{user.username}</td>
              <td>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: '600',
                  background: user.role === 'admin' ? '#fef3c7' : '#dbeafe',
                  color: user.role === 'admin' ? '#92400e' : '#1e40af',
                }}>
                  {user.role}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => navigate(`/admin/users/${user._id}/edit`)}
                    className="btn btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(user)}
                    className="btn btn-danger"
                    style={{ padding: '8px 16px', fontSize: '14px' }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}