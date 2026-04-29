import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';

const LANGUAGES = [
    { code: 'en', label: 'English' }, { code: 'hi', label: 'हिंदी' },
    { code: 'mr', label: 'मराठी' }, { code: 'kn', label: 'ಕನ್ನಡ' }, { code: 'ta', label: 'தமிழ்' }
];

export default function Register() {
    const { t } = useTranslation();
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', language: 'en', city: 'Mumbai' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return toast.error('Please fill in required fields');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            const user = await register(form);
            toast.success(`Welcome to CivicFix, ${user.name}!`);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #f0f4f8, #e8f4f8)' }}>
            <div style={{ width: '100%', maxWidth: 480 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#00b894,#0984e3)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,184,148,0.3)' }}>
                        <MdLocationOn size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{t('register_title')}</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: 15 }}>Join CivicFix and help make your city better</p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    <form onSubmit={handleSubmit}>
                        <div className="grid-2" style={{ gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">{t('name')} *</label>
                                <div style={{ position: 'relative' }}>
                                    <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                    <input className="form-input" placeholder="Rahul Sharma" style={{ paddingLeft: 42 }}
                                        value={form.name} onChange={e => set('name', e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('phone')}</label>
                                <div style={{ position: 'relative' }}>
                                    <FiPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                    <input className="form-input" placeholder="9876543210" style={{ paddingLeft: 42 }}
                                        value={form.phone} onChange={e => set('phone', e.target.value)} />
                                </div>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('email')} *</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                <input className="form-input" type="email" placeholder="you@example.com" style={{ paddingLeft: 42 }}
                                    value={form.email} onChange={e => set('email', e.target.value)} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('password')} *</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" style={{ paddingLeft: 42, paddingRight: 42 }}
                                    value={form.password} onChange={e => set('password', e.target.value)} />
                                <button type="button" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--gray)' }} onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <div className="grid-2" style={{ gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">{t('language')}</label>
                                <select className="form-input" value={form.language} onChange={e => set('language', e.target.value)}>
                                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('city')}</label>
                                <input className="form-input" placeholder="Mumbai" value={form.city} onChange={e => set('city', e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                            {loading ? '⟳ Creating Account...' : t('sign_up')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{t('have_account')} </span>
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>{t('sign_in')}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
