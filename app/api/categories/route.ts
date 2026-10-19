import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories } from '@/lib/db/schema';
import { uploadImage } from '@/lib/supabase-storage';
import { eq, isNull } from 'drizzle-orm';

export async function GET() {
    try {
        const allCategories = await db.select().from(categories).where(isNull(categories.deletedAt));
        return NextResponse.json(allCategories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const icon = formData.get('icon') as string;
        const imageFile = formData.get('image') as File;

        if (!name || !slug) {
            return NextResponse.json(
                { error: 'Name and slug are required' },
                { status: 400 }
            );
        }

        let imageUrl = '';

        // Upload image if provided
        if (imageFile) {
            const path = `categories/${slug}-${Date.now()}.${imageFile.name.split('.').pop()}`;
            const { url, error } = await uploadImage(imageFile, path);

            if (error) {
                return NextResponse.json({ error: `Image upload failed: ${error}` }, { status: 500 });
            }

            imageUrl = url;
        }

        const [newCategory] = await db
            .insert(categories)
            .values({
                name,
                slug,
                description: description || null,
                icon: icon || null,
                imageUrl: imageUrl || null,
            })
            .returning();

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
        }

        const [deletedCategory] = await db
            .update(categories)
            .set({ deletedAt: new Date() })
            .where(eq(categories.id, id))
            .returning();

        if (!deletedCategory) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Category soft-deleted successfully', category: deletedCategory });
    } catch (error) {
        console.error('Error deleting category:', error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
    }
}

