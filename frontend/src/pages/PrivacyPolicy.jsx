import { MdLocationOn } from 'react-icons/md';

export default function PrivacyPolicy() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f1923, #1a2634)', padding: '48px 0 32px', color: 'white' }}>
                <div className="container">
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>🔒 Privacy Policy</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>Last updated: February 2026</p>
                </div>
            </div>
            <div className="container" style={{ maxWidth: 800, padding: '40px 20px' }}>
                <div style={{ background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', lineHeight: 1.8, fontSize: 15, color: '#2d3436' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>1. Information We Collect</h2>
                    <p>CivicFix collects the following information when you use our platform:</p>
                    <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                        <li><strong>Account Information:</strong> Name, email address, phone number, and city when you register.</li>
                        <li><strong>Complaint Data:</strong> Location, category, description, and images you submit for civic issues.</li>
                        <li><strong>Usage Data:</strong> Activity logs including login times, actions performed, and device information.</li>
                    </ul>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>2. How We Use Your Information</h2>
                    <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                        <li>To process and resolve civic complaints efficiently.</li>
                        <li>To communicate updates about your reported issues.</li>
                        <li>To improve our services and user experience.</li>
                        <li>To generate anonymized statistics for public transparency.</li>
                    </ul>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>3. Data Security</h2>
                    <p style={{ marginBottom: 24 }}>We implement industry-standard security measures including encrypted passwords, secure JWT authentication, and HTTPS communication to protect your personal data. Your password is never stored in plain text.</p>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>4. Data Sharing</h2>
                    <p style={{ marginBottom: 24 }}>We do not sell your personal information. Complaint data may be shared with relevant municipal departments solely for issue resolution. Public complaint feeds do not display personal phone numbers.</p>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>5. Your Rights</h2>
                    <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                        <li>You can update your profile information at any time.</li>
                        <li>You can request deletion of your account by contacting us.</li>
                        <li>You can access your activity logs through your dashboard.</li>
                    </ul>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>6. Contact Us</h2>
                    <p>For privacy-related queries, contact us at:</p>
                    <p style={{ marginTop: 8 }}>
                        📧 <a href="https://mail.google.com/mail/?view=cm&to=helpcivicfix@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00b894', fontWeight: 600 }}>helpcivicfix@gmail.com</a><br />
                        📞 <a href="tel:+918799900877" style={{ color: '#00b894', fontWeight: 600 }}>+91 8799900877</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
