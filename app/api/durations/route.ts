import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { durations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

// GET - Fetch all durations
export async function GET() {
    try {
        const allDurations = await db.select().from(durations);
        return NextResponse.json(allDurations);
    } catch (error) {
        console.error('Error fetching durations:', error);
        return NextResponse.json({ error: 'Failed to fetch durations' }, { status: 500 });
    }
}

// POST - Create new duration
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, value, unit } = body;

        if (!name || !value || !unit) {
            return NextResponse.json(
                { error: 'Name, value, and unit are required' },
                { status: 400 }
            );
        }

        const [newDuration] = await db
            .insert(durations)
            .values({ name, value, unit })
            .returning();

        return NextResponse.json(newDuration, { status: 201 });
    } catch (error) {
        console.error('Error creating duration:', error);
        return NextResponse.json({ error: 'Failed to create duration' }, { status: 500 });
    }
}

// PATCH - Update duration
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, name, value, unit } = body;

        if (!id) {
            return NextResponse.json({ error: 'Duration ID is required' }, { status: 400 });
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (value) updateData.value = value;
        if (unit) updateData.unit = unit;

        const [updatedDuration] = await db
            .update(durations)
            .set(updateData)
            .where(eq(durations.id, id))
            .returning();

        if (!updatedDuration) {
            return NextResponse.json({ error: 'Duration not found' }, { status: 404 });
        }

        return NextResponse.json(updatedDuration);
    } catch (error) {
        console.error('Error updating duration:', error);
        return NextResponse.json({ error: 'Failed to update duration' }, { status: 500 });
    }
}

// DELETE - Delete duration
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Duration ID is required' }, { status: 400 });
        }

        await db.delete(durations).where(eq(durations.id, id));
        return NextResponse.json({ message: 'Duration deleted successfully' });
    } catch (error) {
        console.error('Error deleting duration:', error);
        return NextResponse.json({ error: 'Failed to delete duration' }, { status: 500 });
    }
}
