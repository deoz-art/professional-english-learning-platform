import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(isAdmin() ? '/admin/dashboard' : '/levels', { replace: true });
    }
  }, [user, navigate, isAdmin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    const result = await register(formData);

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
            Create Account
          </h1>
          <p style={{ color: '#999', fontSize: '13px' }}>
            Join the learning platform
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
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Min. 3 characters"
              required
              disabled={loading}
              minLength={3}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 6 characters"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div style={{ marginTop: '32px', textAlign: 'center', paddingTop: '32px', borderTop: '1px solid #f0f0f0' }}>
          <p style={{ fontSize: '13px', color: '#999' }}>
            Already have an account?{' '}
            <a
              href="/login"
              style={{ color: '#1a1a1a', fontWeight: '500', textDecoration: 'none', borderBottom: '1px solid #1a1a1a' }}
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}