export default function RTI() {
    return (
        <div style={{ background: 'var(--bg)', minHeight: '80vh' }}>
            <div style={{ background: 'linear-gradient(135deg, #0f1923, #1a2634)', padding: '48px 0 32px', color: 'white' }}>
                <div className="container">
                    <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>📜 Right to Information (RTI)</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>Transparency and accountability in civic governance</p>
                </div>
            </div>
            <div className="container" style={{ maxWidth: 800, padding: '40px 20px' }}>
                <div style={{ background: 'white', borderRadius: 16, padding: 40, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', lineHeight: 1.8, fontSize: 15, color: '#2d3436' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>About RTI</h2>
                    <p style={{ marginBottom: 24 }}>The Right to Information Act, 2005, empowers citizens of India to request information from public authorities. CivicFix supports this right by providing transparent access to civic complaint data and resolution statistics.</p>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>Information Available on CivicFix</h2>
                    <ul style={{ paddingLeft: 24, marginBottom: 24 }}>
                        <li><strong>Complaint Statistics:</strong> Real-time data on total complaints, resolution rates, and category-wise breakdowns available on the <a href="/stats" style={{ color: '#00b894', fontWeight: 600 }}>Statistics</a> page.</li>
                        <li><strong>Public Complaint Feed:</strong> All public complaints and their current status are accessible to registered users.</li>
                        <li><strong>Resolution Timelines:</strong> Target resolution times and actual resolution data are publicly available.</li>
                        <li><strong>Department Performance:</strong> Category-wise and department-wise performance metrics.</li>
                    </ul>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>How to File an RTI Request</h2>
                    <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 24, marginBottom: 24 }}>
                        <ol style={{ paddingLeft: 24 }}>
                            <li style={{ marginBottom: 12 }}>Write your RTI application addressed to the Public Information Officer (PIO) of the relevant municipal department.</li>
                            <li style={{ marginBottom: 12 }}>Include specific details about the information you are seeking.</li>
                            <li style={{ marginBottom: 12 }}>Pay the prescribed application fee (₹10 for central government departments).</li>
                            <li style={{ marginBottom: 12 }}>Submit via post, in person, or through the online RTI portal at <a href="https://rtionline.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#00b894', fontWeight: 600 }}>rtionline.gov.in</a>.</li>
                            <li>You should receive a response within 30 days of submission.</li>
                        </ol>
                    </div>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>CivicFix's Commitment to Transparency</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                        {[
                            { icon: '📊', title: 'Open Data', desc: 'All complaint statistics are publicly accessible' },
                            { icon: '🔍', title: 'Trackable', desc: 'Every complaint gets a unique tracking ID' },
                            { icon: '📝', title: 'Audit Trail', desc: 'Complete status history for every complaint' },
                            { icon: '👥', title: 'Accountability', desc: 'Department assignments are recorded and tracked' }
                        ].map(item => (
                            <div key={item.title} style={{ background: '#f8f9fa', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                                <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                                <div style={{ fontWeight: 700, marginBottom: 4, color: '#0f1923' }}>{item.title}</div>
                                <div style={{ fontSize: 13, color: '#636e72' }}>{item.desc}</div>
                            </div>
                        ))}
                    </div>

                    <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#0f1923' }}>Contact for RTI Queries</h2>
                    <p>For RTI-related inquiries regarding CivicFix operations:</p>
                    <p style={{ marginTop: 8 }}>
                        📧 <a href="https://mail.google.com/mail/?view=cm&to=helpcivicfix@gmail.com" target="_blank" rel="noopener noreferrer" style={{ color: '#00b894', fontWeight: 600 }}>helpcivicfix@gmail.com</a><br />
                        📞 <a href="tel:+918799900877" style={{ color: '#00b894', fontWeight: 600 }}>+91 8799900877</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
