import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';

export default function Login() {
    const { t } = useTranslation();
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) return toast.error('Please fill in all fields');
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}!`);
            navigate(user.role === 'admin' || user.role === 'municipal' ? '/admin' : '/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #f0f4f8, #e8f4f8)' }}>
            <div style={{ width: '100%', maxWidth: 420 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#00b894,#0984e3)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,184,148,0.3)' }}>
                        <MdLocationOn size={28} color="white" />
                    </div>
                    <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>{t('login_title')}</h1>
                    <p style={{ color: 'var(--text-light)', fontSize: 15 }}>Sign in to your CivicFix account</p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">{t('email')}</label>
                            <div style={{ position: 'relative' }}>
                                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                <input className="form-input" type="email" placeholder="you@example.com" style={{ paddingLeft: 42 }}
                                    value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('password')}</label>
                            <div style={{ position: 'relative' }}>
                                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" style={{ paddingLeft: 42, paddingRight: 42 }}
                                    value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                                <button type="button" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--gray)' }} onClick={() => setShowPass(!showPass)}>
                                    {showPass ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={loading}>
                            {loading ? '⟳ Signing in...' : t('sign_in')}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                        <span style={{ color: 'var(--text-light)', fontSize: 14 }}>{t('no_account')} </span>
                        <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14 }}>{t('sign_up')}</Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
