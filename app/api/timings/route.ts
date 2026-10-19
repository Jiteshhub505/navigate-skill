import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { timings } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch all timings
export async function GET() {
    try {
        const allTimings = await db.select().from(timings);
        return NextResponse.json(allTimings);
    } catch (error) {
        console.error('Error fetching timings:', error);
        return NextResponse.json({ error: 'Failed to fetch timings' }, { status: 500 });
    }
}

// POST - Create new timing
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, startTime, endTime, days } = body;

        if (!name || !startTime || !endTime) {
            return NextResponse.json(
                { error: 'Name, start time, and end time are required' },
                { status: 400 }
            );
        }

        const [newTiming] = await db
            .insert(timings)
            .values({ name, startTime, endTime, days: days || null })
            .returning();

        return NextResponse.json(newTiming, { status: 201 });
    } catch (error) {
        console.error('Error creating timing:', error);
        return NextResponse.json({ error: 'Failed to create timing' }, { status: 500 });
    }
}

// PATCH - Update timing
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, startTime, endTime, days } = body;

        if (!id) {
            return NextResponse.json({ error: 'Timing ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (startTime) updateData.startTime = startTime;
        if (endTime) updateData.endTime = endTime;
        if (days !== undefined) updateData.days = days;

        const [updatedTiming] = await db
            .update(timings)
            .set(updateData)
            .where(eq(timings.id, id))
            .returning();

        if (!updatedTiming) {
            return NextResponse.json({ error: 'Timing not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTiming);
    } catch (error) {
        console.error('Error updating timing:', error);
        return NextResponse.json({ error: 'Failed to update timing' }, { status: 500 });
    }
}

// DELETE - Delete timing
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Timing ID is required' }, { status: 400 });
        }

        await db.delete(timings).where(eq(timings.id, id));
        return NextResponse.json({ message: 'Timing deleted successfully' });
    } catch (error) {
        console.error('Error deleting timing:', error);
        return NextResponse.json({ error: 'Failed to delete timing' }, { status: 500 });
    }
}
