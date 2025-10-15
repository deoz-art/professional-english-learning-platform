import React from 'react';

export default function KPICard({ title, value, icon, color = '#1a1a1a' }) {
  return (
    <div className="card" style={{ textAlign: 'left', padding: '32px' }}>
      <p style={{
        fontSize: '11px',
        color: '#999',
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        fontWeight: '500',
      }}>
        {title}
      </p>
      <h3 style={{
        fontSize: '40px',
        fontWeight: '300',
        color: color,
        marginBottom: '0',
        letterSpacing: '-1px',
      }}>
        {value}
      </h3>
    </div>
  );
}