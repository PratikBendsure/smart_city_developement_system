import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { complaintsAPI, aiAPI } from '../services/api';
import { FiUpload, FiCamera, FiMapPin, FiCheck, FiX, FiZap } from 'react-icons/fi';
import { MdWaterDrop, MdDeleteOutline, MdOutlineAddRoad, MdLocalHospital, MdSchool, MdNaturePeople, MdOutlineLocalFireDepartment, MdCleanHands, MdOutlineBlock } from 'react-icons/md';

const CATEGORIES = [
    { key: 'water_supply', tKey: 'cat_water', icon: MdWaterDrop, color: '#3b82f6' },
    { key: 'waste_management', tKey: 'cat_waste', icon: MdDeleteOutline, color: '#10b981' },
    { key: 'road_infrastructure', tKey: 'cat_road', icon: MdOutlineAddRoad, color: '#f59e0b' },
    { key: 'health_services', tKey: 'cat_health', icon: MdLocalHospital, color: '#ec4899' },
    { key: 'education_facility', tKey: 'cat_education', icon: MdSchool, color: '#8b5cf6' },
    { key: 'parks_recreation', tKey: 'cat_parks', icon: MdNaturePeople, color: '#059669' },
    { key: 'fire_emergency', tKey: 'cat_fire', icon: MdOutlineLocalFireDepartment, color: '#ef4444' },
    { key: 'sanitation_hygiene', tKey: 'cat_sanitation', icon: MdCleanHands, color: '#d97706' },
    { key: 'encroachment', tKey: 'cat_encroachment', icon: MdOutlineBlock, color: '#6b7280' },
];

