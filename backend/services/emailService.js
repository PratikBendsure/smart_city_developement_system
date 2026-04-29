/**
 * Email service for sending OTP emails using Nodemailer.
 * Configure SMTP settings in .env file.
 */
const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }
    return transporter;
}

/**
 * Send OTP via email
 */
async function sendOtpEmail(toEmail, otp, userName) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('⚠️  Email not configured (EMAIL_USER / EMAIL_PASS missing in .env)');
        console.log(`📧 OTP for ${toEmail}: ${otp}`);
        return { success: false, reason: 'Email service not configured' };
    }

    try {
        const mailOptions = {
            from: `"CivicFix" <${process.env.EMAIL_USER}>`,
            to: toEmail,
            subject: '🔐 CivicFix Password Reset OTP',
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: linear-gradient(135deg, #00b894, #0984e3); padding: 32px 24px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 800;">🏙️ CivicFix</h1>
                        <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Smart City Complaint Management</p>
                    </div>
                    <div style="padding: 32px 24px;">
                        <p style="color: #334155; font-size: 16px; margin: 0 0 8px;">Hello <strong>${userName || 'User'}</strong>,</p>
                        <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                            You requested a password reset for your CivicFix account. Use the OTP below to verify your identity:
                        </p>
                        <div style="background: linear-gradient(135deg, #e8f7f0, #dff3fb); border: 2px dashed #00b894; border-radius: 14px; padding: 20px; text-align: center; margin: 0 0 24px;">
                            <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px; font-weight: 600;">Your OTP Code</p>
                            <p style="color: #0984e3; font-size: 36px; font-weight: 800; letter-spacing: 10px; margin: 0; font-family: monospace;">${otp}</p>
                        </div>
                        <p style="color: #94a3b8; font-size: 13px; margin: 0 0 16px;">⏱️ This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">If you didn't request this, please ignore this email — your password will remain unchanged.</p>
                    </div>
                    <div style="background: #1e293b; padding: 16px 24px; text-align: center;">
                        <p style="color: #94a3b8; font-size: 12px; margin: 0;">© 2026 CivicFix — Built for Smart City Initiative</p>
                    </div>
                </div>
            `
        };

        await getTransporter().sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${toEmail}`);
        return { success: true };
    } catch (err) {
        console.error('❌ Email send failed:', err.message);
        console.log(`📧 OTP for ${toEmail}: ${otp} (fallback — shown in console)`);
        return { success: false, reason: err.message };
    }
}

/**
 * Simulate sending OTP via SMS (placeholder for real SMS service like Twilio)
 */
async function sendOtpSms(phone, otp, userName) {
    // In production, integrate with Twilio, MSG91, or similar SMS service
    // For now, log to console as a simulation
    console.log(`\n📱 SMS OTP for ${phone}: ${otp} (simulated — no SMS service configured)\n`);
    return { success: true, simulated: true };
}

module.exports = { sendOtpEmail, sendOtpSms };
