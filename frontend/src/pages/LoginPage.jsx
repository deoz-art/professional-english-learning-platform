import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(isAdmin() ? '/admin/dashboard' : '/levels', { replace: true });
    }
  }, [user, navigate, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);

    if (result.success) {
      // Navigation handled by useEffect
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: '#fafafa',
    }}>
      <div style={{
        background: 'white',
        border: '1px solid #e8e8e8',
        padding: '64px 48px',
        maxWidth: '420px',
        width: '100%',
      }}>
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: '300', color: '#1a1a1a', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            Sign In
          </h1>
          <p style={{ color: '#999', fontSize: '13px' }}>
            Welcome back
          </p>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '32px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-large"
            style={{ width: '100%', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', paddingTop: '32px', borderTop: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: '13px', color: '#999' }}>
            Don't have an account?{' '}
            <a
              href="/register"
              style={{ color: '#1a1a1a', fontWeight: '500', textDecoration: 'none', borderBottom: '1px solid #1a1a1a' }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}