function AICard({ analysis, loading }) {
    const { t } = useTranslation();
    if (loading) {
        return (
            <div style={{ background: 'linear-gradient(135deg,#0f1923,#1a2634)', borderRadius: 16, padding: 24, color: 'white', border: '2px solid rgba(0,184,148,0.4)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, background: 'rgba(0,184,148,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FiZap size={20} color="#00b894" style={{ animation: 'pulse 1s infinite' }} />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>{t('ai_analyzing')}</div>
                        <div style={{ fontSize: 12, opacity: 0.6 }}>Using Google Gemini Vision AI...</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                    {[80, 60, 70].map((w, i) => <div key={i} className="skeleton" style={{ height: 14, width: `${w}%`, borderRadius: 6, background: 'rgba(255,255,255,0.08)' }} />)}
                </div>
            </div>
        );
    }
    if (!analysis) return null;

    const severityColors = { low: '#10b981', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };
    const cat = CATEGORIES.find(c => c.key === analysis.category);

    return (
        <div className="animate-scale-in" style={{ background: 'linear-gradient(135deg,#0f1923,#1a2634)', borderRadius: 16, padding: 24, color: 'white', border: '2px solid rgba(0,184,148,0.5)', boxShadow: '0 0 40px rgba(0,184,148,0.15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <div style={{ width: 36, height: 36, background: 'rgba(0,184,148,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FiZap size={18} color="#00b894" />
                </div>
                <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>🤖 {t('ai_detected')}</div>
                    <div style={{ fontSize: 11, opacity: 0.6 }}>{analysis.method === 'gemini_vision' ? 'Powered by Google Gemini' : 'Smart Rule-based Classifier'} · {analysis.processingTime}ms</div>
                </div>
                <div style={{ marginLeft: 'auto', background: 'rgba(0,184,148,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#00b894', fontWeight: 700 }}>
                    {Math.round(analysis.confidence * 100)}% {t('confidence')}
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('category')}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {cat && <cat.icon size={18} color={cat.color} />}
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{analysis.categoryLabel}</span>
                    </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, opacity: 0.5, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('severity')}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: severityColors[analysis.severity] || '#f59e0b', textTransform: 'capitalize' }}>
                        ⚠️ {analysis.severity}
                    </div>
                </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px', fontSize: 13, opacity: 0.8, lineHeight: 1.7 }}>
                {analysis.description}
            </div>
        </div>
    );
}

export default function ReportIssue() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [aiAnalysis, setAiAnalysis] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [uploadedFilename, setUploadedFilename] = useState('');
    const [form, setForm] = useState({
        category: searchParams.get('category') || '',
        title: '', description: '', address: '', ward: '', city: 'Mumbai', lat: '', lng: '',
        reporterName: '', reporterPhone: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(null);

    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    // Auto-fill from AI
    useEffect(() => {
        if (aiAnalysis) {
            if (!form.category) set('category', aiAnalysis.category);
            if (!form.title && aiAnalysis.suggestedTitle) set('title', aiAnalysis.suggestedTitle);
        }
    }, [aiAnalysis]);

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setAiAnalysis(null);

        // Upload to AI classify
        setAiLoading(true);
        try {
            const fd = new FormData();
            fd.append('image', file);
            fd.append('description', form.description);
            const res = await aiAPI.classify(fd);
            setAiAnalysis(res.data.analysis);
            setUploadedFilename(res.data.analysis.filename);
            toast.success('AI classified your image!');
        } catch (err) {
            toast.error('AI analysis failed, please select category manually');
        } finally {
            setAiLoading(false);
        }
    }, [form.description]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }, maxSize: 10 * 1024 * 1024, multiple: false
    });

    const getLocation = () => {
        if (!navigator.geolocation) return toast.error('Geolocation not supported');
        navigator.geolocation.getCurrentPosition(
            pos => { set('lat', pos.coords.latitude.toFixed(6)); set('lng', pos.coords.longitude.toFixed(6)); toast.success('Location captured!'); },
            () => toast.error('Could not get location')
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.address) return toast.error('Please enter location/address');
        if (!form.category) return toast.error('Please select or let AI detect category');
        if (!image && !uploadedFilename) return toast.error('Please upload a photo');
        setSubmitting(true);
        try {
            const fd = new FormData();
            // If image already uploaded to AI, submit separately; otherwise attach
            if (image && !uploadedFilename) fd.append('image', image);
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            if (uploadedFilename) fd.append('existingFilename', uploadedFilename);

            // Re-upload image with complaint
            const fd2 = new FormData();
            if (image) fd2.append('image', image);
            Object.entries(form).forEach(([k, v]) => fd2.append(k, v));
            if (aiAnalysis) { fd2.append('aiCategory', aiAnalysis.category); fd2.append('aiSeverity', aiAnalysis.severity); }

            const res = await complaintsAPI.submit(fd2);
            setSubmitted(res.data.complaint);
            toast.success(t('success_report'));
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(135deg,#f0f4f8,#e8f4f8)' }}>
                <div className="card animate-scale-in" style={{ maxWidth: 540, width: '100%', padding: 40, textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, background: '#d1fae5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                        <FiCheck size={40} color="#10b981" />
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8, color: '#065f46' }}>Report Submitted! 🎉</h2>
                    <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Your complaint has been registered and the municipal team will respond within 24 hours.</p>

                    <div style={{ background: 'linear-gradient(135deg,#0f1923,#1a2634)', borderRadius: 16, padding: 24, color: 'white', marginBottom: 24 }}>
                        <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 8 }}>Your Tracking ID</div>
                        <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: 3, color: '#00b894' }}>{submitted.trackingId}</div>
                        <div style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>Save this ID to track your complaint</div>
                    </div>

                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-outline" onClick={() => { navigator.clipboard.writeText(submitted.trackingId); toast.success('Copied!'); }}>
                            📋 Copy ID
                        </button>
                        <button className="btn btn-primary" onClick={() => navigate(`/track/${submitted.trackingId}`)}>
                            Track Status →
                        </button>
                        <button className="btn btn-sm" style={{ background: 'var(--bg)', color: 'var(--text)' }} onClick={() => { setSubmitted(null); setImage(null); setPreview(''); setAiAnalysis(null); setForm({ category: '', title: '', description: '', address: '', ward: '', city: 'Mumbai', lat: '', lng: '', reporterName: '', reporterPhone: '' }); }}>
                            + New Report
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="page-header">
                <div className="container">
                    <h1>📸 Report an Issue</h1>
                    <p>Upload a photo — AI will automatically detect the issue type, severity, and suggest the best category.</p>
                </div>
            </div>

            <div className="container" style={{ padding: '40px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
                    {/* LEFT: Photo & AI */}
                    <div>
                        {/* Dropzone */}
                        <div {...getRootProps()} style={{
                            border: `2px dashed ${isDragActive ? '#00b894' : preview ? '#00b894' : '#e2e8f0'}`,
                            borderRadius: 20, padding: preview ? 0 : 48, textAlign: 'center', cursor: 'pointer',
                            background: isDragActive ? '#f0fdf4' : 'white', transition: 'all 0.2s', overflow: 'hidden', marginBottom: 20
                        }}>
                            <input {...getInputProps()} />
                            {preview ? (
                                <div style={{ position: 'relative' }}>
                                    <img src={preview} alt="preview" style={{ width: '100%', height: 280, objectFit: 'cover', display: 'block' }} />
                                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                                        <button type="button" style={{ background: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={e => { e.stopPropagation(); setPreview(''); setImage(null); setAiAnalysis(null); }}>
                                            <FiX />
                                        </button>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(0,0,0,0.7))', padding: '20px 16px 16px', color: 'white', fontSize: 13 }}>
                                        Click to change photo
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div style={{ width: 64, height: 64, background: 'var(--primary-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                                        <FiCamera size={28} color="var(--primary)" />
                                    </div>
                                    <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{isDragActive ? 'Drop image here...' : t('upload_photo')}</div>
                                    <p style={{ color: 'var(--text-light)', fontSize: 14 }}>{t('upload_hint')}</p>
                                    <div style={{ marginTop: 16, display: 'flex', gap: 12, justifyContent: 'center' }}>
                                        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <FiUpload size={14} /> Upload Photo
                                        </div>
                                        <div style={{ background: '#ede9fe', color: '#5b21b6', padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
                                            🤖 AI Auto-Detect
                                        </div>
                                    </div>
                                    <p style={{ fontSize: 12, color: 'var(--gray-light)', marginTop: 12 }}>JPG, PNG, WebP up to 10MB</p>
                                </>
                            )}
                        </div>

                        {/* AI Analysis Card */}
                        <AICard analysis={aiAnalysis} loading={aiLoading} />

                        {/* Category selector */}
                        <div style={{ marginTop: 20 }}>
                            <label className="form-label">{t('category')} {!aiAnalysis && '*'}</label>
                            {aiAnalysis && <div style={{ fontSize: 12, color: 'var(--primary)', marginBottom: 8 }}>✓ AI detected — you can change if needed</div>}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                {CATEGORIES.map(({ key, tKey, icon: Icon, color }) => (
                                    <button key={key} type="button"
                                        style={{ padding: '12px 8px', borderRadius: 12, border: `2px solid ${form.category === key ? color : 'var(--border)'}`, background: form.category === key ? color + '15' : 'white', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}
                                        onClick={() => set('category', key)}>
                                        <Icon size={22} color={color} style={{ display: 'block', margin: '0 auto 6px' }} />
                                        <div style={{ fontSize: 11, fontWeight: 600, color: form.category === key ? color : 'var(--text-light)' }}>{t(tKey)}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Form */}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Complaint Title</label>
                            <input className="form-input" placeholder="Brief title of the issue..."
                                value={form.title} onChange={e => set('title', e.target.value)} />
                            {aiAnalysis?.suggestedTitle && !form.title && (
                                <div style={{ fontSize: 12, color: 'var(--primary)', marginTop: 4 }}>
                                    💡 AI suggests: <button type="button" style={{ color: 'var(--primary)', background: 'none', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => set('title', aiAnalysis.suggestedTitle)}>{aiAnalysis.suggestedTitle}</button>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">{t('description')}</label>
                            <textarea className="form-input" rows={4} placeholder="Describe the issue in detail..."
                                value={form.description} onChange={e => set('description', e.target.value)} />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label className="form-label" style={{ margin: 0 }}>{t('location')} *</label>
                                <button type="button" className="btn btn-sm" style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 12px', fontSize: 12 }} onClick={getLocation}>
                                    <FiMapPin size={12} /> Use GPS
                                </button>
                            </div>
                            <input className="form-input" placeholder="Street address, landmark, area..." required
                                value={form.address} onChange={e => set('address', e.target.value)} />
                        </div>

                        <div className="grid-2" style={{ gap: 12 }}>
                            <div className="form-group">
                                <label className="form-label">{t('ward')}</label>
                                <input className="form-input" placeholder="Ward 5 / Sector 12"
                                    value={form.ward} onChange={e => set('ward', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('city')}</label>
                                <input className="form-input" placeholder="Mumbai"
                                    value={form.city} onChange={e => set('city', e.target.value)} />
                            </div>
                        </div>

                        {form.lat && (
                            <div style={{ background: 'var(--primary-light)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--primary)', marginBottom: 16 }}>
                                📍 GPS: {Number(form.lat).toFixed(4)}, {Number(form.lng).toFixed(4)}
                            </div>
                        )}

                        <div className="grid-2" style={{ gap: 12 }}>
                            <div className="form-group">
                                <label className="form-label">{t('your_name')}</label>
                                <input className="form-input" placeholder="Rahul Sharma"
                                    value={form.reporterName} onChange={e => set('reporterName', e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">{t('your_phone')}</label>
                                <input className="form-input" placeholder="9876543210" type="tel"
                                    value={form.reporterPhone} onChange={e => set('reporterPhone', e.target.value)} />
                            </div>
                        </div>

                        <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 16px', fontSize: 13, marginBottom: 20 }}>
                            ⏰ <strong>24-Hour Response Guarantee</strong> — Municipal team will act within 24 hours of submission.
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={submitting}>
                            {submitting ? '⟳ Submitting...' : <><FiUpload /> {t('submit')}</>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
