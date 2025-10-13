import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navLinkStyle = {
    display: 'block',
    padding: '16px 24px',
    color: 'rgba(255,255,255,0.8)',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '500',
    borderRadius: '8px',
    marginBottom: '8px',
    transition: 'all 0.2s ease',
  };

  const activeStyle = {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
  };

  return (
    <div style={{
      width: '280px',
      background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
      padding: '32px 24px',
      color: 'white',
    }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '4px' }}>
          Admin Panel
        </h2>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>
          {user?.username}
        </p>
      </div>

      <nav>
        <NavLink
          to="/admin/dashboard"
          style={({ isActive }) => ({
            ...navLinkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          📊 Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          style={({ isActive }) => ({
            ...navLinkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          👥 User Management
        </NavLink>

        <NavLink
          to="/admin/content/levels"
          style={({ isActive }) => ({
            ...navLinkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          📝 Content Management
        </NavLink>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', margin: '24px 0' }}></div>

        <NavLink
          to="/levels"
          style={navLinkStyle}
        >
          🎓 Student View
        </NavLink>

        <button
          onClick={logout}
          style={{
            ...navLinkStyle,
            width: '100%',
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          🚪 Logout
        </button>
      </nav>
    </div>
  );
}