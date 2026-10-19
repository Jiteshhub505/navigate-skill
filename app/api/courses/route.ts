import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { courses, courseTimings, categories } from '@/lib/db/schema';
import { uploadImage } from '@/lib/supabase-storage';
import { eq, ilike, isNull, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const slug = searchParams.get('slug');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const excludeSlug = searchParams.get('exclude');

    try {
        // Fetch single course by slug
        if (slug) {
            const course = await db.query.courses.findFirst({
                where: and(eq(courses.slug, slug), isNull(courses.deletedAt)),
                with: {
                    category: true,
                    teacher: {
                        with: {
                            user: true,
                        },
                    },
                    duration: true,
                    courseTimings: {
                        with: {
                            timing: true,
                        },
                    },
                    coursePricings: {
                        with: {
                            duration: true,
                        },
                    },
                },
            });

            if (!course) {
                return NextResponse.json({ error: 'Course not found' }, { status: 404 });
            }
            return NextResponse.json(course);
        }

        // Build where clause for filtering
        let whereClause: any = isNull(courses.deletedAt);

        if (categorySlug && categorySlug !== 'all') {
            const category = await db.query.categories.findFirst({
                where: and(eq(categories.slug, categorySlug), isNull(categories.deletedAt)),
            });

            if (category) {
                whereClause = and(eq(courses.categoryId, category.id), isNull(courses.deletedAt));
            } else {
                return NextResponse.json([]);
            }
        }

        const allCourses = await db.query.courses.findMany({
            where: whereClause,
            with: {
                category: true,
                teacher: {
                    with: {
                        user: true,
                    },
                },
                duration: true,
                courseTimings: {
                    with: {
                        timing: true,
                    },
                },
                coursePricings: {
                    with: {
                        duration: true,
                    },
                },
            },
            orderBy: (courses, { desc }) => [desc(courses.createdAt)],
            limit: limit,
        });

        // If excludeSlug is provided, filter it out
        const filteredCourses = excludeSlug
            ? allCourses.filter(c => c.slug !== excludeSlug)
            : allCourses;

        return NextResponse.json(filteredCourses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();

        // Extract fields
        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const description = formData.get('description') as string;
        const longDescription = formData.get('longDescription') as string;
        const price = formData.get('price') as string;
        const categoryId = formData.get('categoryId') as string;
        const durationId = formData.get('durationId') as string;
        const teacherId = formData.get('teacherId') as string;
        const level = formData.get('level') as string;
        const subcategory = formData.get('subcategory') as string;
        const maxStudents = formData.get('maxStudents') as string;

        // Handle JSON fields
        const pricing = formData.get('pricing') ? JSON.parse(formData.get('pricing') as string) : null;
        const features = formData.get('features') ? JSON.parse(formData.get('features') as string) : null;

        // Handle Timings (array of IDs)
        const timingIds = formData.getAll('timingIds') as string[];

        // Handle Image
        const imageFile = formData.get('image') as File;

        // Validation
        if (!title || !slug || !description || !price || !categoryId || !teacherId || !level || !imageFile) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Upload Image
        const path = `courses/${slug}-${Date.now()}.${imageFile.name.split('.').pop()}`;
        const { url: imageUrl, error: uploadError } = await uploadImage(imageFile, path);

        if (uploadError) {
            return NextResponse.json({ error: `Image upload failed: ${uploadError}` }, { status: 500 });
        }

        // Create Course
        const [newCourse] = await db
            .insert(courses)
            .values({
                title,
                slug,
                description,
                longDescription: longDescription || null,
                price: price, // Decimal string is fine
                pricing,
                categoryId,
                durationId: durationId || null,
                teacherId,
                imageUrl,
                subcategory: subcategory || null,
                features,
                level,
                maxStudents: maxStudents ? parseInt(maxStudents) : null,
            })
            .returning();

        // Create Course Timings
        if (timingIds.length > 0) {
            await db.insert(courseTimings).values(
                timingIds.map((timingId) => ({
                    courseId: newCourse.id,
                    timingId,
                }))
            );
        }

        return NextResponse.json(newCourse, { status: 201 });
    } catch (error) {
        console.error('Error creating course:', error);
        return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const [deletedCourse] = await db
            .update(courses)
            .set({ deletedAt: new Date() })
            .where(eq(courses.id, id))
            .returning();

        if (!deletedCourse) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Course soft-deleted successfully', course: deletedCourse });
    } catch (error) {
        console.error('Error deleting course:', error);
        return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
    }
}

