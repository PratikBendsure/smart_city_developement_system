const ActivityLog = require('../models/ActivityLog');

/**
 * Log a user activity to MongoDB
 * @param {Object} options
 * @param {string} options.userId - User ID (optional for anonymous)
 * @param {string} options.userName - User display name
 * @param {string} options.userEmail - User email
 * @param {string} options.action - Action type
 * @param {Object} options.details - Additional details about the action
 * @param {Object} req - Express request object (for IP and user agent)
 */
async function logActivity({ userId, userName, userEmail, action, details = {} }, req = null) {
    try {
        const logEntry = {
            userId: userId || null,
            userName: userName || 'Anonymous',
            userEmail: userEmail || '',
            action,
            details,
            ipAddress: req ? (req.headers['x-forwarded-for'] || req.connection?.remoteAddress || req.ip) : 'unknown',
            userAgent: req ? (req.headers['user-agent'] || 'unknown') : 'unknown'
        };

        // Fire and forget — don't block the main request
        ActivityLog.create(logEntry).catch(err => {
            console.error('Activity log error:', err.message);
        });
    } catch (err) {
        console.error('Activity log error:', err.message);
    }
}

module.exports = { logActivity };
