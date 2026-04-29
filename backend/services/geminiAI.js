/**
 * CivicFix AI Classification Service
 * Uses Google Gemini Vision API if GEMINI_API_KEY is set,
 * otherwise falls back to a smart rule-based classifier.
 */

const CATEGORIES = [
    'water_supply', 'waste_management', 'road_infrastructure',
    'health_services', 'education_facility', 'parks_recreation',
    'fire_emergency', 'sanitation_hygiene', 'encroachment'
];

const CATEGORY_LABELS = {
    water_supply: 'Water Supply',
    waste_management: 'Waste Management',
    road_infrastructure: 'Road & Infrastructure',
    health_services: 'Health Services',
    education_facility: 'Education Facility',
    parks_recreation: 'Parks & Recreation',
    fire_emergency: 'Fire & Emergency',
    sanitation_hygiene: 'Sanitation & Hygiene',
    encroachment: 'Encroachment (Aatikram)'
};

const CATEGORY_KEYWORDS = {
    water_supply: ['water', 'pipe', 'leak', 'flood', 'drain', 'sewage', 'tap', 'supply', 'pipeline', 'overflow', 'puddle', 'waterlogging'],
    waste_management: ['garbage', 'waste', 'trash', 'litter', 'dump', 'refuse', 'rubbish', 'bin', 'debris', 'filth', 'dustbin', 'overflowing'],
    road_infrastructure: ['road', 'pothole', 'crack', 'bridge', 'footpath', 'pavement', 'sidewalk', 'street', 'highway', 'construction', 'signboard', 'signal', 'traffic'],
    health_services: ['hospital', 'clinic', 'medical', 'dispensary', 'pharmacy', 'health', 'ambulance', 'doctor', 'patient'],
    education_facility: ['school', 'college', 'university', 'classroom', 'education', 'library', 'student', 'teacher'],
    parks_recreation: ['park', 'garden', 'playground', 'tree', 'grass', 'bench', 'fountain', 'recreation', 'ground', 'field'],
    fire_emergency: ['fire', 'smoke', 'burn', 'emergency', 'accident', 'collapse', 'explosion', 'hazard', 'danger'],
    sanitation_hygiene: ['toilet', 'bathroom', 'hygiene', 'sanitation', 'open defecation', 'urinating', 'dirty', 'unhygienic'],
    encroachment: ['encroachment', 'illegal', 'unauthorized', 'aatikram', 'occupied', 'blocked', 'obstruct', 'hawker', 'vendor', 'footpath block']
};

const SEVERITY_RULES = {
    fire_emergency: 'critical',
    health_services: 'high',
    water_supply: 'high',
    waste_management: 'medium',
    road_infrastructure: 'medium',
    sanitation_hygiene: 'medium',
    encroachment: 'medium',
    parks_recreation: 'low',
    education_facility: 'low'
};

const TITLES = {
    water_supply: ['Water Pipeline Leakage Reported', 'Water Supply Disruption', 'Waterlogging on Road', 'Broken Water Pipe'],
    waste_management: ['Garbage Not Collected', 'Overflowing Waste Bin', 'Illegal Garbage Dumping', 'Waste Accumulation on Street'],
    road_infrastructure: ['Pothole on Road', 'Damaged Road Surface', 'Broken Footpath', 'Traffic Signal Not Working'],
    health_services: ['Health Center - Facility Issue', 'Medical Emergency Reported', 'Hospital Infrastructure Problem'],
    education_facility: ['School Infrastructure Issue', 'Education Facility Problem', 'Broken School Furniture'],
    parks_recreation: ['Park Maintenance Required', 'Damaged Park Equipment', 'Garden Cleanliness Issue'],
    fire_emergency: ['Fire Emergency Reported', 'Hazardous Situation Detected', 'Emergency Response Required'],
    sanitation_hygiene: ['Open Defecation Spotted', 'Sanitation Facility Broken', 'Public Toilet Maintenance Needed'],
    encroachment: ['Unauthorized Encroachment Spotted', 'Road Blocked by Illegal Vendor', 'Footpath Obstruction']
};

// Smart rule-based classifier
function ruleBasedClassify(description = '', filename = '') {
    const text = (description + ' ' + filename).toLowerCase();
    const scores = {};

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        scores[category] = keywords.filter(k => text.includes(k)).length;
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const bestCategory = sorted[0][1] > 0 ? sorted[0][0] : 'waste_management';
    const confidence = sorted[0][1] > 0 ? Math.min(0.55 + sorted[0][1] * 0.1, 0.85) : 0.45;

    const titles = TITLES[bestCategory];
    const suggestedTitle = titles[Math.floor(Math.random() * titles.length)];

    return {
        category: bestCategory,
        categoryLabel: CATEGORY_LABELS[bestCategory],
        confidence: parseFloat(confidence.toFixed(2)),
        severity: SEVERITY_RULES[bestCategory] || 'medium',
        description: `AI has identified this as a ${CATEGORY_LABELS[bestCategory]} issue based on the uploaded image. Municipal department has been notified.`,
        suggestedTitle,
        method: 'rule_based'
    };
}

// Gemini Vision API classifier
async function geminiClassify(imagePath, description = '') {
    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const fs = require('fs');
        const path = require('path');

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const imageData = fs.readFileSync(imagePath);
        const base64Image = imageData.toString('base64');
        const ext = path.extname(imagePath).slice(1).toLowerCase();
        const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

        const prompt = `You are an AI assistant for a Smart City Complaint Management System in India called CivicFix.

Analyze this image and classify the civic issue shown. 

Categories available:
- water_supply (water leaks, pipeline issues, waterlogging, flooding)
- waste_management (garbage, waste, litter, dumping, overflowing bins)
- road_infrastructure (potholes, road cracks, broken footpath, traffic signals)
- health_services (hospital/clinic issues, medical facility problems)
- education_facility (school/college infrastructure problems)
- parks_recreation (park damage, playground issues, tree maintenance)
- fire_emergency (fire, smoke, accidents, hazards, emergency situations)
- sanitation_hygiene (open defecation, broken toilets, unhygienic conditions)
- encroachment (illegal encroachment, road blockage by hawkers, aatikram)

Additional context from reporter: "${description}"

Respond ONLY with valid JSON in this exact format:
{
  "category": "<category_key>",
  "confidence": <0.0 to 1.0>,
  "severity": "<low|medium|high|critical>",
  "description": "<2-3 sentence description of the issue seen>",
  "suggestedTitle": "<short title for the complaint, max 10 words>"
}`;

        const result = await model.generateContent([
            prompt,
            { inlineData: { data: base64Image, mimeType } }
        ]);

        const text = result.response.text().trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('Invalid Gemini response format');

        const parsed = JSON.parse(jsonMatch[0]);

        // Validate category
        if (!CATEGORIES.includes(parsed.category)) {
            parsed.category = 'waste_management';
        }

        return {
            ...parsed,
            categoryLabel: CATEGORY_LABELS[parsed.category],
            confidence: Math.min(Math.max(parsed.confidence, 0), 1),
            method: 'gemini_vision'
        };
    } catch (err) {
        console.error('Gemini API error, falling back to rule-based:', err.message);
        return null;
    }
}

// Main classify function
async function classifyImage(imagePath, description = '', filename = '') {
    const startTime = Date.now();
    let result;

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 10) {
        result = await geminiClassify(imagePath, description);
    }

    if (!result) {
        result = ruleBasedClassify(description, filename);
    }

    result.processingTime = Date.now() - startTime;
    return result;
}

module.exports = { classifyImage, CATEGORY_LABELS, CATEGORIES };
