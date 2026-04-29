export default function TermsOfUse() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f1923, #1a2634)', padding: '48px 0 32px', color: 'white' }}>
                <div className="container">
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>📋 Terms of Use</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>Last updated: February 2026</p>
                </div>
            </div>
            <div className="container" style={{ maxWidth: 800, padding: '40px 20px' }}>
                <div style={{ background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', lineHeight: 1.8, fontSize: 15, color: '#2d3436' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>1. Acceptance of Terms</h2>
                    <p style={{ marginBottom: 24 }}>By accessing and using CivicFix, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our services.</p>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>2. Use of Service</h2>
                    <p>CivicFix is a civic complaint management platform. You agree to:</p>
                    <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                        <li>Submit only genuine and accurate civic complaints.</li>
                        <li>Provide truthful information during registration.</li>
                        <li>Not misuse the platform for false or malicious reports.</li>
                        <li>Not attempt to disrupt or compromise the service.</li>
                    </ul>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>3. User Accounts</h2>
                    <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You must be at least 13 years old to create an account.</li>
                        <li>One person may not maintain more than one account.</li>
                        <li>We reserve the right to suspend accounts that violate these terms.</li>
                    </ul>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>4. Complaint Submissions</h2>
                    <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                        <li>Submitted complaints are reviewed by municipal officers and may be made publicly visible.</li>
                        <li>Images uploaded must be relevant to the reported issue.</li>
                        <li>False or frivolous reports may result in account action.</li>
                        <li>Resolution timelines are targets, not guarantees.</li>
                    </ul>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>5. Intellectual Property</h2>
                    <p style={{ marginBottom: 24 }}>The CivicFix platform, including its design, code, and content, is protected by intellectual property laws. You may not reproduce, distribute, or create derivative works without written permission.</p>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>6. Limitation of Liability</h2>
                    <p style={{ marginBottom: 24 }}>CivicFix is provided "as is" without warranties. We are not liable for delays in complaint resolution, data loss due to unforeseen circumstances, or actions taken by municipal authorities.</p>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>7. Contact</h2>
                    <p>For questions about these terms, reach out to:</p>
                    <p style={{ marginTop: 8 }}>
                        📧 <a href="https://mail.google.com/mail/?view=cm&to=helpcivicfix@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00b894', fontWeight: 600 }}>helpcivicfix@gmail.com</a><br />
                        📞 <a href="tel:+918799900877" style={{ color: '#00b894', fontWeight: 600 }}>+91 8799900877</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
