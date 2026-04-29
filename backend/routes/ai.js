const express = require('express');
const upload = require('../middleware/upload');
const { classifyImage } = require('../services/geminiAI');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// @route  POST /api/ai/classify
// @desc   Classify uploaded image using AI (no complaint saved)
router.post('/classify', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const { description } = req.body;
        const startTime = Date.now();

        const result = await classifyImage(
            req.file.path,
            description || '',
            req.file.originalname
        );

        // Clean up temp file after classification if no complaint is being created
        // (keep it if it's being used in a subsequent complaint submission)
        // We keep it so the UI can show preview and then submit

        res.json({
            success: true,
            analysis: {
                ...result,
                imageUrl: `/uploads/${req.file.filename}`,
                filename: req.file.filename
            }
        });
    } catch (err) {
        console.error('AI classify error:', err);
        res.status(500).json({ success: false, message: 'AI classification failed: ' + err.message });
    }
});

module.exports = router;
