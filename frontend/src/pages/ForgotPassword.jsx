import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowLeft, FiCheck, FiPhone, FiSend, FiX } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: enter details, 2: OTP, 3: new password
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [method, setMethod] = useState('email'); // 'email' or 'phone'
    const [userEmail, setUserEmail] = useState(''); // actual email for verify/reset calls
    const [maskedEmail, setMaskedEmail] = useState('');
    const [maskedPhone, setMaskedPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [receivedOtp, setReceivedOtp] = useState('');
    const otpRefs = useRef([]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    // Auto-hide OTP popup after 15 seconds
    useEffect(() => {
        if (showOtpPopup) {
            const timer = setTimeout(() => setShowOtpPopup(false), 15000);
            return () => clearTimeout(timer);
        }
    }, [showOtpPopup]);

    const handleOtpChange = (index, value) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) otpRefs.current[index + 1]?.focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        if (pasted.length === 6) {
            setOtp(pasted.split(''));
            otpRefs.current[5]?.focus();
        }
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (method === 'phone' && !phone) return toast.error('Please enter your phone number');
        if (method === 'email' && !email) return toast.error('Please enter your email address');
        setLoading(true);
        try {
            const body = { method };
            if (method === 'phone') body.phone = phone;
            else body.email = email;

            const res = await axios.post('/api/auth/forgot-password', body);
            if (res.data.success) {
                setUserEmail(res.data.userEmail || email);
                setMaskedEmail(res.data.maskedEmail || '');
                setMaskedPhone(res.data.maskedPhone || '');

                // Show OTP notification popup (simulating receiving on phone/email)
                if (res.data.otp) {
                    setReceivedOtp(res.data.otp);
                    setShowOtpPopup(true);
                }

                setStep(2);
                setCountdown(600);
                toast.success(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 6) return toast.error('Please enter the complete 6-digit OTP');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/verify-otp', { email: userEmail, otp: otpString });
            if (res.data.success) {
                setStep(3);
                setShowOtpPopup(false);
                toast.success('OTP verified! Set your new password.');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'OTP verification failed');
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!newPassword || !confirmPassword) return toast.error('Please fill in both password fields');
        if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
        if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
        setLoading(true);
        try {
            const res = await axios.post('/api/auth/reset-password', { email: userEmail, otp: otp.join(''), newPassword });
            if (res.data.success) {
                toast.success('Password reset successfully! Please login.');
                navigate('/login');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const body = { method };
            if (method === 'phone') body.phone = phone;
            else body.email = userEmail || email;

            const res = await axios.post('/api/auth/forgot-password', body);
            if (res.data.success) {
                setOtp(['', '', '', '', '', '']);
                setCountdown(600);
                if (res.data.otp) {
                    setReceivedOtp(res.data.otp);
                    setShowOtpPopup(true);
                }
                toast.success(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to resend OTP');
        } finally {
            setLoading(false);
        }
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const StepIndicator = () => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28 }}>
            {[1, 2, 3].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                        width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 13, fontWeight: 700,
                        background: step >= s ? 'linear-gradient(135deg, #00b894, #0984e3)' : '#e2e8f0',
                        color: step >= s ? '#fff' : '#94a3b8',
                        transition: 'all 0.3s ease',
                        boxShadow: step >= s ? '0 4px 12px rgba(0,184,148,0.3)' : 'none'
                    }}>
                        {step > s ? <FiCheck size={14} /> : s}
                    </div>
                    {i < 2 && (
                        <div style={{
                            width: 40, height: 3, borderRadius: 2,
                            background: step > s ? 'linear-gradient(90deg, #00b894, #0984e3)' : '#e2e8f0',
                            transition: 'all 0.3s ease'
                        }} />
                    )}
                </div>
            ))}
        </div>
    );

    // Simulated OTP notification popup (like receiving SMS/email)
    const OtpNotificationPopup = () => {
        if (!showOtpPopup || !receivedOtp) return null;
        return (
            <div style={{
                position: 'fixed', top: 20, right: 20, zIndex: 9999,
                background: '#fff', borderRadius: 16, padding: '16px 20px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #e2e8f0', maxWidth: 320, minWidth: 280,
                animation: 'slideInRight 0.4s ease'
            }}>
                <style>{`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}</style>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: method === 'phone' ? 'linear-gradient(135deg, #00b894, #00d2d3)' : 'linear-gradient(135deg, #0984e3, #6c5ce7)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                            {method === 'phone' ? <FiPhone size={16} color="#fff" /> : <FiMail size={16} color="#fff" />}
                        </div>
                        <div>
                            <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 2px', fontWeight: 600 }}>
                                {method === 'phone' ? '📱 SMS Message' : '📧 Email Received'}
                            </p>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 6px' }}>CivicFix</p>
                        </div>
                    </div>
                    <button onClick={() => setShowOtpPopup(false)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}>
                        <FiX size={16} />
                    </button>
                </div>
                <div style={{
                    background: '#f8fafc', borderRadius: 10, padding: '12px 14px', marginTop: 10,
                    border: '1px solid #e2e8f0'
                }}>
                    <p style={{ fontSize: 13, color: '#334155', margin: '0 0 8px' }}>
                        Your CivicFix verification code is:
                    </p>
                    <p style={{
                        fontSize: 28, fontWeight: 800, letterSpacing: 6, color: '#0984e3',
                        fontFamily: 'monospace', margin: '0 0 6px', textAlign: 'center'
                    }}>{receivedOtp}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, textAlign: 'center' }}>Valid for 10 minutes. Do not share.</p>
                </div>
                <div style={{
                    marginTop: 8, display: 'flex', alignItems: 'center', gap: 4,
                    padding: '4px 8px', background: '#fff7ed', borderRadius: 6, border: '1px solid #fed7aa'
                }}>
                    <span style={{ fontSize: 10, color: '#c2410c' }}>⚙️ Simulated notification — in production, this arrives via {method === 'phone' ? 'SMS' : 'email'}</span>
                </div>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #f0f4f8, #e8f4f8)' }}>
            <OtpNotificationPopup />
            <div style={{ width: '100%', maxWidth: 440 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#00b894,#0984e3)', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(0,184,148,0.3)' }}>
                        {step === 2 ? <FiShield size={28} color="white" /> : step === 3 ? <FiLock size={28} color="white" /> : <MdLocationOn size={28} color="white" />}
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>
                        {step === 1 ? 'Forgot Password?' : step === 2 ? 'Verify OTP' : 'Create New Password'}
                    </h1>
                    <p style={{ color: 'var(--text-light)', fontSize: 14 }}>
                        {step === 1 ? 'We\'ll send a one-time password to verify your identity' : step === 2 ? 'Enter the 6-digit code sent to you' : 'Set a strong new password for your account'}
                    </p>
                </div>

                <div className="card" style={{ padding: 32 }}>
                    <StepIndicator />

                    {/* Step 1: Choose method & enter email/phone */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp}>
                            {/* Method selector */}
                            <div className="form-group">
                                <label className="form-label">Send OTP via</label>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button type="button" onClick={() => setMethod('email')}
                                        style={{
                                            flex: 1, padding: '12px 16px', borderRadius: 12, border: '2px solid',
                                            borderColor: method === 'email' ? '#00b894' : '#e2e8f0',
                                            background: method === 'email' ? 'linear-gradient(135deg, #e8f7f0, #dff3fb)' : '#fff',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s'
                                        }}>
                                        <FiMail size={18} color={method === 'email' ? '#00b894' : '#94a3b8'} />
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: method === 'email' ? '#0f172a' : '#64748b' }}>Email</div>
                                        </div>
                                        {method === 'email' && <FiCheck size={16} color="#00b894" style={{ marginLeft: 'auto' }} />}
                                    </button>
                                    <button type="button" onClick={() => setMethod('phone')}
                                        style={{
                                            flex: 1, padding: '12px 16px', borderRadius: 12, border: '2px solid',
                                            borderColor: method === 'phone' ? '#00b894' : '#e2e8f0',
                                            background: method === 'phone' ? 'linear-gradient(135deg, #e8f7f0, #dff3fb)' : '#fff',
                                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, transition: 'all 0.2s'
                                        }}>
                                        <FiPhone size={18} color={method === 'phone' ? '#00b894' : '#94a3b8'} />
                                        <div style={{ textAlign: 'left' }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: method === 'phone' ? '#0f172a' : '#64748b' }}>Phone</div>
                                        </div>
                                        {method === 'phone' && <FiCheck size={16} color="#00b894" style={{ marginLeft: 'auto' }} />}
                                    </button>
                                </div>
                            </div>

                            {/* Conditional input: email or phone */}
                            {method === 'email' ? (
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                        <input className="form-input" type="email" placeholder="you@example.com" style={{ paddingLeft: 42 }}
                                            value={email} onChange={e => setEmail(e.target.value)} autoFocus />
                                    </div>
                                </div>
                            ) : (
                                <div className="form-group">
                                    <label className="form-label">Phone Number</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                        <input className="form-input" type="tel" placeholder="9876543210" style={{ paddingLeft: 42 }}
                                            value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} autoFocus
                                            maxLength={10} />
                                    </div>
                                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Enter 10-digit mobile number</p>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} disabled={loading}>
                                {loading ? '⟳ Sending OTP...' : <><FiSend size={16} /> Send OTP</>}
                            </button>
                        </form>
                    )}

                    {/* Step 2: Enter OTP */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp}>
                            <div style={{
                                background: 'linear-gradient(135deg, #e8f7f0, #dff3fb)', border: '1px solid #bbf7d0',
                                borderRadius: 14, padding: '16px 20px', marginBottom: 20, textAlign: 'center'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
                                    {method === 'phone' ? <FiPhone size={18} color="#00b894" /> : <FiMail size={18} color="#00b894" />}
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#166534' }}>OTP Sent!</span>
                                </div>
                                <p style={{ fontSize: 13, color: '#334155', margin: 0 }}>
                                    {method === 'phone'
                                        ? <>Check SMS on <strong>{maskedPhone}</strong></>
                                        : <>Check inbox of <strong>{maskedEmail}</strong></>
                                    }
                                </p>
                                <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, marginBottom: 0 }}>
                                    Look for the notification popup in the top-right corner →
                                </p>
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ textAlign: 'center', display: 'block' }}>Enter 6-Digit OTP</label>
                                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                                    {otp.map((digit, index) => (
                                        <input key={index} type="text" inputMode="numeric" maxLength={1}
                                            ref={el => otpRefs.current[index] = el}
                                            value={digit}
                                            onChange={e => handleOtpChange(index, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(index, e)}
                                            onPaste={index === 0 ? handleOtpPaste : undefined}
                                            style={{
                                                width: 48, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                                                borderRadius: 12, border: digit ? '2px solid #00b894' : '2px solid #e2e8f0',
                                                outline: 'none', transition: 'all 0.2s', fontFamily: 'monospace',
                                                background: digit ? '#f0fdf9' : '#fff'
                                            }}
                                            onFocus={e => e.target.style.borderColor = '#0984e3'}
                                            onBlur={e => e.target.style.borderColor = digit ? '#00b894' : '#e2e8f0'}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div style={{ textAlign: 'center', margin: '12px 0 16px', fontSize: 13 }}>
                                {countdown > 0 ? (
                                    <span style={{ color: 'var(--text-light)' }}>
                                        OTP expires in <span style={{ fontWeight: 700, color: countdown < 60 ? '#e74c3c' : '#0984e3' }}>{formatTime(countdown)}</span>
                                    </span>
                                ) : (
                                    <span style={{ color: '#e74c3c', fontWeight: 600 }}>OTP expired</span>
                                )}
                                <span style={{ margin: '0 8px', color: '#e2e8f0' }}>|</span>
                                <button type="button" onClick={handleResendOtp} disabled={loading}
                                    style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: 13, textDecoration: 'underline' }}>
                                    Resend OTP
                                </button>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || otp.join('').length !== 6}>
                                {loading ? '⟳ Verifying...' : '✓ Verify OTP'}
                            </button>

                            <div style={{ textAlign: 'center', marginTop: 12 }}>
                                <button type="button" onClick={() => { setStep(1); setOtp(['', '', '', '', '', '']); setCountdown(0); setShowOtpPopup(false); }}
                                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                                    ← Change method
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: New Password */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword}>
                            <div style={{
                                background: '#f0fdf9', border: '1px solid #bbf7d0', borderRadius: 12, padding: '12px 16px',
                                marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <FiCheck style={{ color: '#00b894', flexShrink: 0 }} size={18} />
                                <span style={{ fontSize: 13, color: '#166534' }}>Identity verified for <strong>{maskedEmail || maskedPhone}</strong></span>
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                    <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min 6 characters" style={{ paddingLeft: 42, paddingRight: 42 }}
                                        value={newPassword} onChange={e => setNewPassword(e.target.value)} autoFocus />
                                    <button type="button" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--gray)', border: 'none', cursor: 'pointer' }} onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-light)' }} />
                                    <input className="form-input" type={showConfirmPass ? 'text' : 'password'} placeholder="Re-enter password" style={{ paddingLeft: 42, paddingRight: 42 }}
                                        value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                                    <button type="button" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', color: 'var(--gray)', border: 'none', cursor: 'pointer' }} onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                        {showConfirmPass ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                                {confirmPassword && newPassword !== confirmPassword && (
                                    <p style={{ color: '#e74c3c', fontSize: 12, marginTop: 4 }}>Passwords do not match</p>
                                )}
                            </div>

                            {newPassword && (
                                <div style={{ marginBottom: 16 }}>
                                    <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                        {[1, 2, 3, 4].map(s => (
                                            <div key={s} style={{
                                                flex: 1, height: 4, borderRadius: 2,
                                                background: newPassword.length >= s * 3 ?
                                                    s <= 1 ? '#e74c3c' : s <= 2 ? '#f39c12' : s <= 3 ? '#00b894' : '#0984e3'
                                                    : '#e2e8f0',
                                                transition: 'all 0.3s'
                                            }} />
                                        ))}
                                    </div>
                                    <p style={{ fontSize: 11, color: 'var(--text-light)' }}>
                                        {newPassword.length < 6 ? 'Too short' : newPassword.length < 8 ? 'Fair' : newPassword.length < 12 ? 'Good' : 'Strong'}
                                    </p>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}>
                                {loading ? '⟳ Resetting...' : '🔒 Reset Password'}
                            </button>
                        </form>
                    )}

                    <div style={{ textAlign: 'center', marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <FiArrowLeft size={14} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
