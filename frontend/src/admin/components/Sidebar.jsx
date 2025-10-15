import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navLinkStyle = {
    display: 'block',
    padding: '12px 24px',
    color: '#666',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '500',
    borderRadius: '0',
    marginBottom: '4px',
    transition: 'all 0.2s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const activeStyle = {
    background: '#1a1a1a',
    color: 'white',
  };

  return (
    <div style={{
      width: '260px',
      background: 'white',
      padding: '40px 0',
      color: '#1a1a1a',
      borderRight: '1px solid #e8e8e8',
    }}>
      <div style={{ marginBottom: '64px', padding: '0 24px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '300', marginBottom: '4px', letterSpacing: '0.5px' }}>
          Admin Panel
        </h2>
        <p style={{ fontSize: '12px', color: '#999' }}>
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
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          style={({ isActive }) => ({
            ...navLinkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          Users
        </NavLink>

        <NavLink
          to="/admin/content/levels"
          style={({ isActive }) => ({
            ...navLinkStyle,
            ...(isActive ? activeStyle : {}),
          })}
        >
          Content
        </NavLink>

        <div style={{ borderTop: '1px solid #e8e8e8', margin: '24px 24px' }}></div>

        <NavLink
          to="/levels"
          style={navLinkStyle}
        >
          Student View
        </NavLink>

        <button
          onClick={logout}
          style={{
            ...navLinkStyle,
            width: '100%',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          Sign Out
        </button>
      </nav>
    </div>
  );
}