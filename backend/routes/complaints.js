const express = require('express');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { classifyImage } = require('../services/geminiAI');
const path = require('path');
const { logActivity } = require('../utils/logActivity');

const router = express.Router();

// @route  POST /api/complaints
// @desc   Submit new complaint with image
router.post('/', optionalAuth, upload.single('image'), async (req, res) => {
    try {
        const { category, title, description, address, ward, city, lat, lng, reporterName, reporterPhone, language } = req.body;

        if (!address) {
            return res.status(400).json({ success: false, message: 'Location address is required' });
        }

        let aiAnalysis = null;
        let imageUrl = null;

        // Process uploaded image with AI
        if (req.file) {
            imageUrl = `/uploads/${req.file.filename}`;
            try {
                aiAnalysis = await classifyImage(
                    req.file.path,
                    description || '',
                    req.file.originalname
                );
            } catch (aiErr) {
                console.error('AI classification failed:', aiErr.message);
            }
        }

        // Use AI-detected category if user didn't select one
        const finalCategory = category || (aiAnalysis && aiAnalysis.category) || 'waste_management';
        const finalTitle = title || (aiAnalysis && aiAnalysis.suggestedTitle) || `${finalCategory} Issue Reported`;
        const finalSeverity = (aiAnalysis && aiAnalysis.severity) || 'medium';

        // Determine priority
        const priorityMap = { low: 'low', medium: 'medium', high: 'high', critical: 'urgent' };
        const priority = priorityMap[finalSeverity] || 'medium';

        const complaintData = {
            category: finalCategory,
            title: finalTitle,
            description: description || '',
            location: {
                address,
                ward: ward || '',
                city: city || 'Mumbai',
                coordinates: { lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0 }
            },
            imageUrl,
            severity: finalSeverity,
            priority,
            language: language || 'en',
            reporterName: reporterName || (req.user ? req.user.name : 'Anonymous'),
            reporterPhone: reporterPhone || (req.user ? req.user.phone : ''),
            statusHistory: [{ status: 'pending', updatedBy: 'system', note: 'Complaint received' }]
        };

        if (aiAnalysis) {
            complaintData.aiAnalysis = aiAnalysis;
        }

        if (req.user) {
            complaintData.userId = req.user._id;
            await User.findByIdAndUpdate(req.user._id, { $inc: { totalReports: 1 } });
        }

        const complaint = await Complaint.create(complaintData);

        logActivity({
            userId: req.user ? req.user._id : null,
            userName: req.user ? req.user.name : (reporterName || 'Anonymous'),
            userEmail: req.user ? req.user.email : '',
            action: 'submit_complaint',
            details: {
                complaintId: complaint._id,
                trackingId: complaint.trackingId,
                category: complaint.category,
                title: complaint.title,
                severity: complaint.severity
            }
        }, req);

        res.status(201).json({
            success: true,
            message: 'Complaint submitted successfully!',
            complaint: {
                _id: complaint._id,
                trackingId: complaint.trackingId,
                category: complaint.category,
                title: complaint.title,
                status: complaint.status,
                severity: complaint.severity,
                aiAnalysis: complaint.aiAnalysis,
                targetResolutionAt: complaint.targetResolutionAt,
                createdAt: complaint.createdAt
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/complaints/stats
// @desc   Public stats
router.get('/stats', async (req, res) => {
    try {
        const [total, pending, inProgress, resolved, rejected] = await Promise.all([
            Complaint.countDocuments(),
            Complaint.countDocuments({ status: 'pending' }),
            Complaint.countDocuments({ status: 'in_progress' }),
            Complaint.countDocuments({ status: 'resolved' }),
            Complaint.countDocuments({ status: 'rejected' })
        ]);

        const byCategory = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        const last7Days = await Complaint.aggregate([
            { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
            { $sort: { _id: 1 } }
        ]);

        const avgResolutionTime = await Complaint.aggregate([
            { $match: { status: 'resolved', resolvedAt: { $exists: true } } },
            { $project: { hours: { $divide: [{ $subtract: ['$resolvedAt', '$createdAt'] }, 3600000] } } },
            { $group: { _id: null, avgHours: { $avg: '$hours' } } }
        ]);

        res.json({
            success: true,
            stats: {
                total, pending, inProgress, resolved, rejected,
                resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
                avgResolutionHours: avgResolutionTime[0]?.avgHours?.toFixed(1) || 0,
                byCategory,
                last7Days
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/complaints/public
// @desc   Public feed of recent complaints
router.get('/public', async (req, res) => {
    try {
        const complaints = await Complaint.find({ isPublic: true })
            .sort({ createdAt: -1 })
            .limit(20)
            .select('-userId -reporterPhone');
        res.json({ success: true, complaints });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/complaints/track/:trackingId
// @desc   Track complaint by ID (public)
router.get('/track/:trackingId', async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ trackingId: req.params.trackingId.toUpperCase() })
            .select('-reporterPhone');
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found. Check the tracking ID.' });
        }
        res.json({ success: true, complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/complaints
// @desc   Get user's own complaints
router.get('/', protect, async (req, res) => {
    try {
        const complaints = await Complaint.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.json({ success: true, complaints });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  POST /api/complaints/:id/upvote
router.post('/:id/upvote', optionalAuth, async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);
        if (!complaint) return res.status(404).json({ success: false, message: 'Not found' });
        complaint.upvotes = (complaint.upvotes || 0) + 1;
        await complaint.save();

        logActivity({
            userId: req.user ? req.user._id : null,
            userName: req.user ? req.user.name : 'Anonymous',
            userEmail: req.user ? req.user.email : '',
            action: 'upvote',
            details: { complaintId: complaint._id, trackingId: complaint.trackingId }
        }, req);

        res.json({ success: true, upvotes: complaint.upvotes });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
