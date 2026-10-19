import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { teachers, users } from '@/lib/db/schema';
import { eq, desc, isNull, and } from 'drizzle-orm';

// GET - Fetch all teachers
export async function GET() {
    try {
        // Join teachers with users table to get user details
        const allTeachers = await db
            .select({
                id: teachers.id,
                userId: teachers.userId,
                bio: teachers.bio,
                expertise: teachers.expertise,
                experience: teachers.experience,
                qualifications: teachers.qualifications,
                profileImageUrl: teachers.profileImageUrl,
                socialLinks: teachers.socialLinks,
                isActive: teachers.isActive,
                createdAt: teachers.createdAt,
                updatedAt: teachers.updatedAt,
                // User details
                userName: users.name,
                userEmail: users.email,
                userPhone: users.phone,
            })
            .from(teachers)
            .leftJoin(users, eq(teachers.userId, users.id))
            .where(isNull(teachers.deletedAt))
            .orderBy(desc(teachers.createdAt));

        return NextResponse.json(allTeachers);
    } catch (error) {
        console.error('Error fetching teachers:', error);
        return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
    }
}

// POST - Create new teacher profile
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, bio, expertise, experience, qualifications, profileImageUrl, socialLinks } = body;

        // Validate required fields
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Check if user exists and is approved
        const [user] = await db.select().from(users).where(eq(users.id, userId));
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.approvalStatus !== 'approved') {
            return NextResponse.json(
                { error: 'User must be approved before creating teacher profile' },
                { status: 400 }
            );
        }

        // Check if teacher profile already exists (and not deleted)
        const existingTeacher = await db.select().from(teachers).where(
            and(
                eq(teachers.userId, userId),
                isNull(teachers.deletedAt)
            )
        );
        if (existingTeacher.length > 0) {
            return NextResponse.json(
                { error: 'Teacher profile already exists for this user' },
                { status: 400 }
            );
        }

        // Update user role to teacher if not already
        if (user.role !== 'teacher') {
            await db.update(users).set({ role: 'teacher' }).where(eq(users.id, userId));
        }

        // Create teacher profile
        const [newTeacher] = await db
            .insert(teachers)
            .values({
                userId,
                bio: bio || null,
                expertise: expertise || null,
                experience: experience || null,
                qualifications: qualifications || null,
                profileImageUrl: profileImageUrl || null,
                socialLinks: socialLinks || null,
            })
            .returning();

        return NextResponse.json(newTeacher, { status: 201 });
    } catch (error) {
        console.error('Error creating teacher:', error);
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}

// PATCH - Update teacher profile
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { teacherId, bio, expertise, experience, qualifications, profileImageUrl, socialLinks, isActive } = body;

        if (!teacherId) {
            return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
        }

        const updateData: any = { updatedAt: new Date() };

        if (bio !== undefined) updateData.bio = bio;
        if (expertise !== undefined) updateData.expertise = expertise;
        if (experience !== undefined) updateData.experience = experience;
        if (qualifications !== undefined) updateData.qualifications = qualifications;
        if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl;
        if (socialLinks !== undefined) updateData.socialLinks = socialLinks;
        if (isActive !== undefined) updateData.isActive = isActive;

        const [updatedTeacher] = await db
            .update(teachers)
            .set(updateData)
            .where(and(eq(teachers.id, teacherId), isNull(teachers.deletedAt)))
            .returning();

        if (!updatedTeacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        return NextResponse.json(updatedTeacher);
    } catch (error) {
        console.error('Error updating teacher:', error);
        return NextResponse.json({ error: 'Failed to update teacher' }, { status: 500 });
    }
}

// DELETE - Soft delete teacher profile
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const teacherId = searchParams.get('id');

        if (!teacherId) {
            return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
        }

        const [deletedTeacher] = await db
            .update(teachers)
            .set({ deletedAt: new Date() })
            .where(eq(teachers.id, teacherId))
            .returning();

        if (!deletedTeacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Teacher soft-deleted successfully', teacher: deletedTeacher });
    } catch (error) {
        console.error('Error deleting teacher:', error);
        return NextResponse.json({ error: 'Failed to delete teacher' }, { status: 500 });
    }
}
