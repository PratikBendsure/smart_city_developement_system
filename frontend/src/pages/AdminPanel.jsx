import { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiSearch, FiRefreshCw, FiCheck, FiX, FiAlertTriangle, FiUsers, FiFileText, FiClock } from 'react-icons/fi';

const STATUSES = ['pending', 'in_progress', 'resolved', 'rejected', 'escalated'];
const CATEGORIES = [
    { key: '', label: 'All Categories' },
    { key: 'water_supply', label: 'Water Supply' },
    { key: 'waste_management', label: 'Waste Management' },
    { key: 'road_infrastructure', label: 'Road & Infrastructure' },
    { key: 'health_services', label: 'Health Services' },
    { key: 'education_facility', label: 'Education Facility' },
    { key: 'parks_recreation', label: 'Parks & Recreation' },
    { key: 'fire_emergency', label: 'Fire & Emergency' },
    { key: 'sanitation_hygiene', label: 'Sanitation & Hygiene' },
    { key: 'encroachment', label: 'Encroachment' },
];

function StatusModal({ complaint, onClose, onUpdate }) {
    const [status, setStatus] = useState(complaint.status);
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await adminAPI.updateStatus(complaint._id, { status, note });
            toast.success('Status updated successfully!');
            onUpdate();
            onClose();
        } catch { toast.error('Update failed'); } finally { setLoading(false); }
    };

    const statusColors = { pending: '#f59e0b', in_progress: '#3b82f6', resolved: '#10b981', rejected: '#ef4444', escalated: '#8b5cf6' };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div className="card animate-scale-in" style={{ maxWidth: 480, width: '100%', padding: 32 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                    <h3 style={{ fontWeight: 800, fontSize: 18 }}>Update Status</h3>
                    <button onClick={onClose} style={{ background: 'var(--bg)', borderRadius: 8, padding: 6, color: 'var(--text)', border: 'none', cursor: 'pointer' }}><FiX /></button>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-light)', marginBottom: 4 }}>Complaint</div>
                    <div style={{ fontWeight: 700 }}>{complaint.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray)', fontFamily: 'monospace' }}>{complaint.trackingId}</div>
                </div>
                <div className="form-group">
                    <label className="form-label">New Status</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {STATUSES.map(s => (
                            <button key={s} type="button" onClick={() => setStatus(s)}
                                style={{
                                    padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, border: '2px solid', cursor: 'pointer', transition: 'all 0.2s',
                                    borderColor: status === s ? statusColors[s] : 'var(--border)',
                                    background: status === s ? statusColors[s] + '15' : 'white',
                                    color: status === s ? statusColors[s] : 'var(--text-light)'
                                }}>
                                {s.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="form-group">
                    <label className="form-label">Note / Update Message</label>
                    <textarea className="form-input" rows={3} placeholder="Add a note about this status update..." value={note} onChange={e => setNote(e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleUpdate} disabled={loading}>
                        {loading ? 'Updating...' : '✓ Update Status'}
                    </button>
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminPanel() {
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const [filters, setFilters] = useState({ status: '', category: '', search: '', page: 1 });
    const [pagination, setPagination] = useState({ total: 0, pages: 1 });

    const load = async () => {
        setLoading(true);
        try {
            const [cRes, sRes] = await Promise.all([
                adminAPI.getComplaints({ ...filters, limit: 15 }),
                adminAPI.getStats()
            ]);
            setComplaints(cRes.data.complaints || []);
            setPagination({ total: cRes.data.total, pages: cRes.data.pages });
            setStats(sRes.data.stats);
        } catch (err) { toast.error('Failed to load data'); } finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [filters]);
    const setF = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }));

    const severityColor = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

    return (
        <div>
            <div style={{ background: 'linear-gradient(135deg,#0f1923,#1a2634)', color: 'white', padding: '40px 0' }}>
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4 }}>⚙️ Admin Dashboard</h1>
                            <p style={{ opacity: 0.7 }}>Manage all civic complaints and track resolution progress.</p>
                        </div>
                        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} onClick={load}>
                            <FiRefreshCw /> Refresh
                        </button>
                    </div>

                    {/* Admin stats row */}
                    {stats && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px,1fr))', gap: 14, marginTop: 28 }}>
                            {[
                                { l: 'Total', v: stats.total, icon: <FiFileText />, c: '#60a5fa' },
                                { l: 'Pending', v: stats.pending, icon: '⏳', c: '#fbbf24' },
                                { l: 'In Progress', v: stats.inProgress, icon: '⚙️', c: '#a78bfa' },
                                { l: 'Resolved', v: stats.resolved, icon: '✅', c: '#34d399' },
                                { l: 'Overdue', v: stats.overdue, icon: <FiAlertTriangle />, c: '#f87171' },
                                { l: 'Users', v: stats.totalUsers, icon: <FiUsers />, c: '#38bdf8' },
                            ].map(s => (
                                <div key={s.l} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px 18px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <div style={{ fontSize: 20, marginBottom: 6 }}>{typeof s.icon === 'string' ? s.icon : s.icon}</div>
                                    <div style={{ fontSize: 28, fontWeight: 900, color: s.c }}>{s.v}</div>
                                    <div style={{ fontSize: 12, opacity: 0.6, marginTop: 3 }}>{s.l}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="container" style={{ padding: '32px 24px' }}>
                {/* Filters */}
                <div className="card" style={{ marginBottom: 24, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                            <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                            <input className="form-input" placeholder="Search by ID, title, location..." style={{ paddingLeft: 40 }}
                                value={filters.search} onChange={e => setF('search', e.target.value)} />
                        </div>
                        <select className="form-input" style={{ width: 'auto', minWidth: 160 }} value={filters.status} onChange={e => setF('status', e.target.value)}>
                            <option value="">All Status</option>
                            {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                        <select className="form-input" style={{ width: 'auto', minWidth: 200 }} value={filters.category} onChange={e => setF('category', e.target.value)}>
                            {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontWeight: 700, fontSize: 16 }}>Complaints ({pagination.total})</h3>
                    </div>

                    {loading ? (
                        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 64, borderRadius: 10 }} />)}
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Tracking ID</th>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Location</th>
                                        <th>Severity</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {complaints.length === 0 ? (
                                        <tr><td colSpan={8} style={{ textAlign: 'center', padding: 48, color: 'var(--gray)' }}>No complaints found</td></tr>
                                    ) : complaints.map(c => (
                                        <tr key={c._id}>
                                            <td><span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, background: 'var(--bg)', padding: '4px 8px', borderRadius: 6 }}>{c.trackingId}</span></td>
                                            <td style={{ maxWidth: 200 }}>
                                                <div style={{ fontWeight: 600, fontSize: 14, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</div>
                                                {c.reporterName && <div style={{ fontSize: 12, color: 'var(--gray)' }}>by {c.reporterName}</div>}
                                            </td>
                                            <td><span style={{ fontSize: 13 }}>{CATEGORIES.find(x => x.key === c.category)?.label || c.category}</span></td>
                                            <td style={{ fontSize: 13, color: 'var(--text-light)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>📍 {c.location?.address}</td>
                                            <td>
                                                <span style={{ fontWeight: 700, fontSize: 13, color: severityColor[c.severity] || '#94a3b8', textTransform: 'capitalize' }}>
                                                    ● {c.severity}
                                                </span>
                                            </td>
                                            <td><span className={`badge badge-${c.status}`}>{c.status?.replace('_', ' ')}</span></td>
                                            <td style={{ fontSize: 13, color: 'var(--gray)', whiteSpace: 'nowrap' }}>{new Date(c.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <button className="btn btn-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)', whiteSpace: 'nowrap' }} onClick={() => setSelected(c)}>
                                                    Update →
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8, justifyContent: 'center' }}>
                            {Array.from({ length: pagination.pages }, (_, i) => (
                                <button key={i} onClick={() => setFilters(f => ({ ...f, page: i + 1 }))}
                                    style={{
                                        width: 36, height: 36, borderRadius: 8, border: '2px solid', cursor: 'pointer', fontWeight: 700, fontSize: 14,
                                        borderColor: filters.page === i + 1 ? '#00b894' : 'var(--border)',
                                        background: filters.page === i + 1 ? '#00b894' : 'white',
                                        color: filters.page === i + 1 ? 'white' : 'var(--text)'
                                    }}>
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {selected && <StatusModal complaint={selected} onClose={() => setSelected(null)} onUpdate={load} />}
        </div>
    );
}
