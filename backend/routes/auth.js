const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { logActivity } = require('../utils/logActivity');
const { sendOtpEmail, sendOtpSms } = require('../services/emailService');

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// @route  POST /api/auth/register
// @desc   Register new user
router.post('/register', async (req, res) => {
    try {
        const { name, email, phone, password, language, city } = req.body;

        // Check if email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: 'This email is already in use. Please login or use a different email.' });
        }

        // Check if phone already exists
        if (phone) {
            const existingPhone = await User.findOne({ phone });
            if (existingPhone) {
                return res.status(400).json({ success: false, message: 'This phone number is already in use. Please use a different number.' });
            }
        }

        const user = await User.create({ name, email, phone, password, language: language || 'en', city: city || 'Mumbai' });

        const token = generateToken(user._id);

        logActivity({
            userId: user._id, userName: user.name, userEmail: user.email,
            action: 'register',
            details: { city: user.city, language: user.language }
        }, req);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id, name: user.name, email: user.email,
                phone: user.phone, role: user.role, language: user.language,
                city: user.city, totalReports: 0, resolvedReports: 0
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern || {})[0];
            if (field === 'phone') {
                return res.status(400).json({ success: false, message: 'This phone number is already in use. Please use a different number.' });
            }
            return res.status(400).json({ success: false, message: 'This email is already in use. Please login or use a different email.' });
        }
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('[LOGIN DEBUG] Attempting login for:', email);
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log('[LOGIN DEBUG] No user found with email:', email);
            // List all users for debugging
            const allUsers = await User.find({}, 'email name');
            console.log('[LOGIN DEBUG] All users in DB:', allUsers.map(u => u.email));
            return res.status(401).json({ success: false, message: 'Invalid credentials — no account found with this email. Please sign up first.' });
        }

        console.log('[LOGIN DEBUG] User found:', user.email, '| Has password:', !!user.password, '| Password length:', user.password?.length);
        const isMatch = await user.comparePassword(password);
        console.log('[LOGIN DEBUG] Password match result:', isMatch);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials — incorrect password. Please try again.' });
        }

        const token = generateToken(user._id);

        logActivity({
            userId: user._id, userName: user.name, userEmail: user.email,
            action: 'login',
            details: { role: user.role }
        }, req);

        res.json({
            success: true,
            token,
            user: {
                id: user._id, name: user.name, email: user.email,
                phone: user.phone, role: user.role, language: user.language,
                city: user.city, totalReports: user.totalReports, resolvedReports: user.resolvedReports
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const { name, phone, language, city } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, language, city },
            { new: true, runValidators: true }
        );

        logActivity({
            userId: user._id, userName: user.name, userEmail: user.email,
            action: 'profile_update',
            details: { name, phone, language, city }
        }, req);

     res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/auth/forgot-password
// @desc   Generate OTP and send via email or phone
router.post('/forgot-password', async (req, res) => {
    try {
        const { email, phone, method } = req.body; // method: 'email' or 'phone'

        let user;
        if (method === 'phone') {
            // Phone method: find user by phone number
            if (!phone) {
                return res.status(400).json({ success: false, message: 'Please provide your phone number' });
            }
            user = await User.findOne({ phone });
            if (!user) {
                return res.status(404).json({ success: false, message: 'No account found with this phone number. Please sign up first.' });
            }
        } else {
            // Email method: find user by email
            if (!email) {
                return res.status(400).json({ success: false, message: 'Please provide your email address' });
            }
            user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ success: false, message: 'No account found with this email address. Please sign up first.' });
            }
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Store OTP on user record
        await User.updateOne(
            { _id: user._id },
            { $set: { otp, otpExpires } }
        );

        // Mask email/phone for display
        const userEmail = user.email;
        const userPhone = user.phone;
        const maskedEmail = userEmail ? userEmail.replace(/(^.{2})(.*)(@.*)/, '$1***$3') : null;
        const maskedPhone = userPhone ? userPhone.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2') : null;

        let sentVia = method || 'email';

        // Try to send via configured service
        if (sentVia === 'phone' && userPhone) {
            await sendOtpSms(userPhone, otp, user.name);
        } else if (userEmail) {
            const emailResult = await sendOtpEmail(userEmail, otp, user.name);
            if (!emailResult.success) {
                console.log(`⚠️  Email not configured — OTP shown in app for development.`);
            }
            sentVia = 'email';
        }

        console.log(`\n🔑 OTP for ${userEmail || userPhone}: ${otp} (expires in 10 minutes)\n`);

        res.json({
            success: true,
            message: sentVia === 'phone'
                ? `OTP sent to your phone ${maskedPhone}`
                : `OTP sent to your email ${maskedEmail}`,
            sentVia,
            userEmail: userEmail, // needed for verify/reset steps
            maskedEmail,
            maskedPhone,
            hasPhone: !!userPhone,
            otp: otp, // included for development — remove in production
            expiresIn: '10 minutes'
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/auth/verify-otp
// @desc   Verify OTP is valid
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
        }

        const user = await User.findOne({ email }).select('+otp +otpExpires');
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found with this email' });
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ success: false, message: 'No OTP was requested for this account. Please request a new OTP.' });
        }

        if (new Date() > user.otpExpires) {
            // Clear expired OTP
            await User.updateOne({ _id: user._id }, { $unset: { otp: 1, otpExpires: 1 } });
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
        }

        res.json({ success: true, message: 'OTP verified successfully. You can now set a new password.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/auth/reset-password
// @desc   Reset password after OTP verification
router.post('/reset-password', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const user = await User.findOne({ email }).select('+otp +otpExpires +password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found with this email' });
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ success: false, message: 'No OTP was requested. Please request a new OTP first.' });
        }

        if (new Date() > user.otpExpires) {
            await User.updateOne({ _id: user._id }, { $unset: { otp: 1, otpExpires: 1 } });
            return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
        }

        // Set new password (triggers the pre-save bcrypt hook)
        user.password = newPassword;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        logActivity({
            userId: user._id, userName: user.name, userEmail: user.email,
            action: 'password_reset',
            details: { method: 'otp' }
        }, req);

        res.json({ success: true, message: 'Password has been reset successfully! You can now login with your new password.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;

