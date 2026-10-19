import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

// GET - Fetch all users or pending approvals
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status'); // 'pending', 'approved', 'rejected'
        const role = searchParams.get('role'); // 'admin', 'teacher', 'student'

        let query = db.select().from(users).orderBy(desc(users.createdAt));

        // Filter by approval status if provided
        if (status) {
            const allUsers = await query;
            const filteredUsers = allUsers.filter(user => user.approvalStatus === status);
            return NextResponse.json(filteredUsers);
        }

        // Filter by role if provided
        if (role) {
            const allUsers = await query;
            const filteredUsers = allUsers.filter(user => user.role === role);
            return NextResponse.json(filteredUsers);
        }

        const allUsers = await query;
        return NextResponse.json(allUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
    }
}

// POST - Create new user (requires admin approval)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, email, name, phone, role } = body;

        // Validate required fields
        if (!email || !name) {
            return NextResponse.json(
                { error: 'Email and name are required' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await db.select().from(users).where(eq(users.email, email));
        if (existingUser.length > 0) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Create new user
        const [newUser] = await db
            .insert(users)
            .values({
                id: id, // Use the ID from Supabase Auth
                email,
                name,
                phone: phone || null,
                role: role || 'student',
                approvalStatus: 'approved', // Auto-approve students for now
            })
            .returning();

        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

// PATCH - Update user (for approval/rejection)
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, approvalStatus, adminId, role, name, phone } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const updateData: any = {};

        // Update approval status
        if (approvalStatus) {
            if (!['pending', 'approved', 'rejected'].includes(approvalStatus)) {
                return NextResponse.json({ error: 'Invalid approval status' }, { status: 400 });
            }
            updateData.approvalStatus = approvalStatus;
            if (approvalStatus === 'approved') {
                updateData.approvedBy = adminId || null;
                updateData.approvedAt = new Date();
            }
        }

        // Update other fields
        if (role) updateData.role = role;
        if (name) updateData.name = name;
        if (phone !== undefined) updateData.phone = phone;

        updateData.updatedAt = new Date();

        const [updatedUser] = await db
            .update(users)
            .set(updateData)
            .where(eq(users.id, userId))
            .returning();

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }
}

// DELETE - Delete user
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await db.delete(users).where(eq(users.id, userId));

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    }
}
