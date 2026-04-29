const express = require('express');
const ActivityLog = require('../models/ActivityLog');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route  GET /api/activity
// @desc   Get all activity logs (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const { page = 1, limit = 50, action, userId } = req.query;
        const query = {};

        if (action) query.action = action;
        if (userId) query.userId = userId;

        const total = await ActivityLog.countDocuments(query);
        const logs = await ActivityLog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .populate('userId', 'name email role');

        res.json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            logs
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/activity/me
// @desc   Get current user's activity log
router.get('/me', protect, async (req, res) => {
    try {
        const { page = 1, limit = 30 } = req.query;
        const total = await ActivityLog.countDocuments({ userId: req.user._id });
        const logs = await ActivityLog.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        res.json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            logs
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/activity/logout
// @desc   Log a logout event
router.post('/logout', protect, async (req, res) => {
    try {
        const { logActivity } = require('../utils/logActivity');
        logActivity({
            userId: req.user._id, userName: req.user.name, userEmail: req.user.email,
            action: 'logout',
            details: {}
        }, req);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
