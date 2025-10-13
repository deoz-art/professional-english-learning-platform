import React from 'react';

export default function KPICard({ title, value, icon, color = '#667eea' }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{
        fontSize: '48px',
        marginBottom: '16px',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '36px',
        fontWeight: '800',
        color: color,
        marginBottom: '8px',
      }}>
        {value}
      </h3>
      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        fontWeight: '600',
      }}>
        {title}
      </p>
    </div>
  );
}