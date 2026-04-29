import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import i18n from '../i18n/index.js';
import './Navbar.css';

const LANGS = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
    { code: 'kn', label: 'ಕನ್ನಡ', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
];

export default function Navbar() {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState(localStorage.getItem('civicfix_lang') || 'en');

    const userMenuRef = useRef(null);
    const langMenuRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
                setUserOpen(false);
            }
            if (langMenuRef.current && !langMenuRef.current.contains(e.target)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLang = (code) => {
        i18n.changeLanguage(code);
        localStorage.setItem('civicfix_lang', code);
        setCurrentLang(code);
        setLangOpen(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
        setUserOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <div className="logo-icon"><MdLocationOn size={20} /></div>
                    <span>CivicFix</span>
                </Link>

                {/* Desktop Nav */}
                <ul className="navbar-links hide-mobile">
                    <li><Link to="/" className={isActive('/') ? 'active' : ''}>{t('nav_home')}</Link></li>
                    <li><Link to="/report" className={isActive('/report') ? 'active' : ''}>{t('nav_report')}</Link></li>
                    <li><Link to="/track" className={isActive('/track') ? 'active' : ''}>{t('nav_track')}</Link></li>
                    <li><Link to="/stats" className={isActive('/stats') ? 'active' : ''}>{t('nav_stats')}</Link></li>
                    {user && <li><Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>{t('nav_dashboard')}</Link></li>}
                    {user && (user.role === 'admin' || user.role === 'municipal') && (
                        <li><Link to="/admin" className={isActive('/admin') ? 'active' : ''}>{t('nav_admin')}</Link></li>
                    )}
                </ul>

                {/* Actions */}
                <div className="navbar-actions">
                    {/* Language picker */}
                    <div className="lang-picker" ref={langMenuRef}>
                        <button className="lang-btn" onClick={() => setLangOpen(!langOpen)}>
                            {LANGS.find(l => l.code === currentLang)?.flag} {currentLang.toUpperCase()}
                        </button>
                        {langOpen && (
                            <div className="lang-dropdown">
                                {LANGS.map(l => (
                                    <button key={l.code} className={`lang-option ${currentLang === l.code ? 'active' : ''}`} onClick={() => changeLang(l.code)}>
                                        {l.flag} {l.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Auth */}
                    {user ? (
                        <div className="user-menu" ref={userMenuRef}>
                            <button className="user-btn" onClick={() => setUserOpen(!userOpen)}>
                                <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                                <span className="hide-mobile">{user.name?.split(' ')[0]}</span>
                            </button>
                            {userOpen && (
                                <div className="user-dropdown">
                                    <div className="user-info">
                                        <strong>{user.name}</strong>
                                        <small>{user.email}</small>
                                    </div>
                                    <Link to="/dashboard" className="user-option" onClick={() => setUserOpen(false)}>
                                        <FiUser size={14} /> {t('nav_dashboard')}
                                    </Link>
                                    <button className="user-option danger" onClick={handleLogout}>
                                        <FiLogOut size={14} /> {t('nav_logout')}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="auth-btns hide-mobile">
                            <Link to="/login" className="btn btn-outline btn-sm">{t('nav_login')}</Link>
                            <Link to="/register" className="btn btn-primary btn-sm">{t('nav_register')}</Link>
                        </div>
                    )}

                    {/* Mobile menu toggle */}
                    <button className="mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
                        {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="mobile-menu">
                    <Link to="/" onClick={() => setMobileOpen(false)}>{t('nav_home')}</Link>
                    <Link to="/report" onClick={() => setMobileOpen(false)}>{t('nav_report')}</Link>
                    <Link to="/track" onClick={() => setMobileOpen(false)}>{t('nav_track')}</Link>
                    <Link to="/stats" onClick={() => setMobileOpen(false)}>{t('nav_stats')}</Link>
                    {user && <Link to="/dashboard" onClick={() => setMobileOpen(false)}>{t('nav_dashboard')}</Link>}
                    {user && (user.role === 'admin' || user.role === 'municipal') && (
                        <Link to="/admin" onClick={() => setMobileOpen(false)}>{t('nav_admin')}</Link>
                    )}
                    {!user && (
                        <>
                            <Link to="/login" className="btn btn-outline btn-sm" style={{ display: 'block', marginTop: 8 }} onClick={() => setMobileOpen(false)}>{t('nav_login')}</Link>
                            <Link to="/register" className="btn btn-primary btn-sm" style={{ display: 'block', marginTop: 8 }} onClick={() => setMobileOpen(false)}>{t('nav_register')}</Link>
                        </>
                    )}
                    {user && <button className="text-danger" style={{ marginTop: 8, background: 'none', color: '#e17055', fontWeight: 600 }} onClick={handleLogout}>{t('nav_logout')}</button>}
                </div>
            )}
        </nav>
    );
}
