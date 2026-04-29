import { useState, useEffect } from 'react';
import { complaintsAPI } from '../services/api';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0984e3', '#00b894', '#fdcb6e', '#e17055', '#a29bfe', '#fd79a8', '#74b9ff', '#55efc4', '#636e72'];
const CAT_LABELS = {
    water_supply: 'Water', waste_management: 'Waste', road_infrastructure: 'Roads',
    health_services: 'Health', education_facility: 'Education', parks_recreation: 'Parks',
    fire_emergency: 'Fire', sanitation_hygiene: 'Sanitation', encroachment: 'Encroachment'
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '10px 14px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 13 }}>{label}</div>
                {payload.map(p => <div key={p.name} style={{ color: p.color, fontSize: 13 }}>{p.name}: <strong>{p.value}</strong></div>)}
            </div>
        );
    }
    return null;
};

export default function Statistics() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        complaintsAPI.getStats().then(r => { setStats(r.data.stats); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
            <div style={{ width: 48, height: 48, border: '4px solid var(--border)', borderTop: '4px solid #00b894', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: 'var(--text-light)' }}>Loading statistics...</p>
        </div>
    );

    const categoryData = stats?.byCategory?.map(b => ({
        name: CAT_LABELS[b._id] || b._id,
        count: b.count
    })) || [];

    const statusData = [
        { name: 'Pending', value: stats?.pending || 0, color: '#fbbf24' },
        { name: 'In Progress', value: stats?.inProgress || 0, color: '#60a5fa' },
        { name: 'Resolved', value: stats?.resolved || 0, color: '#34d399' },
        { name: 'Rejected', value: stats?.rejected || 0, color: '#f87171' },
    ].filter(d => d.value > 0);

    const trendData = stats?.last7Days?.map(d => ({
        date: new Date(d._id).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
        reports: d.count
    })) || [];

    return (
        <div>
            <div className="page-header">
                <div className="container">
                    <h1>📊 City Statistics Dashboard</h1>
                    <p>Real-time analytics on civic issue reports across the city.</p>
                </div>
            </div>

            <div className="container" style={{ padding: '40px 24px' }}>
                {/* Top KPI Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 20, marginBottom: 36 }}>
                    {[
                        { label: 'Total Reports', value: stats?.total || 0, icon: '📋', color: '#0984e3', bg: '#dbeafe', suffix: '' },
                        { label: 'Issues Resolved', value: stats?.resolved || 0, icon: '✅', color: '#10b981', bg: '#d1fae5', suffix: '' },
                        { label: 'Resolution Rate', value: `${stats?.resolutionRate || 0}`, icon: '📈', color: '#8b5cf6', bg: '#ede9fe', suffix: '%' },
                        { label: 'Avg Response', value: `${stats?.avgResolutionHours || '—'}`, icon: '⚡', color: '#f59e0b', bg: '#fef3c7', suffix: 'hrs' },
                        { label: 'Pending', value: stats?.pending || 0, icon: '⏳', color: '#ef4444', bg: '#fee2e2', suffix: '' },
                    ].map(s => (
                        <div key={s.label} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                            <div style={{ width: 52, height: 52, background: s.bg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 24 }}>{s.icon}</div>
                            <div style={{ fontSize: 30, fontWeight: 900, color: s.color }}>{s.value}<span style={{ fontSize: 18 }}>{s.suffix}</span></div>
                            <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>{s.label}</div>
                        </div>
                    ))}
                </div>

                {/* Charts grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
                    {/* Bar chart - by category */}
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: 17 }}>Reports by Category</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: 13, marginBottom: 20 }}>Total complaints filed per issue category</p>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={categoryData} margin={{ top: 0, right: 10, left: -10, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" interval={0} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Reports" radius={[6, 6, 0, 0]}>
                                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie chart - status */}
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: 17 }}>Status Breakdown</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: 13, marginBottom: 20 }}>Current status of all reports</p>
                        <ResponsiveContainer width="100%" height={180}>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                                    {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {statusData.map(s => (
                                <div key={s.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 12, height: 12, borderRadius: 3, background: s.color }} />
                                        <span>{s.name}</span>
                                    </div>
                                    <strong>{s.value}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Line chart - trend */}
                {trendData.length > 0 && (
                    <div className="card" style={{ marginBottom: 24 }}>
                        <h3 style={{ fontWeight: 700, marginBottom: 4, fontSize: 17 }}>7-Day Reporting Trend</h3>
                        <p style={{ color: 'var(--text-light)', fontSize: 13, marginBottom: 20 }}>Number of new civic issues reported per day</p>
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f4f8" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="reports" name="Reports" stroke="#00b894" strokeWidth={3} dot={{ r: 5, fill: '#00b894' }} activeDot={{ r: 7 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Category breakdown table */}
                {categoryData.length > 0 && (
                    <div className="card">
                        <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 17 }}>Category-wise Summary</h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Category</th>
                                        <th>Total Reports</th>
                                        <th>Share</th>
                                        <th>Progress</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {categoryData.sort((a, b) => b.count - a.count).map((c, i) => (
                                        <tr key={c.name}>
                                            <td style={{ fontWeight: 700, color: 'var(--gray)' }}>{i + 1}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS[i % COLORS.length] }} />
                                                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                                                </div>
                                            </td>
                                            <td><strong>{c.count}</strong></td>
                                            <td style={{ color: 'var(--text-light)' }}>{stats?.total ? Math.round(c.count / stats.total * 100) : 0}%</td>
                                            <td style={{ minWidth: 160 }}>
                                                <div style={{ height: 8, background: 'var(--bg)', borderRadius: 4, overflow: 'hidden' }}>
                                                    <div style={{ height: '100%', background: COLORS[i % COLORS.length], borderRadius: 4, width: `${stats?.total ? Math.round(c.count / stats.total * 100) : 0}%`, transition: 'width 1s ease' }} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
