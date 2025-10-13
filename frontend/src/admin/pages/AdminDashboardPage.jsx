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
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '32px', color: '#111827' }}>
        Dashboard Overview
      </h1>

      {/* KPI Cards */}
      <div className="grid grid-4" style={{ marginBottom: '40px' }}>
        <KPICard
          title="Total Students"
          value={stats.kpis.totalUsers}
          icon="👥"
          color="#667eea"
        />
        <KPICard
          title="Active Quizzes"
          value={stats.kpis.totalLevels}
          icon="🎓"
          color="#10b981"
        />
        <KPICard
          title="Average Score"
          value={`${stats.kpis.avgScore}%`}
          icon="⭐"
          color="#f59e0b"
        />
        <KPICard
          title="Completion Rate"
          value={`${stats.kpis.completionRate}%`}
          icon="✅"
          color="#8b5cf6"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-2">
        {/* Registration Chart */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
            User Registrations (Last 30 Days)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.registrationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="registrations" stroke="#667eea" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Performance Chart */}
        <div className="card">
          <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px', color: '#111827' }}>
            Performance per Level
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="level" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgScore" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}