import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { subcategories } from '@/lib/db/schema';
import { eq, isNull, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');

        let conditions = [isNull(subcategories.deletedAt)];

        if (categoryId) {
            conditions.push(eq(subcategories.categoryId, categoryId));
        }

        const allSubcategories = await db
            .select()
            .from(subcategories)
            .where(and(...conditions));

        return NextResponse.json(allSubcategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        return NextResponse.json({ error: 'Failed to fetch subcategories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, slug, categoryId, description } = body;

        if (!name || !slug || !categoryId) {
            return NextResponse.json(
                { error: 'Name, slug, and categoryId are required' },
                { status: 400 }
            );
        }

        const [newSubcategory] = await db
            .insert(subcategories)
            .values({
                name,
                slug,
                categoryId,
                description: description || null,
            })
            .returning();

        return NextResponse.json(newSubcategory, { status: 201 });
    } catch (error) {
        console.error('Error creating subcategory:', error);
        return NextResponse.json({ error: 'Failed to create subcategory' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Subcategory ID is required' }, { status: 400 });
        }

        const [deletedSubcategory] = await db
            .update(subcategories)
            .set({ deletedAt: new Date() })
            .where(eq(subcategories.id, id))
            .returning();

        if (!deletedSubcategory) {
            return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Subcategory soft-deleted successfully', subcategory: deletedSubcategory });
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        return NextResponse.json({ error: 'Failed to delete subcategory' }, { status: 500 });
    }
}
