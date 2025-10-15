import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate(isAdmin() ? '/admin/dashboard' : '/levels');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: '#fafafa',
    }}>
      <div style={{
        maxWidth: '800px',
        width: '100%',
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '80px' }}>
          <h1 style={{ 
            fontSize: '72px', 
            fontWeight: '300', 
            color: '#1a1a1a', 
            marginBottom: '16px',
            letterSpacing: '-2px',
          }}>
            SAKA
          </h1>
          <p style={{ 
            color: '#666', 
            fontSize: '16px',
            maxWidth: '500px',
            margin: '0 auto',
            lineHeight: '1.8',
            fontWeight: '300',
          }}>
            Smart Application for Kid's Speaking Activity
          </p>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: '80px' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px', fontWeight: '300' }}>01</div>
              <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Levels
              </h4>
              <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
                Progressive learning system
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px', fontWeight: '300' }}>02</div>
              <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Speaking
              </h4>
              <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
                Interactive voice practice
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px', fontWeight: '300' }}>03</div>
              <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tracking
              </h4>
              <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
                Real-time progress monitor
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '16px', fontWeight: '300' }}>04</div>
              <h4 style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Dashboard
              </h4>
              <p style={{ fontSize: '13px', color: '#999', lineHeight: '1.6' }}>
                Content management system
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary btn-large"
            style={{ 
              fontSize: '14px',
              padding: '16px 48px',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {user ? 'Continue' : 'Get Started'}
          </button>
          {!user && (
            <p style={{ marginTop: '24px', fontSize: '13px', color: '#999' }}>
              Already have an account?{' '}
              <a
                href="/login"
                style={{ color: '#1a1a1a', fontWeight: '500', textDecoration: 'none', borderBottom: '1px solid #1a1a1a' }}
              >
                Sign in
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}