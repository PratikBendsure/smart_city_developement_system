/**
 * Internal seed function — called directly from server after DB is connected.
 * Ensures the admin account always exists with working credentials.
 * Never deletes any existing user data.
 */
const bcrypt = require('bcryptjs');

async function seedDatabase() {
    const User = require('../models/User');

    const ADMIN_EMAIL = 'admin@civicfix.com';
    const ADMIN_PASSWORD = 'admin123';

    try {
        // Check if admin exists by email
        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

        if (!existingAdmin) {
            // Admin doesn't exist — create it
            await User.create({
                name: 'Municipal Admin',
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                role: 'admin',
                phone: '9876543210',
                city: 'Mumbai'
            });
            console.log('✅ Created admin account: admin@civicfix.com / admin123');
        } else {
            // Admin exists — verify its password works, reset if needed
            const passwordWorks = await bcrypt.compare(ADMIN_PASSWORD, existingAdmin.password);
            if (!passwordWorks) {
                // Password is corrupted/changed — reset it
                const salt = await bcrypt.genSalt(12);
                const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
                await User.updateOne(
                    { email: ADMIN_EMAIL },
                    { $set: { password: hashedPassword, role: 'admin' } }
                );
                console.log('🔄 Admin password was corrupted — reset to: admin@civicfix.com / admin123');
            } else {
                console.log('✅ Admin account verified: admin@civicfix.com / admin123');
            }
        }

        const totalUsers = await User.countDocuments();
        console.log(`📊 Total users in database: ${totalUsers}`);
    } catch (e) {
        console.error('Seed error:', e.message);
    }
}

module.exports = { seedDatabase };
