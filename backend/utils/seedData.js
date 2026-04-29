/**
 * Seed script — creates admin user + 50 sample complaints
 * Run: node utils/seedData.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

const CATEGORIES = [
    'water_supply', 'waste_management', 'road_infrastructure',
    'health_services', 'education_facility', 'parks_recreation',
    'fire_emergency', 'sanitation_hygiene', 'encroachment'
];

const LOCATIONS = [
    { address: 'MG Road, Sector 12, Andheri West', ward: 'Ward 5', city: 'Mumbai' },
    { address: 'NH-48 Flyover Exit, Bandra', ward: 'Ward 3', city: 'Mumbai' },
    { address: 'Laxmi Nagar Colony, Pune', ward: 'Ward 7', city: 'Pune' },
    { address: 'Park Avenue, Block C, Nashik', ward: 'Ward 2', city: 'Nashik' },
    { address: 'Gandhi Chowk, Mahabaleshwar', ward: 'Ward 1', city: 'Satara' },
    { address: 'Station Road, Kolhapur', ward: 'Ward 4', city: 'Kolhapur' },
    { address: 'Rajiv Gandhi Nagar, Nagpur', ward: 'Ward 8', city: 'Nagpur' },
    { address: 'Civil Lines, Aurangabad', ward: 'Ward 6', city: 'Aurangabad' },
    { address: 'Shivaji Nagar, Solapur', ward: 'Ward 9', city: 'Solapur' },
    { address: 'Old City, Thane West', ward: 'Ward 10', city: 'Thane' },
    { address: 'Indiranagar, Bengaluru', ward: 'Ward 11', city: 'Bengaluru' },
    { address: 'T Nagar, Chennai', ward: 'Ward 12', city: 'Chennai' }
];

const TITLES = {
    water_supply: ['Water Pipe Burst on Main Road', 'No Water Supply Since 3 Days', 'Waterlogging Near School', 'Broken Municipal Tap'],
    waste_management: ['Garbage Pile Not Collected for 5 Days', 'Overflowing Dustbin', 'Illegal Garbage Dumping Near Park', 'Waste on Footpath'],
    road_infrastructure: ['Large Pothole Near Highway', 'Road Caved In After Rain', 'Broken Street Light on Main Road', 'Footpath Blocked by Debris'],
    health_services: ['PHC Closed During Working Hours', 'Medicines Unavailable at Govt Dispensary', 'No Doctor at Community Health Center'],
    education_facility: ['School Roof Leaking', 'No Benches in Classroom', 'Broken Boundary Wall of School', 'Girls Toilet Not Functional'],
    parks_recreation: ['Park Benches Broken', 'Garden Not Maintained for Months', 'Playground Equipment Damaged', 'Overgrown Weeds in Garden'],
    fire_emergency: ['Gas Cylinder Leakage Reported', 'Building Structure Collapse Risk', 'Open Electrical Wires on Street', 'Transformer Sparking'],
    sanitation_hygiene: ['Open Defecation Near Residential Area', 'Public Toilet Very Unhygienic', 'Drainage Blocked Causing Smell', 'Sewer Overflow on Road'],
    encroachment: ['Footpath Blocked by Vendor', 'Illegal Construction Ongoing', 'Road Occupied by Hawkers', 'Encroachment on Govt Land']
};

const STATUSES = ['pending', 'in_progress', 'resolved', 'pending', 'in_progress', 'resolved', 'resolved', 'pending'];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

function randomFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function seedDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Complaint.deleteMany({});
        console.log('🗑️  Cleared existing data');

        // Create admin user
        const admin = await User.create({
            name: 'Municipal Admin',
            email: 'admin@civicfix.com',
            password: 'admin123',
            role: 'admin',
            phone: '9876543210',
            city: 'Mumbai'
        });
        console.log('👤 Admin created: admin@civicfix.com / admin123');

        // Create regular user
        const user1 = await User.create({
            name: 'Rahul Sharma',
            email: 'rahul@example.com',
            password: 'password123',
            role: 'citizen',
            phone: '9123456780',
            city: 'Mumbai',
            language: 'hi'
        });

        const user2 = await User.create({
            name: 'Priya Patel',
            email: 'priya@example.com',
            password: 'password123',
            role: 'citizen',
            phone: '9234567890',
            city: 'Pune',
            language: 'mr'
        });
        console.log('👤 Test users created');

        // Create 50 sample complaints
        const complaints = [];
        for (let i = 0; i < 50; i++) {
            const category = CATEGORIES[i % CATEGORIES.length];
            const status = STATUSES[i % STATUSES.length];
            const location = LOCATIONS[i % LOCATIONS.length];
            const titlesForCat = TITLES[category];
            const title = titlesForCat[Math.floor(Math.random() * titlesForCat.length)];
            const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];

            const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
            const complaint = {
                trackingId: 'CF-' + (100000 + i).toString(36).toUpperCase(),
                userId: i % 3 === 0 ? user1._id : user2._id,
                reporterName: i % 2 === 0 ? 'Rahul Sharma' : 'Priya Patel',
                category,
                title,
                description: `This issue has been ongoing for quite some time and needs immediate attention from the municipal corporation. Residents in the area are facing significant inconvenience.`,
                location,
                severity,
                priority: severity === 'critical' ? 'urgent' : severity,
                status,
                aiAnalysis: {
                    category,
                    confidence: parseFloat((0.6 + Math.random() * 0.35).toFixed(2)),
                    severity,
                    description: `AI detected a ${category.replace('_', ' ')} issue in the uploaded image.`,
                    suggestedTitle: title,
                    method: 'rule_based'
                },
                upvotes: Math.floor(Math.random() * 25),
                statusHistory: [
                    { status: 'pending', updatedBy: 'system', note: 'Complaint received', timestamp: createdAt }
                ],
                createdAt,
                targetResolutionAt: new Date(createdAt.getTime() + 24 * 60 * 60 * 1000),
                isPublic: true,
                language: ['en', 'hi', 'mr', 'kn', 'ta'][i % 5]
            };

            if (status === 'in_progress' || status === 'resolved') {
                complaint.statusHistory.push({
                    status: 'in_progress',
                    updatedBy: 'Municipal Admin',
                    note: 'Team dispatched',
                    timestamp: new Date(createdAt.getTime() + 4 * 60 * 60 * 1000)
                });
                complaint.assignedTo = 'Ward Officer';
                complaint.assignedDepartment = 'Municipal Corporation';
            }

            if (status === 'resolved') {
                const resolvedAt = new Date(createdAt.getTime() + Math.random() * 20 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000);
                complaint.statusHistory.push({
                    status: 'resolved',
                    updatedBy: 'Municipal Admin',
                    note: 'Issue has been resolved',
                    timestamp: resolvedAt
                });
                complaint.resolvedAt = resolvedAt;
                complaint.resolutionNote = 'Issue resolved by the municipal team within the target time.';
            }

            complaints.push(complaint);
        }

        await Complaint.insertMany(complaints);
        console.log(`✅ Created ${complaints.length} sample complaints`);

        // Update user report counts
        await User.findByIdAndUpdate(user1._id, { totalReports: 17, resolvedReports: 10 });
        await User.findByIdAndUpdate(user2._id, { totalReports: 17, resolvedReports: 8 });

        console.log('\n🎉 Database seeded successfully!');
        console.log('📧 Admin login: admin@civicfix.com / admin123');
        console.log('📧 User login: rahul@example.com / password123');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seedDB();
