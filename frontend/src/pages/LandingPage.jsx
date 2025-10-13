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
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '64px 48px',
        maxWidth: '900px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ 
            fontSize: '64px', 
            marginBottom: '16px',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'
          }}>
            🎓📱
          </div>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '800', 
            color: '#111827', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            SAKA
          </h1>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: '#374151',
            marginBottom: '12px'
          }}>
            Smart Application for Kid's Speaking Activity
          </h2>
          <p style={{ 
            color: '#6b7280', 
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Platform pembelajaran bahasa Inggris interaktif yang dirancang khusus untuk meningkatkan kemampuan berbicara anak-anak dengan cara yang menyenangkan dan efektif.
          </p>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: '48px' }}>
          <h3 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            ✨ Fitur Utama
          </h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '24px'
          }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎯</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                Level Bertingkat
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Sistem pembelajaran dengan level yang disesuaikan dengan kemampuan anak
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎤</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                Latihan Speaking
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Fokus pada peningkatan kemampuan berbicara dengan latihan interaktif
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>📊</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                Tracking Progress
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Pantau perkembangan belajar anak secara real-time
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎮</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                Gamifikasi
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Belajar sambil bermain dengan sistem poin dan achievement
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>👨‍🏫</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                Admin Dashboard
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Panel admin untuk mengelola konten dan monitoring siswa
              </p>
            </div>

            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌟</div>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px', color: '#111827' }}>
                User-Friendly
              </h4>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>
                Interface yang mudah digunakan dan ramah untuk anak-anak
              </p>
            </div>
          </div>
        </div>

        {/* Target Audience */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: '#111827',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            👥 Untuk Siapa SAKA?
          </h3>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            textAlign: 'center'
          }}>
            <div>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👶</div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>Anak-anak</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Usia 6-12 tahun</p>
            </div>
            <div>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>👪</div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>Orang Tua</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Monitoring progress</p>
            </div>
            <div>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏫</div>
              <p style={{ fontSize: '16px', fontWeight: '600', color: '#374151' }}>Sekolah</p>
              <p style={{ fontSize: '14px', color: '#6b7280' }}>Pembelajaran mandiri</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary btn-large"
            style={{ 
              fontSize: '20px',
              padding: '20px 48px',
              boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
            }}
          >
            {user ? '🚀 Lanjutkan Belajar' : '🎯 Mulai Sekarang'}
          </button>
          {!user && (
            <p style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
              Sudah punya akun?{' '}
              <a
                href="/login"
                style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}
              >
                Login di sini
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}