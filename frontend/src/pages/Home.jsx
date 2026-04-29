import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { complaintsAPI } from '../services/api';
import { FiCamera, FiSend, FiClock, FiCheckCircle, FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { MdWaterDrop, MdDeleteOutline, MdOutlineAddRoad, MdLocalHospital, MdSchool, MdNaturePeople, MdOutlineLocalFireDepartment, MdCleanHands, MdOutlineBlock } from 'react-icons/md';

const CATEGORIES = [
    { key: 'water_supply', tKey: 'cat_water', icon: MdWaterDrop, color: 'cat-water' },
    { key: 'waste_management', tKey: 'cat_waste', icon: MdDeleteOutline, color: 'cat-waste' },
    { key: 'road_infrastructure', tKey: 'cat_road', icon: MdOutlineAddRoad, color: 'cat-road' },
    { key: 'health_services', tKey: 'cat_health', icon: MdLocalHospital, color: 'cat-health' },
    { key: 'education_facility', tKey: 'cat_education', icon: MdSchool, color: 'cat-education' },
    { key: 'parks_recreation', tKey: 'cat_parks', icon: MdNaturePeople, color: 'cat-parks' },
    { key: 'fire_emergency', tKey: 'cat_fire', icon: MdOutlineLocalFireDepartment, color: 'cat-fire' },
    { key: 'sanitation_hygiene', tKey: 'cat_sanitation', icon: MdCleanHands, color: 'cat-sanitation' },
    { key: 'encroachment', tKey: 'cat_encroachment', icon: MdOutlineBlock, color: 'cat-encroachment' },
];

const STATS_DATA = [
    { label: 'Issues Resolved', key: 'resolved', icon: '✅', color: '#00b894', suffix: '' },
    { label: 'Avg Response', key: 'avgResponse', icon: '⚡', color: '#0984e3', suffix: ' hrs' },
    { label: 'Satisfaction Rate', key: 'satisfaction', icon: '⭐', color: '#fdcb6e', suffix: '%' },
    { label: 'Wards Covered', key: 'wards', icon: '🏙️', color: '#a29bfe', suffix: '' },
];

function StatusDot({ status }) {
    const colors = { pending: '#f59e0b', in_progress: '#3b82f6', resolved: '#10b981', rejected: '#ef4444' };
    return <span style={{ width: 8, height: 8, borderRadius: '50%', background: colors[status] || '#94a3b8', display: 'inline-block' }} />;
}

export default function Home() {
    const { t } = useTranslation();
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState([]);
    const [trackId, setTrackId] = useState('');

    useEffect(() => {
        complaintsAPI.getStats().then(r => setStats(r.data.stats)).catch(() => { });
        complaintsAPI.getPublic().then(r => setRecent(r.data.complaints?.slice(0, 5) || [])).catch(() => { });
    }, []);

    const categoryLabel = (key) => ({
        water_supply: 'Water Supply', waste_management: 'Waste Management',
        road_infrastructure: 'Road & Infrastructure', health_services: 'Health Services',
        education_facility: 'Education Facility', parks_recreation: 'Parks & Recreation',
        fire_emergency: 'Fire & Emergency', sanitation_hygiene: 'Sanitation & Hygiene',
        encroachment: 'Encroachment'
    })[key] || key;

    return (
        <div>
            {/* === HERO === */}
            <section style={{ background: 'linear-gradient(135deg, #0f1923 0%, #1a2634 60%, #0984e3 100%)', color: 'white', padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,184,148,0.08)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(9,132,227,0.1)', pointerEvents: 'none' }} />

                <div className="container animate-fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00b894', animation: 'pulse 2s infinite' }} />
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1 }}>Smart City Initiative</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
                        <div>
                            <h1 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24 }}>
                                {t('hero_title')}<br />
                                <span style={{ background: 'linear-gradient(135deg,#00b894,#00cec9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    {t('hero_highlight')}
                                </span>
                            </h1>
                            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 36, lineHeight: 1.8, maxWidth: 480 }}>
                                {t('hero_desc')}
                            </p>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                <Link to="/report" className="btn btn-lg" style={{ background: 'linear-gradient(135deg,#00b894,#00cec9)', color: 'white' }}>
                                    <FiCamera /> {t('report_btn')}
                                </Link>
                                <Link to="/track" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '2px solid rgba(255,255,255,0.25)' }}>
                                    <FiClock /> {t('track_btn')}
                                </Link>
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div className="hide-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            {STATS_DATA.map((s, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '24px 20px', textAlign: 'center' }}>
                                    <div style={{ fontSize: 28 }}>{s.icon}</div>
                                    <div style={{ fontSize: 26, fontWeight: 900, color: s.color, margin: '8px 0 4px' }}>
                                        {(() => {
                                            if (!stats) return '0' + s.suffix;
                                            if (s.key === 'resolved') return stats.resolved || 0;
                                            if (s.key === 'avgResponse') return stats.avgResponseTime ? stats.avgResponseTime.toFixed(1) + ' hrs' : '0 hrs';
                                            if (s.key === 'satisfaction') return stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) + '%' : '0%';
                                            if (s.key === 'wards') return stats.total > 0 ? new Set(stats.byCategory?.map(c => c._id) || []).size : 0;
                                            return '0';
                                        })()}
                                    </div>
                                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* === QUICK TRACK === */}
            <section style={{ background: 'linear-gradient(135deg, #00b894, #0984e3)', padding: '28px 0' }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 16 }}>🔍 Track Your Complaint Instantly:</span>
                    <div style={{ display: 'flex', gap: 8, flex: 1, maxWidth: 400 }}>
                        <input
                            className="form-input"
                            placeholder={t('track_placeholder')}
                            value={trackId}
                            onChange={e => setTrackId(e.target.value)}
                            style={{ flex: 1, borderRadius: '8px 0 0 8px', border: 'none' }}
                        />
                        <Link to={`/track/${trackId}`} className="btn btn-sm" style={{ background: '#0f1923', color: 'white', borderRadius: '0 8px 8px 0', whiteSpace: 'nowrap' }}>
                            Track →
                        </Link>
                    </div>
                </div>
            </section>

            {/* === CATEGORIES === */}
            <section className="section">
                <div className="container text-center">
                    <h2 className="section-title">{t('categories')}</h2>
                    <p className="section-sub" style={{ margin: '0 auto 48px' }}>Select a category to report your civic complaint. Every report helps make your city better.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
                        {CATEGORIES.map(({ key, tKey, icon: Icon, color }) => (
                            <Link key={key} to={`/report?category=${key}`}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 20px', background: 'white', borderRadius: 16, border: '2px solid transparent', transition: 'all 0.25s', cursor: 'pointer', textDecoration: 'none', color: 'var(--text)' }}
                                onMouseOver={e => { e.currentTarget.style.borderColor = '#00b894'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,184,148,0.15)'; }}
                                onMouseOut={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                                <div className={`${color}`} style={{ width: 60, height: 60, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 28 }}>
                                    <Icon size={28} />
                                </div>
                                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>{t(tKey)}</div>
                                <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                                    {stats?.byCategory?.find(c => c._id === key)?.count || 0} reports
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* === HOW IT WORKS === */}
            <section className="section" style={{ background: 'linear-gradient(135deg, #f0f4f8, #e8f4f8)' }}>
                <div className="container text-center">
                    <h2 className="section-title">{t('how_it_works')}</h2>
                    <p className="section-sub" style={{ margin: '0 auto 48px' }}>Four simple steps to a cleaner, better city.</p>
                    <div className="grid-4">
                        {[
                            { step: 1, icon: '📸', title: t('step1_title'), desc: t('step1_desc'), color: '#00b894' },
                            { step: 2, icon: '🤖', title: t('step2_title'), desc: t('step2_desc'), color: '#0984e3' },
                            { step: 3, icon: '📤', title: t('step3_title'), desc: t('step3_desc'), color: '#a29bfe' },
                            { step: 4, icon: '✅', title: t('step4_title'), desc: t('step4_desc'), color: '#fdcb6e' },
                        ].map(s => (
                            <div key={s.step} className="card text-center" style={{ border: `2px solid ${s.color}20` }}>
                                <div style={{ width: 56, height: 56, background: s.color + '20', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>{s.icon}</div>
                                <div style={{ fontSize: 11, fontWeight: 800, color: s.color, letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Step {s.step}</div>
                                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                                <p style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.7 }}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* === RECENT REPORTS === */}
            <section className="section">
                <div className="container">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                        <div>
                            <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{t('recent_reports')}</h2>
                            <p style={{ color: 'var(--text-light)', fontSize: 15 }}>Live feed of civic issues being reported across the city.</p>
                        </div>
                        <Link to="/stats" className="btn btn-outline btn-sm"><FiTrendingUp /> View All Stats</Link>
                    </div>

                    {recent.length === 0 ? (
                        <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
                            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14 }} />)}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {recent.map((c, i) => (
                                <Link key={c._id} to={`/track/${c.trackingId}`}
                                    style={{ display: 'flex', alignItems: 'center', gap: 16, background: 'white', borderRadius: 14, padding: '16px 20px', border: '1px solid var(--border)', transition: 'all 0.2s', textDecoration: 'none', color: 'inherit' }}
                                    onMouseOver={e => { e.currentTarget.style.borderColor = '#00b894'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}>
                                    <StatusDot status={c.status} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray)', fontFamily: 'monospace' }}>{c.trackingId}</span>
                                            <span className={`badge badge-${c.status}`} style={{ fontSize: 11 }}>{c.status?.replace('_', ' ')}</span>
                                        </div>
                                        <div style={{ fontWeight: 600, fontSize: 15 }}>{c.title}</div>
                                        <div style={{ fontSize: 13, color: 'var(--gray)', marginTop: 3 }}>📍 {c.location?.address} · {new Date(c.createdAt).toLocaleDateString()}</div>
                                    </div>
                                    <FiArrowRight style={{ color: 'var(--gray-light)' }} />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* === CTA === */}
            <section style={{ background: 'linear-gradient(135deg, #00b894, #0984e3)', padding: '60px 0' }}>
                <div className="container text-center" style={{ color: 'white' }}>
                    <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12 }}>Be the Change Your City Needs</h2>
                    <p style={{ fontSize: 18, opacity: 0.85, marginBottom: 32 }}>Join thousands of citizens who are making a difference, one report at a time.</p>
                    <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-lg" style={{ background: 'white', color: '#00b894' }}>Get Started Free <FiArrowRight /></Link>
                        <Link to="/report" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.4)' }}>Report an Issue</Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
