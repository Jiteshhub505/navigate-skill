import { db } from '@/lib/db';
import { durations, timings } from '@/lib/db/schema';

async function seedBasicData() {
    console.log('🌱 Seeding basic data...\n');

    try {
        // Insert Durations
        console.log('Adding durations...');
        const durationsData = [
            { name: '1 Month', value: 30, unit: 'days' },
            { name: '2 Months', value: 60, unit: 'days' },
            { name: '3 Months', value: 90, unit: 'days' },
            { name: '6 Months', value: 180, unit: 'days' },
            { name: '1 Year', value: 365, unit: 'days' },
        ];

        await db.insert(durations).values(durationsData);
        console.log(`✅ Added ${durationsData.length} durations\n`);

        // Insert Timings
        console.log('Adding timings...');
        const timingsData = [
            {
                name: 'Morning Batch (Mon/Wed/Fri)',
                startTime: '06:00 AM',
                endTime: '08:00 AM',
                days: ['Monday', 'Wednesday', 'Friday'],
            },
            {
                name: 'Morning Batch (Tue/Thu/Sat)',
                startTime: '06:00 AM',
                endTime: '08:00 AM',
                days: ['Tuesday', 'Thursday', 'Saturday'],
            },
            {
                name: 'Evening Batch (Mon/Wed/Fri)',
                startTime: '06:00 PM',
                endTime: '08:00 PM',
                days: ['Monday', 'Wednesday', 'Friday'],
            },
            {
                name: 'Evening Batch (Tue/Thu/Sat)',
                startTime: '06:00 PM',
                endTime: '08:00 PM',
                days: ['Tuesday', 'Thursday', 'Saturday'],
            },
            {
                name: 'Weekend Batch',
                startTime: '10:00 AM',
                endTime: '12:00 PM',
                days: ['Saturday', 'Sunday'],
            },
        ];

        await db.insert(timings).values(timingsData);
        console.log(`✅ Added ${timingsData.length} timings\n`);

        console.log('✅ Basic data seeding completed successfully!');
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        throw error;
    }
}

seedBasicData()
    .then(() => {
        console.log('\n✅ Script completed successfully');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Script failed:', error);
        process.exit(1);
    });
