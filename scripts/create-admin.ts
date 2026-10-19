import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { randomUUID } from 'crypto';

async function createAdmin() {
    console.log('👤 Creating admin user...\n');

    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'gv855719@gmail.com';
        const adminName = 'Admin User';

        // Create admin user with auto-approved status
        const [admin] = await db
            .insert(users)
            .values({
                id: randomUUID(),
                email: adminEmail,
                name: adminName,
                role: 'admin',
                approvalStatus: 'approved',
                approvedAt: new Date(),
            })
            .returning();

        console.log('✅ Admin user created successfully!');
        console.log('\n📧 Admin Details:');
        console.log(`   Email: ${admin.email}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Role: ${admin.role}`);
        console.log(`   ID: ${admin.id}`);
        console.log(`   Status: ${admin.approvalStatus}`);
        console.log('\n💡 Note: You\'ll need to set up authentication separately.');
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        throw error;
    }
}

createAdmin()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
