import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { adminAPI } from '../../services/api';
import KPICard from '../components/KPICard';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getDashboardStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '40px' }}>
        <p>Failed to load dashboard statistics.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '32px', color: '#1a1a1a' }}>
        Dashboard
      </h1>

      <div className="grid grid-4" style={{ marginBottom: '40px' }}>
        <KPICard
          title="Students"
          value={stats.kpis.totalUsers}
          color="#1a1a1a"
        />
        <KPICard
          title="Quizzes"
          value={stats.kpis.totalLevels}
          color="#1a1a1a"
        />
        <KPICard
          title="Avg Score"
          value={`${stats.kpis.avgScore}%`}
          color="#1a1a1a"
        />
        <KPICard
          title="Completion"
          value={`${stats.kpis.completionRate}%`}
          color="#1a1a1a"
        />
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px', color: '#1a1a1a' }}>
            Registrations (30 days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.registrationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="date" style={{ fontSize: '12px' }} stroke="#757575" />
              <YAxis style={{ fontSize: '12px' }} stroke="#757575" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="registrations" stroke="#1a1a1a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '24px', color: '#1a1a1a' }}>
            Performance by Level
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="level" style={{ fontSize: '12px' }} stroke="#757575" />
              <YAxis style={{ fontSize: '12px' }} stroke="#757575" />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#1a1a1a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}