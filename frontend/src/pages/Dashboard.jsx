import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { complaintsAPI } from '../services/api';
import { FiPlus, FiArrowRight, FiCheckCircle, FiClock, FiAlertCircle } from 'react-icons/fi';

const catLabel = (key) => ({
    water_supply: 'Water Supply', waste_management: 'Waste Management',
    road_infrastructure: 'Road & Infrastructure', health_services: 'Health Services',
    education_facility: 'Education Facility', parks_recreation: 'Parks & Recreation',
    fire_emergency: 'Fire & Emergency', sanitation_hygiene: 'Sanitation & Hygiene',
    encroachment: 'Encroachment'
})[key] || key;

export default function Dashboard() {
    const { user } = useAuth();
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        complaintsAPI.getMine().then(r => setComplaints(r.data.complaints || [])).catch(() => { }).finally(() => setLoading(false));
    }, []);

    const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);
    const counts = {
        total: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        inProgress: complaints.filter(c => c.status === 'in_progress').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    return (
        <div>
            <div className="page-header">
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <h1>👋 Welcome, {user?.name?.split(' ')[0]}!</h1>
                        <p>Track and manage all your submitted complaints here.</p>
                    </div>
                    <Link to="/report" className="btn btn-primary"><FiPlus /> Report New Issue</Link>
                </div>
            </div>

            <div className="container" style={{ padding: '32px 24px' }}>
                {/* Stats cards */}
                <div className="grid-4" style={{ marginBottom: 32 }}>
                    {[
                        { label: 'Total Reports', value: counts.total, icon: '📋', color: '#0984e3', bg: '#dbeafe' },
                        { label: 'Pending', value: counts.pending, icon: '⏳', color: '#f59e0b', bg: '#fef3c7' },
                        { label: 'In Progress', value: counts.inProgress, icon: '⚙️', color: '#8b5cf6', bg: '#ede9fe' },
                        { label: 'Resolved', value: counts.resolved, icon: '✅', color: '#10b981', bg: '#d1fae5' },
                    ].map(s => (
                        <div key={s.label} className="card" style={{ border: `2px solid ${s.color}20` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 8 }}>{s.label}</div>
                                    <div style={{ fontSize: 36, fontWeight: 900, color: s.color }}>{s.value}</div>
                                </div>
                                <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Profile card */}
                <div className="card" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                    <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#00b894,#0984e3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 26, fontWeight: 800 }}>
                        {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 20 }}>{user?.name}</div>
                        <div style={{ color: 'var(--text-light)', fontSize: 14 }}>{user?.email} · {user?.city}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: '#0984e3' }}>{user?.totalReports || counts.total}</div>
                            <div style={{ fontSize: 12, color: 'var(--gray)' }}>Reports Filed</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 800, color: '#10b981' }}>{user?.resolvedReports || counts.resolved}</div>
                            <div style={{ fontSize: 12, color: 'var(--gray)' }}>Resolved</div>
                        </div>
                    </div>
                    <div style={{ background: '#d1fae5', color: '#065f46', padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 700 }}>
                        🏆 Active Citizen
                    </div>
                </div>

                {/* Filter tabs */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                    {['all', 'pending', 'in_progress', 'resolved'].map(f => (
                        <button key={f} onClick={() => setFilter(f)}
                            style={{
                                padding: '8px 18px', borderRadius: 20, fontWeight: 600, fontSize: 14, transition: 'all 0.2s', border: 'none', cursor: 'pointer',
                                background: filter === f ? '#00b894' : 'white', color: filter === f ? 'white' : 'var(--text-light)',
                                boxShadow: filter === f ? '0 4px 12px rgba(0,184,148,0.3)' : '0 1px 4px rgba(0,0,0,0.06)'
                            }}>
                            {f === 'all' ? 'All' : f.replace('_', ' ')} {filter === f ? `(${f === 'all' ? counts.total : f === 'in_progress' ? counts.inProgress : counts[f]})` : ''}
                        </button>
                    ))}
                </div>

                {/* Complaints list */}
                {loading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 24px', background: 'white', borderRadius: 20, border: '2px dashed var(--border)' }}>
                        <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>No complaints found</h3>
                        <p style={{ color: 'var(--text-light)', marginBottom: 20 }}>You haven't submitted any issues yet. Help improve your city!</p>
                        <Link to="/report" className="btn btn-primary"><FiPlus /> Report Your First Issue</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filtered.map(c => (
                            <Link key={c._id} to={`/track/${c.trackingId}`}
                                style={{ display: 'flex', gap: 16, background: 'white', borderRadius: 16, padding: '18px 22px', border: '1px solid var(--border)', transition: 'all 0.2s', textDecoration: 'none', color: 'inherit', alignItems: 'center' }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = '#00b894'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                    {c.status === 'resolved' ? '✅' : c.status === 'in_progress' ? '⚙️' : c.status === 'rejected' ? '❌' : '⏳'}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                                        <span style={{ fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: 'var(--gray)', background: 'var(--bg)', padding: '2px 8px', borderRadius: 6 }}>{c.trackingId}</span>
                                        <span className={`badge badge-${c.status}`} style={{ fontSize: 11 }}>{c.status?.replace('_', ' ')}</span>
                                        <span className={`badge badge-${c.severity}`} style={{ fontSize: 11 }}>{c.severity}</span>
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                                    <div style={{ fontSize: 13, color: 'var(--gray)' }}>📍 {c.location?.address} · 📅 {new Date(c.createdAt).toLocaleDateString()}</div>
                                </div>
                                {c.aiAnalysis?.confidence && (
                                    <div style={{ textAlign: 'center', flexShrink: 0 }}>
                                        <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: 2 }}>AI</div>
                                        <div style={{ fontWeight: 700, color: '#0984e3', fontSize: 14 }}>{Math.round(c.aiAnalysis.confidence * 100)}%</div>
                                    </div>
                                )}
                                <FiArrowRight style={{ color: 'var(--gray-light)', flexShrink: 0 }} />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
