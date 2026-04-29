import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MdLocationOn } from 'react-icons/md';
import { FiPhone, FiMail } from 'react-icons/fi';

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer style={{
            background: 'linear-gradient(135deg, #0f1923 0%, #1a2634 100%)',
            color: 'rgba(255,255,255,0.8)',
            padding: '48px 0 24px'
        }}>
            <div className="container">
                <div className="grid-4" style={{ marginBottom: 40 }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 38, height: 38, background: 'linear-gradient(135deg,#00b894,#0984e3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                <MdLocationOn size={20} />
                            </div>
                            <span style={{ fontSize: 20, fontWeight: 800, color: 'white' }}>CivicFix</span>
                        </div>
                        <p style={{ fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
                            Empowering citizens to report civic issues and make their cities cleaner, safer, and better for everyone.
                        </p>
                        <div style={{ display: 'flex', gap: 12 }}>
                            {['📘', '🐦', '📸'].map((icon, i) => (
                                <div key={i} style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 16 }}>{icon}</div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Quick Links</h4>
                        {[
                            { to: '/', label: 'Home' }, { to: '/report', label: 'Report Issue' },
                            { to: '/track', label: 'Track Complaint' }, { to: '/stats', label: 'Statistics' }
                        ].map(l => (
                            <div key={l.to} style={{ marginBottom: 10 }}>
                                <Link to={l.to} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#00b894'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                                    → {l.label}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Categories</h4>
                        {[
                            { label: t('cat_water'), cat: 'water_supply' },
                            { label: t('cat_waste'), cat: 'waste_management' },
                            { label: t('cat_road'), cat: 'road_infrastructure' },
                            { label: t('cat_health'), cat: 'health_services' },
                            { label: t('cat_fire'), cat: 'fire_emergency' }
                        ].map(c => (
                            <div key={c.cat} style={{ marginBottom: 10 }}>
                                <Link to={`/report?category=${c.cat}`} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, transition: 'color 0.2s', textDecoration: 'none' }} onMouseOver={e => e.target.style.color = '#00b894'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
                                    • {c.label}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div>
                        <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Contact</h4>
                        <a href="tel:+918799900877" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textDecoration: 'none', color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#00b894'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                            <FiPhone size={15} style={{ color: '#00b894', flexShrink: 0 }} />
                            <span style={{ fontSize: 14 }}>+91 8799900877</span>
                        </a>
                        <a href="https://mail.google.com/mail/?view=cm&to=helpcivicfix@gmail.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, textDecoration: 'none', color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#00b894'} onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}>
                            <FiMail size={15} style={{ color: '#00b894', flexShrink: 0 }} />
                            <span style={{ fontSize: 14 }}>helpcivicfix@gmail.com</span>
                        </a>
                        <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(0,184,148,0.15)', borderRadius: 10, border: '1px solid rgba(0,184,148,0.3)' }}>
                            <div style={{ fontSize: 12, color: '#00b894', fontWeight: 700, marginBottom: 4 }}>⚡ HELPLINE</div>
                            <div style={{ fontSize: 13, color: 'white' }}>24/7 Emergency Response</div>
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <span style={{ fontSize: 13 }}>© 2026 CivicFix. Built for Smart City Initiative.</span>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {[
                            { to: '/privacy', label: 'Privacy Policy' },
                            { to: '/terms', label: 'Terms of Use' },
                            { to: '/rti', label: 'RTI' }
                        ].map(l => (
                            <Link key={l.to} to={l.to} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#00b894'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>{l.label}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
