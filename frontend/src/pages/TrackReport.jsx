import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { complaintsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiSearch, FiClock, FiMapPin, FiCheck, FiX, FiAlertCircle, FiZap } from 'react-icons/fi';

const STATUS_STEPS = ['pending', 'in_progress', 'resolved'];

function Countdown({ target }) {
    const [diff, setDiff] = useState(new Date(target) - new Date());
    useEffect(() => {
        const t = setInterval(() => setDiff(new Date(target) - new Date()), 1000);
        return () => clearInterval(t);
    }, [target]);

    if (diff <= 0) return <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠️ Overdue</span>;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    return <span style={{ fontWeight: 700, color: h < 4 ? '#ef4444' : '#f59e0b' }}>{h}h {m}m remaining</span>;
}

export default function TrackReport() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const [trackingId, setTrackingId] = useState(id || '');
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => { if (id) fetchComplaint(id); }, [id]);

    const fetchComplaint = async (tid) => {
        if (!tid?.trim()) return;
        setLoading(true); setError('');
        try {
            const res = await complaintsAPI.track(tid.toUpperCase());
            setComplaint(res.data.complaint);
        } catch (err) {
            setError(err.response?.data?.message || 'Complaint not found');
            setComplaint(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => { e.preventDefault(); fetchComplaint(trackingId); navigate(`/track/${trackingId}`); };

    const statusIndex = complaint ? STATUS_STEPS.indexOf(complaint.status) : -1;

    const catLabel = (key) => ({
        water_supply: 'Water Supply', waste_management: 'Waste Management',
        road_infrastructure: 'Road & Infrastructure', health_services: 'Health Services',
        education_facility: 'Education Facility', parks_recreation: 'Parks & Recreation',
        fire_emergency: 'Fire & Emergency', sanitation_hygiene: 'Sanitation & Hygiene',
        encroachment: 'Encroachment'
    })[key] || key;

    return (
        <div>
            <div className="page-header">
                <div className="container">
                    <h1>🔍 {t('track_btn')}</h1>
                    <p>Enter your complaint tracking ID to see real-time status updates.</p>
                </div>
            </div>

            <div className="container" style={{ padding: '40px 24px', maxWidth: 700 }}>
                {/* Search */}
                <form onSubmit={handleSearch}>
                    <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
                        <input className="form-input" placeholder={t('track_placeholder')} value={trackingId}
                            onChange={e => setTrackingId(e.target.value)} style={{ flex: 1, fontSize: 16, fontFamily: 'monospace' }} />
                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ whiteSpace: 'nowrap' }}>
                            <FiSearch /> {loading ? 'Searching...' : t('track_submit')}
                        </button>
                    </div>
                </form>

                {error && (
                    <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 14, padding: '20px 24px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: 12 }}>
                        <FiX size={20} /> {error}
                    </div>
                )}

                {complaint && (
                    <div className="animate-fade-in">
                        {/* Header */}
                        <div style={{ background: 'linear-gradient(135deg,#0f1923,#1a2634)', borderRadius: 20, padding: 28, color: 'white', marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                                <div>
                                    <div style={{ fontSize: 12, opacity: 0.5, marginBottom: 4 }}>TRACKING ID</div>
                                    <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: 3, color: '#00b894' }}>{complaint.trackingId}</div>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <span className={`badge badge-${complaint.status}`} style={{ fontSize: 13, padding: '6px 14px' }}>
                                        {complaint.status?.replace('_', ' ')}
                                    </span>
                                    <span className={`badge badge-${complaint.severity}`} style={{ fontSize: 13, padding: '6px 14px' }}>
                                        {complaint.severity} severity
                                    </span>
                                </div>
                            </div>
                            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{complaint.title}</h2>
                            <div style={{ display: 'flex', gap: 20, fontSize: 14, opacity: 0.75, flexWrap: 'wrap' }}>
                                <span>📂 {catLabel(complaint.category)}</span>
                                <span><FiMapPin size={13} style={{ verticalAlign: 'middle' }} /> {complaint.location?.address}</span>
                                <span><FiClock size={13} style={{ verticalAlign: 'middle' }} /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Countdown */}
                        {complaint.status !== 'resolved' && complaint.status !== 'rejected' && (
                            <div style={{ background: 'white', borderRadius: 14, padding: '16px 20px', marginBottom: 24, border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-light)', fontSize: 14 }}>
                                    <FiClock /> 24-Hour Target Resolution:
                                </div>
                                <Countdown target={complaint.targetResolutionAt} />
                            </div>
                        )}

                        {/* Status Timeline */}
                        <div className="card" style={{ marginBottom: 24 }}>
                            <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: 16 }}>Status Timeline</h3>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
                                {STATUS_STEPS.map((step, i) => (
                                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                            <div style={{
                                                width: 40, height: 40, borderRadius: '50%',
                                                background: i <= statusIndex ? '#00b894' : (complaint.status === 'rejected' ? '#ef4444' : '#e2e8f0'),
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                                                border: i === statusIndex ? '3px solid #00b894' : 'none',
                                                boxShadow: i === statusIndex ? '0 0 0 6px rgba(0,184,148,0.15)' : 'none'
                                            }}>
                                                {i < statusIndex ? <FiCheck size={18} /> : i === statusIndex ? <span style={{ fontWeight: 800, fontSize: 13 }}>●</span> : <span style={{ color: '#94a3b8', fontSize: 13 }}>○</span>}
                                            </div>
                                            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, textTransform: 'capitalize', color: i <= statusIndex ? 'var(--text)' : 'var(--gray-light)' }}>
                                                {step.replace('_', ' ')}
                                            </div>
                                        </div>
                                        {i < STATUS_STEPS.length - 1 && (
                                            <div style={{ flex: 1, height: 3, background: i < statusIndex ? '#00b894' : '#e2e8f0', margin: '0 4px', borderRadius: 2 }} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* History */}
                            {complaint.statusHistory?.length > 0 && (
                                <div>
                                    {complaint.statusHistory.map((h, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 14, padding: '12px 0', borderBottom: i < complaint.statusHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                            <div style={{ width: 32, height: 32, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <FiCheck size={14} color="#10b981" />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 600, fontSize: 14, textTransform: 'capitalize' }}>{h.status?.replace('_', ' ')}</span>
                                                    <span style={{ fontSize: 12, color: 'var(--gray)' }}>{new Date(h.timestamp).toLocaleString()}</span>
                                                </div>
                                                {h.note && <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 3 }}>{h.note}</div>}
                                                {h.updatedBy && <div style={{ fontSize: 12, color: 'var(--gray)', marginTop: 2 }}>by {h.updatedBy}</div>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* AI Analysis */}
                        {complaint.aiAnalysis && (
                            <div className="card" style={{ marginBottom: 24 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                    <FiZap color="#00b894" />
                                    <h3 style={{ fontWeight: 700, fontSize: 16 }}>AI Analysis Results</h3>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                                    {[
                                        { label: 'Confidence', value: `${Math.round((complaint.aiAnalysis.confidence || 0) * 100)}%` },
                                        { label: 'Severity', value: complaint.aiAnalysis.severity },
                                        { label: 'Method', value: complaint.aiAnalysis.method?.replace('_', ' ') },
                                    ].map(item => (
                                        <div key={item.label} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px', textAlign: 'center' }}>
                                            <div style={{ fontSize: 11, color: 'var(--gray)', marginBottom: 4 }}>{item.label}</div>
                                            <div style={{ fontWeight: 700, fontSize: 15, textTransform: 'capitalize' }}>{item.value}</div>
                                        </div>
                                    ))}
                                </div>
                                {complaint.aiAnalysis.description && (
                                    <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 14, lineHeight: 1.7 }}>{complaint.aiAnalysis.description}</p>
                                )}
                            </div>
                        )}

                        {/* Resolution */}
                        {complaint.status === 'resolved' && (
                            <div style={{ background: '#d1fae5', border: '1px solid #a7f3d0', borderRadius: 14, padding: '20px 24px', color: '#065f46' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                    <FiCheck size={20} />
                                    <strong style={{ fontSize: 16 }}>Issue Resolved ✓</strong>
                                </div>
                                <div style={{ fontSize: 14 }}>{complaint.resolutionNote || 'This issue has been resolved by the municipal team.'}</div>
                                {complaint.resolvedAt && (
                                    <div style={{ fontSize: 12, marginTop: 8, opacity: 0.8 }}>
                                        Resolved on {new Date(complaint.resolvedAt).toLocaleString()}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Empty state */}
                {!complaint && !loading && !error && (
                    <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-light)' }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
                        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Enter Your Tracking ID</h3>
                        <p>Use the tracking ID you received when submitting your complaint (format: CF-XXXXXX)</p>
                    </div>
                )}
            </div>
        </div>
    );
}
