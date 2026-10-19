'use server'

import { db } from '@/lib/db'
import { courses, categories, subcategories, orders, durations, timings, teachers, users, courseTimings, coupons, coursePricings, yogaLeads } from '@/lib/db/schema'
import { eq, desc, isNull, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { unstable_cache } from 'next/cache'
import { handleError } from '@/lib/errors'
import { CourseFormData } from '@/lib/validations/course'
import { Category, Teacher, Duration, Timing, CoursePricing, Coupon } from '@/types'

// Courses Actions
export const getCourses = unstable_cache(
    async () => {
        try {
            return await db.query.courses.findMany({
                where: isNull(courses.deletedAt),
                with: {
                    category: true,
                    subcategoryDetails: true,
                    teacher: {
                        with: {
                            user: true
                        }
                    },
                    duration: true,
                    courseTimings: true,
                    coursePricings: {
                        with: {
                            duration: true
                        }
                    },
                },
                orderBy: [desc(courses.createdAt)]
            })
        } catch (error) {
            const errorResponse = handleError(error)
            console.error('❌ Error fetching courses:', errorResponse)
            throw new Error(`Failed to fetch courses: ${errorResponse.message}`)
        }
    },
    ['courses-list'],
    { revalidate: 3600, tags: ['courses'] }
)

export async function getDeletedCourses() {
    try {
        return await db.query.courses.findMany({
            where: sql`${courses.deletedAt} IS NOT NULL`,
            with: {
                category: true,
                subcategoryDetails: true,
                teacher: {
                    with: {
                        user: true
                    }
                }
            },
            orderBy: [desc(courses.deletedAt)]
        })
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error fetching deleted courses:', errorResponse)
        throw new Error(`Failed to fetch deleted courses: ${errorResponse.message}`)
    }
}

function revalidatePublicPages(slug?: string) {
    try {
        revalidatePath('/admin/courses')
        revalidatePath('/admin/orders')
        revalidatePath('/', 'layout')
        revalidatePath('/', 'page')
        revalidatePath('/explore', 'page')
        revalidatePath('/courses', 'page')
        revalidatePath('/courses/yoga', 'page')
        if (slug) {
            revalidatePath(`/courses/${slug}`, 'page')
        }
    } catch (e) {
        console.error('Error in revalidatePublicPages:', e)
    }
}

export async function addCourse(data: CourseFormData & { [key: string]: any }) {
    try {
        const { timingIds, pricings, courseTimings: _ct, coursePricings: _cp, category: _cat, teacher: _teach, duration: _dur, ...courseData } = data

        const [newCourse] = await db.insert(courses).values({
            ...courseData,
            level: courseData.level || 'Beginner',
            maxStudents: courseData.maxStudents === '' || !courseData.maxStudents ? null : parseInt(courseData.maxStudents),
            price: pricings?.[0]?.discountedPrice?.toString() || '0',
            durationId: pricings?.[0]?.durationId || courseData.durationId || null,
            subcategoryId: courseData.subcategoryId === '' ? null : courseData.subcategoryId,
            teacherId: courseData.teacherId === '' ? null : courseData.teacherId,
        } as any).returning()

        if (timingIds && timingIds.length > 0) {
            await db.insert(courseTimings).values(
                timingIds.map((timingId: string) => ({
                    courseId: newCourse.id,
                    timingId
                }))
            )
        }

        if (pricings && pricings.length > 0) {
            await db.insert(coursePricings).values(
                pricings.map((p: any) => ({
                    courseId: newCourse.id,
                    durationId: p.durationId,
                    originalPrice: p.originalPrice.toString(),
                    discountedPrice: p.discountedPrice.toString(),
                }))
            )
        }

        revalidatePublicPages(newCourse.slug)
        return { success: true }
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error adding course:', errorResponse)
        throw new Error(`Failed to add course: ${errorResponse.message}`)
    }
}

export async function updateCourse(id: string, data: CourseFormData & { [key: string]: any }) {
    try {
        const { timingIds, pricings, courseTimings: _ct, coursePricings: _cp, category: _cat, teacher: _teach, duration: _dur, id: _id, createdAt, updatedAt, deletedAt, ...courseData } = data

        await db.update(courses).set({
            ...courseData,
            level: courseData.level || 'Beginner',
            maxStudents: courseData.maxStudents === '' || !courseData.maxStudents ? null : parseInt(courseData.maxStudents),
            price: pricings?.[0]?.discountedPrice?.toString() || '0',
            durationId: pricings?.[0]?.durationId || courseData.durationId || null,
            subcategoryId: courseData.subcategoryId === '' ? null : courseData.subcategoryId,
            teacherId: courseData.teacherId === '' ? null : courseData.teacherId,
            updatedAt: new Date(),
        } as any).where(eq(courses.id, id))

        // Update timings
        await db.delete(courseTimings).where(eq(courseTimings.courseId, id))
        if (timingIds && timingIds.length > 0) {
            await db.insert(courseTimings).values(
                timingIds.map((timingId: string) => ({
                    courseId: id,
                    timingId
                }))
            )
        }

        // Update pricings
        await db.delete(coursePricings).where(eq(coursePricings.courseId, id))
        if (pricings && pricings.length > 0) {
            await db.insert(coursePricings).values(
                pricings.map((p: any) => ({
                    courseId: id,
                    durationId: p.durationId,
                    originalPrice: p.originalPrice.toString(),
                    discountedPrice: p.discountedPrice.toString(),
                }))
            )
        }

        revalidatePublicPages(courseData.slug)
        return { success: true }
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error updating course:', errorResponse)
        throw new Error(`Failed to update course: ${errorResponse.message}`)
    }
}

export async function deleteCourse(id: string) {
    try {
        await db.update(courses).set({ deletedAt: new Date() }).where(eq(courses.id, id))
        revalidatePublicPages()
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error deleting course:', errorResponse)
        throw new Error(`Failed to delete course: ${errorResponse.message}`)
    }
}

export async function restoreCourse(id: string) {
    try {
        await db.update(courses).set({ deletedAt: null }).where(eq(courses.id, id))
        revalidatePublicPages()
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error restoring course:', errorResponse)
        throw new Error(`Failed to restore course: ${errorResponse.message}`)
    }
}

export async function permanentDeleteCourse(id: string) {
    try {
        await db.delete(courses).where(eq(courses.id, id))
        revalidatePublicPages()
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error permanently deleting course:', errorResponse)
        throw new Error(`Failed to permanently delete course: ${errorResponse.message}`)
    }
}

// Categories Actions
export const getCategories = unstable_cache(
    async () => {
        try {
            return await db.select().from(categories).where(isNull(categories.deletedAt))
        } catch (error) {
            const errorResponse = handleError(error)
            console.error('❌ Error fetching categories:', errorResponse)
            throw new Error(`Failed to fetch categories: ${errorResponse.message}`)
        }
    },
    ['categories-list'],
    { revalidate: 3600, tags: ['categories'] }
)

export async function getDeletedCategories() {
    try {
        return await db.select().from(categories).where(sql`${categories.deletedAt} IS NOT NULL`).orderBy(desc(categories.deletedAt))
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error fetching deleted categories:', errorResponse)
        throw new Error(`Failed to fetch deleted categories: ${errorResponse.message}`)
    }
}

export async function addCategory(data: Partial<Category>) {
    try {
        await db.insert(categories).values(data as any)
        revalidatePath('/admin/categories')
        return { success: true }
    } catch (error: unknown) {
        const errorResponse = handleError(error)
        console.error('❌ Error adding category:', errorResponse)
        if ((error as { code?: string }).code === '23505') {
            return { success: false, error: 'Category with this name or slug already exists' }
        }
        return { success: false, error: `Failed to add category: ${errorResponse.message}` }
    }
}

export async function updateCategory(id: string, data: Partial<Category>) {
    try {
        const { id: _id, createdAt, updatedAt, deletedAt, ...updateData } = data
        await db.update(categories).set({
            ...updateData,
            updatedAt: new Date()
        }).where(eq(categories.id, id))
        revalidatePath('/admin/categories')
        return { success: true }
    } catch (error: unknown) {
        const errorResponse = handleError(error)
        console.error('❌ Error updating category:', errorResponse)
        if ((error as { code?: string }).code === '23505') {
            return { success: false, error: 'Category with this name or slug already exists' }
        }
        return { success: false, error: `Failed to update category: ${errorResponse.message}` }
    }
}

export async function deleteCategory(id: string) {
    try {
        await db.update(categories).set({ deletedAt: new Date() }).where(eq(categories.id, id))
        revalidatePath('/admin/categories')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error deleting category:', errorResponse)
        throw new Error(`Failed to delete category: ${errorResponse.message}`)
    }
}

export async function restoreCategory(id: string) {
    try {
        await db.update(categories).set({ deletedAt: null }).where(eq(categories.id, id))
        revalidatePath('/admin/categories')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error restoring category:', errorResponse)
        throw new Error(`Failed to restore category: ${errorResponse.message}`)
    }
}

export async function permanentDeleteCategory(id: string) {
    try {
        await db.delete(categories).where(eq(categories.id, id))
        revalidatePath('/admin/categories')
        return { success: true }
    } catch (error: unknown) {
        const errorResponse = handleError(error)
        console.error('❌ Error permanently deleting category:', errorResponse)
        if ((error as { code?: string }).code === '23503') {
            return { success: false, error: 'Cannot delete category because it has associated courses.' }
        }
        return { success: false, error: `Failed to delete category: ${errorResponse.message}` }
    }
}

// Subcategories Actions
export const getSubcategories = unstable_cache(
    async () => {
        try {
            return await db.query.subcategories.findMany({
                where: isNull(subcategories.deletedAt),
                with: {
                    category: true
                },
                orderBy: [desc(subcategories.createdAt)]
            })
        } catch (error) {
            const errorResponse = handleError(error)
            console.error('❌ Error fetching subcategories:', errorResponse)
            throw new Error(`Failed to fetch subcategories: ${errorResponse.message}`)
        }
    },
    ['subcategories-list'],
    { revalidate: 3600, tags: ['subcategories'] }
)

export async function getDeletedSubcategories() {
    try {
        return await db.query.subcategories.findMany({
            where: sql`${subcategories.deletedAt} IS NOT NULL`,
            with: {
                category: true
            },
            orderBy: [desc(subcategories.deletedAt)]
        })
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error fetching deleted subcategories:', errorResponse)
        throw new Error(`Failed to fetch deleted subcategories: ${errorResponse.message}`)
    }
}

export async function addSubcategory(data: any) {
    try {
        await db.insert(subcategories).values(data)
        revalidatePath('/admin/subcategories')
        return { success: true }
    } catch (error: unknown) {
        const errorResponse = handleError(error)
        console.error('❌ Error adding subcategory:', errorResponse)
        if ((error as { code?: string }).code === '23505') {
            return { success: false, error: 'Subcategory with this name or slug already exists' }
        }
        return { success: false, error: `Failed to add subcategory: ${errorResponse.message}` }
    }
}

export async function updateSubcategory(id: string, data: any) {
    try {
        const { id: _id, createdAt, updatedAt, deletedAt, category, ...updateData } = data
        await db.update(subcategories).set({
            ...updateData,
            updatedAt: new Date()
        }).where(eq(subcategories.id, id))
        revalidatePath('/admin/subcategories')
        return { success: true }
    } catch (error: unknown) {
        const errorResponse = handleError(error)
        console.error('❌ Error updating subcategory:', errorResponse)
        if ((error as { code?: string }).code === '23505') {
            return { success: false, error: 'Subcategory with this name or slug already exists' }
        }
        return { success: false, error: `Failed to update subcategory: ${errorResponse.message}` }
    }
}

export async function deleteSubcategory(id: string) {
    try {
        await db.update(subcategories).set({ deletedAt: new Date() }).where(eq(subcategories.id, id))
        revalidatePath('/admin/subcategories')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error deleting subcategory:', errorResponse)
        throw new Error(`Failed to delete subcategory: ${errorResponse.message}`)
    }
}

export async function restoreSubcategory(id: string) {
    try {
        await db.update(subcategories).set({ deletedAt: null }).where(eq(subcategories.id, id))
        revalidatePath('/admin/subcategories')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error restoring subcategory:', errorResponse)
        throw new Error(`Failed to restore subcategory: ${errorResponse.message}`)
    }
}

export async function permanentDeleteSubcategory(id: string) {
    try {
        await db.delete(subcategories).where(eq(subcategories.id, id))
        revalidatePath('/admin/subcategories')
        return { success: true }
    } catch (error: unknown) {
        const errorResponse = handleError(error)
        console.error('❌ Error permanently deleting subcategory:', errorResponse)
        if ((error as { code?: string }).code === '23503') {
            return { success: false, error: 'Cannot delete subcategory because it is being used.' }
        }
        return { success: false, error: `Failed to delete subcategory: ${errorResponse.message}` }
    }
}

// Durations Actions
export const getDurations = unstable_cache(
    async () => {
        try {
            return await db.select().from(durations)
        } catch (error) {
            const errorResponse = handleError(error)
            console.error('❌ Error fetching durations:', errorResponse)
            throw new Error(`Failed to fetch durations: ${errorResponse.message}`)
        }
    },
    ['durations-list'],
    { revalidate: 3600, tags: ['durations'] }
)

export async function addDuration(data: Partial<Duration>) {
    try {
        await db.insert(durations).values(data as any)
        revalidatePath('/admin/durations')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error adding duration:', errorResponse)
        throw new Error(`Failed to add duration: ${errorResponse.message}`)
    }
}

export async function deleteDuration(id: string) {
    try {
        await db.delete(durations).where(eq(durations.id, id))
        revalidatePath('/admin/durations')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error deleting duration:', errorResponse)
        throw new Error(`Failed to delete duration: ${errorResponse.message}`)
    }
}

// Timings Actions
export const getTimings = unstable_cache(
    async () => {
        try {
            return await db.select().from(timings)
        } catch (error) {
            const errorResponse = handleError(error)
            console.error('❌ Error fetching timings:', errorResponse)
            throw new Error(`Failed to fetch timings: ${errorResponse.message}`)
        }
    },
    ['timings-list'],
    { revalidate: 3600, tags: ['timings'] }
)

export async function addTiming(data: Partial<Timing>) {
    try {
        await db.insert(timings).values(data as any)
        revalidatePath('/admin/timings')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error adding timing:', errorResponse)
        throw new Error(`Failed to add timing: ${errorResponse.message}`)
    }
}

export async function deleteTiming(id: string) {
    try {
        await db.delete(timings).where(eq(timings.id, id))
        revalidatePath('/admin/timings')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error deleting timing:', errorResponse)
        throw new Error(`Failed to delete timing: ${errorResponse.message}`)
    }
}

// Teachers Actions
export const getTeachers = unstable_cache(
    async () => {
        try {
            return await db.query.teachers.findMany({
                where: isNull(teachers.deletedAt),
                with: {
                    user: true
                },
                orderBy: [desc(teachers.createdAt)]
            })
        } catch (error) {
            const errorResponse = handleError(error)
            console.error('❌ Error fetching teachers:', errorResponse)
            throw new Error(`Failed to fetch teachers: ${errorResponse.message}`)
        }
    },
    ['teachers-list'],
    { revalidate: 3600, tags: ['teachers'] }
)

export async function getDeletedTeachers() {
    try {
        return await db.query.teachers.findMany({
            where: sql`${teachers.deletedAt} IS NOT NULL`,
            with: {
                user: true
            },
            orderBy: [desc(teachers.deletedAt)]
        })
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error fetching deleted teachers:', errorResponse)
        throw new Error(`Failed to fetch deleted teachers: ${errorResponse.message}`)
    }
}

export async function addTeacher(data: any) {
    try {
        const { email, name, phone, password, ...teacherData } = data

        // 1. Check if user exists
        let user = await db.query.users.findFirst({
            where: eq(users.email, email)
        })

        if (!user) {
            const [newUser] = await db.insert(users).values({
                id: crypto.randomUUID(),
                email,
                name,
                phone,
                role: 'teacher',
                approvalStatus: 'approved'
            }).returning()
            user = newUser
        } else {
            // Update role to teacher and update phone
            await db.update(users).set({ role: 'teacher', phone }).where(eq(users.id, user.id))
        }

        // 2. Create teacher profile
        await db.insert(teachers).values({
            userId: user.id,
            ...teacherData,
            expertise: teacherData.expertise || [],
            qualifications: teacherData.qualifications || [],
        })

        revalidatePath('/admin/teachers')
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error adding teacher:', errorResponse)
        throw new Error(`Failed to add teacher: ${errorResponse.message}`)
    }
}

export async function updateTeacher(id: string, data: any) {
    const { email, name, phone, id: _id, createdAt, updatedAt, deletedAt, ...teacherData } = data

    // 1. Update user info
    const teacher = await db.query.teachers.findFirst({
        where: eq(teachers.id, id),
        with: { user: true }
    })

    if (teacher?.user) {
        await db.update(users).set({ email, name, phone }).where(eq(users.id, teacher.user.id))
    }

    // 2. Update teacher profile
    await db.update(teachers).set({
        ...teacherData,
        expertise: teacherData.expertise || [],
        qualifications: teacherData.qualifications || [],
        updatedAt: new Date(),
    }).where(eq(teachers.id, id))

    revalidatePath('/admin/teachers')
}

export async function deleteTeacher(id: string) {
    await db.update(teachers).set({ deletedAt: new Date() }).where(eq(teachers.id, id))
    revalidatePath('/admin/teachers')
}

export async function restoreTeacher(id: string) {
    await db.update(teachers).set({ deletedAt: null }).where(eq(teachers.id, id))
    revalidatePath('/admin/teachers')
}

export async function permanentDeleteTeacher(id: string) {
    await db.delete(teachers).where(eq(teachers.id, id))
    revalidatePath('/admin/teachers')
}

// Users Actions
export const getUsers = unstable_cache(
    async () => {
        return await db.select().from(users).where(isNull(users.deletedAt)).orderBy(desc(users.createdAt))
    },
    ['users-list'],
    { revalidate: 60, tags: ['users'] }
)

export async function getDeletedUsers() {
    return await db.select().from(users).where(sql`${users.deletedAt} IS NOT NULL`).orderBy(desc(users.deletedAt))
}

export async function approveUser(userId: string, adminId: string) {
    await db.update(users).set({
        approvalStatus: 'approved',
        approvedBy: adminId,
        approvedAt: new Date(),
    }).where(eq(users.id, userId))
    revalidatePath('/admin/users')
}

export async function addUser(data: any) {
    const { email, name, role, password } = data

    // In production, use supabase.auth.admin.createUser
    await db.insert(users).values({
        id: crypto.randomUUID(),
        email,
        name,
        role,
        approvalStatus: 'approved',
    })

    revalidatePath('/admin/users')
}

export async function deleteUser(id: string) {
    await db.update(users).set({ deletedAt: new Date() }).where(eq(users.id, id))
    revalidatePath('/admin/users')
}

export async function restoreUser(id: string) {
    await db.update(users).set({ deletedAt: null }).where(eq(users.id, id))
    revalidatePath('/admin/users')
}

export async function permanentDeleteUser(id: string) {
    await db.delete(users).where(eq(users.id, id))
    revalidatePath('/admin/users')
}

// Orders Actions
export const getOrders = unstable_cache(
    async () => {
        return await db.query.orders.findMany({
            with: {
                user: true,
                course: {
                    with: {
                        category: true,
                    }
                },
                duration: true,
            },
            orderBy: [desc(orders.createdAt)]
        })
    },
    ['orders-list'],
    { revalidate: 10, tags: ['orders'] }
)

// Orders Stats
export const getOrderStats = unstable_cache(
    async () => {
        const allOrders = await db.select().from(orders);
        const completed = allOrders.filter(o => o.status === 'completed');

        const totalSales = completed.reduce((acc, o) => acc + Number(o.finalAmount ?? o.amount ?? 0), 0);
        const activeStudents = new Set(completed.map(o => o.userId)).size;
        const conversionRate = allOrders.length === 0 ? 0 : Math.round((completed.length / allOrders.length) * 1000) / 10; // one decimal percent

        return {
            totalSales,
            activeStudents,
            conversionRate
        }
    },
    ['orders-stats'],
    { revalidate: 10, tags: ['orders'] }
)

// Coupons Actions
export const getCoupons = unstable_cache(
    async () => {
        return await db.select().from(coupons).where(isNull(coupons.deletedAt)).orderBy(desc(coupons.createdAt))
    },
    ['coupons-list'],
    { revalidate: 300, tags: ['coupons'] }
)

export async function getDeletedCoupons() {
    return await db.select().from(coupons).where(sql`${coupons.deletedAt} IS NOT NULL`).orderBy(desc(coupons.deletedAt))
}

export async function createCoupon(data: any) {
    await db.insert(coupons).values({
        ...data,
        discountValue: data.discountValue.toString(),
        minPurchaseAmount: data.minPurchaseAmount?.toString() || '0',
        maxDiscountAmount: data.maxDiscountAmount?.toString() || null,
        validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
    })
    revalidatePath('/admin/coupons')
}

export async function updateCoupon(id: string, data: any) {
    const { id: _id, createdAt, updatedAt, deletedAt, ...updateData } = data
    await db.update(coupons).set({
        ...updateData,
        discountValue: data.discountValue.toString(),
        minPurchaseAmount: data.minPurchaseAmount?.toString() || '0',
        maxDiscountAmount: data.maxDiscountAmount?.toString() || null,
        validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        updatedAt: new Date(),
    }).where(eq(coupons.id, id))
    revalidatePath('/admin/coupons')
}

export async function deleteCoupon(id: string) {
    await db.update(coupons).set({ deletedAt: new Date() }).where(eq(coupons.id, id))
    revalidatePath('/admin/coupons')
}

export async function restoreCoupon(id: string) {
    await db.update(coupons).set({ deletedAt: null }).where(eq(coupons.id, id))
    revalidatePath('/admin/coupons')
}

export async function permanentDeleteCoupon(id: string) {
    await db.delete(coupons).where(eq(coupons.id, id))
    revalidatePath('/admin/coupons')
}

// Expired Students Action
export async function getExpiredStudents() {
    try {
        const allOrders = await db.query.orders.findMany({
            where: eq(orders.status, 'completed'),
            with: {
                user: true,
                course: true,
                duration: true
            }
        });

        const now = new Date();
        const expired = allOrders.filter(order => {
            if (!order.duration) return false;

            const createdAt = new Date(order.createdAt);
            const durationUnit = order.duration.unit; // 'days', 'weeks', 'months'
            const durationValue = order.duration.value;

            let expiryDate = new Date(createdAt);
            if (durationUnit === 'days') {
                expiryDate.setDate(expiryDate.getDate() + durationValue);
            } else if (durationUnit === 'weeks') {
                expiryDate.setDate(expiryDate.getDate() + (durationValue * 7));
            } else if (durationUnit === 'months') {
                expiryDate.setMonth(expiryDate.getMonth() + durationValue);
            }

            return expiryDate < now;
        }).map(order => {
            // Calculate expiry date again for display
            const createdAt = new Date(order.createdAt);
            const durationValue = order.duration!.value;
            const durationUnit = order.duration!.unit;
            let expiryDate = new Date(createdAt);
            if (durationUnit === 'days') expiryDate.setDate(expiryDate.getDate() + durationValue);
            else if (durationUnit === 'weeks') expiryDate.setDate(expiryDate.getDate() + (durationValue * 7));
            else if (durationUnit === 'months') expiryDate.setMonth(expiryDate.getMonth() + durationValue);

            return {
                ...order,
                expiryDate
            };
        });

        return expired;
    } catch (error) {
        console.error('Error fetching expired students:', error);
        return [];
    }
}

// Yoga Leads Actions
export async function getYogaLeads() {
    try {
        return await db.select().from(yogaLeads).orderBy(desc(yogaLeads.submittedAt))
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error fetching yoga leads:', errorResponse)
        throw new Error(`Failed to fetch yoga leads: ${errorResponse.message}`)
    }
}

export async function deleteYogaLead(id: string) {
    try {
        await db.delete(yogaLeads).where(eq(yogaLeads.id, id))
        revalidatePath('/admin/yoga-leads')
        return { success: true }
    } catch (error) {
        const errorResponse = handleError(error)
        console.error('❌ Error deleting yoga lead:', errorResponse)
        throw new Error(`Failed to delete yoga lead: ${errorResponse.message}`)
    }
}
