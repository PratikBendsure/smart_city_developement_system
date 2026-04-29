const express = require('express');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');
const { logActivity } = require('../utils/logActivity');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, adminOnly);

// @route  GET /api/admin/complaints
router.get('/complaints', async (req, res) => {
    try {
        const { status, category, page = 1, limit = 20, search } = req.query;
        const query = {};

        if (status) query.status = status;
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { trackingId: { $regex: search, $options: 'i' } },
                { title: { $regex: search, $options: 'i' } },
                { 'location.address': { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Complaint.countDocuments(query);
        const complaints = await Complaint.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit))
            .populate('userId', 'name email phone');

        res.json({
            success: true,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
            complaints
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  PUT /api/admin/complaints/:id/status
router.put('/complaints/:id/status', async (req, res) => {
    try {
        const { status, note, assignedTo, assignedDepartment } = req.body;
        const validStatuses = ['pending', 'in_progress', 'resolved', 'rejected', 'escalated'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const update = {
            status,
            $push: {
                statusHistory: { status, updatedBy: req.user.name, note: note || '' },
                ...(note ? { comments: { text: note, author: req.user.name, role: req.user.role } } : {})
            }
        };

        if (assignedTo) update.assignedTo = assignedTo;
        if (assignedDepartment) update.assignedDepartment = assignedDepartment;
        if (status === 'resolved') {
            update.resolvedAt = new Date();
            update.resolutionNote = note;
        }

        const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

        logActivity({
            userId: req.user._id, userName: req.user.name, userEmail: req.user.email,
            action: 'admin_status_update',
            details: {
                complaintId: complaint._id,
                trackingId: complaint.trackingId,
                newStatus: status,
                note: note || '',
                assignedTo: assignedTo || '',
                assignedDepartment: assignedDepartment || ''
            }
        }, req);

        // Update user stats if resolved
        if (status === 'resolved' && complaint.userId) {
            await User.findByIdAndUpdate(complaint.userId, { $inc: { resolvedReports: 1 } });
        }

        res.json({ success: true, complaint });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/admin/stats
router.get('/stats', async (req, res) => {
    try {
        const [total, pending, inProgress, resolved, rejected, escalated, totalUsers, newUsersToday] = await Promise.all([
            Complaint.countDocuments(),
            Complaint.countDocuments({ status: 'pending' }),
            Complaint.countDocuments({ status: 'in_progress' }),
            Complaint.countDocuments({ status: 'resolved' }),
            Complaint.countDocuments({ status: 'rejected' }),
            Complaint.countDocuments({ status: 'escalated' }),
            User.countDocuments({ role: 'citizen' }),
            User.countDocuments({ createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } })
        ]);

        const byCategory = await Complaint.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } } } },
            { $sort: { count: -1 } }
        ]);

        const overdue = await Complaint.countDocuments({
            status: { $in: ['pending', 'in_progress'] },
            targetResolutionAt: { $lt: new Date() }
        });

        const last30Days = await Complaint.aggregate([
            { $match: { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } } } },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            stats: { total, pending, inProgress, resolved, rejected, escalated, overdue, totalUsers, newUsersToday, byCategory, last30Days }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// @route  GET /api/admin/users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: 'citizen' }).sort({ createdAt: -1 }).limit(50);
        res.json({ success: true, users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = router;
