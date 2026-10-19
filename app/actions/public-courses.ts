'use server'

import { db } from '@/lib/db'
import { courses, categories, teachers, subcategories } from '@/lib/db/schema'
import { eq, desc, not, and, isNull } from 'drizzle-orm'
import { unstable_cache } from 'next/cache'

export const getCourseBySlug = unstable_cache(
    async (slug: string) => {
        // Fetch course even if soft-deleted (to show as "Out of Stock")
        return await db.query.courses.findFirst({
            where: eq(courses.slug, slug),
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
        })
    },
    ['course-by-slug'],
    { revalidate: 10, tags: ['courses'] }
)

export const getRelatedCourses = unstable_cache(
    async (categorySlug: string, excludeSlug: string, limit: number = 2) => {
        // First get category id
        const category = await db.query.categories.findFirst({
            where: and(eq(categories.slug, categorySlug), isNull(categories.deletedAt)),
        });

        if (!category) return [];

        return await db.query.courses.findMany({
            where: and(
                eq(courses.categoryId, category.id),
                not(eq(courses.slug, excludeSlug)),
                isNull(courses.deletedAt)
            ),
            with: {
                category: true,
                teacher: {
                    with: {
                        user: true,
                    },
                },
                duration: true,
                coursePricings: {
                    with: {
                        duration: true,
                    }
                },
                courseTimings: {
                    with: {
                        timing: true,
                    }
                }
            },
            limit: limit,
            orderBy: [desc(courses.createdAt)],
        })
    },
    ['related-courses'],
    { revalidate: 10, tags: ['courses'] }
)

export const getExploreCourses = unstable_cache(
    async (excludeCategorySlug: string, limit: number = 3) => {
        // Get category to exclude
        const category = await db.query.categories.findFirst({
            where: and(eq(categories.slug, excludeCategorySlug), isNull(categories.deletedAt)),
        });

        const whereClause = category
            ? and(not(eq(courses.categoryId, category.id)), isNull(courses.deletedAt))
            : isNull(courses.deletedAt);

        return await db.query.courses.findMany({
            where: whereClause,
            with: {
                category: true,
                teacher: {
                    with: {
                        user: true,
                    },
                },
                duration: true,
                coursePricings: {
                    with: {
                        duration: true,
                    }
                },
                courseTimings: {
                    with: {
                        timing: true,
                    }
                }
            },
            limit: limit,
            orderBy: [desc(courses.createdAt)],
        })
    },
    ['explore-courses'],
    { revalidate: 10, tags: ['courses'] }
)

export const getCoursesByCategory = unstable_cache(
    async (categorySlug: string = 'all', limit?: number) => {
        // Include soft-deleted courses (they show as 'Out of Stock')
        let whereClause: any = undefined;

        if (categorySlug && categorySlug !== 'all') {
            // Try to find as category first
            const category = await db.query.categories.findFirst({
                where: and(eq(categories.slug, categorySlug), isNull(categories.deletedAt)),
            });

            if (category) {
                whereClause = eq(courses.categoryId, category.id);
            } else {
                // Try to find as subcategory
                const subcategory = await db.query.subcategories.findFirst({
                    where: and(eq(subcategories.slug, categorySlug), isNull(subcategories.deletedAt)),
                });

                if (subcategory) {
                    whereClause = eq(courses.subcategoryId, subcategory.id);
                } else {
                    return [];
                }
            }
        }

        return await db.query.courses.findMany({
            where: whereClause,
            with: {
                category: true,
                teacher: {
                    with: {
                        user: true,
                    },
                },
                duration: true,
                coursePricings: {
                    with: {
                        duration: true,
                    }
                },
                courseTimings: {
                    with: {
                        timing: true,
                    }
                }
            },
            orderBy: [desc(courses.createdAt)],
            limit: limit,
        })
    },
    // Dynamic cache key includes slug and limit so different queries don't collide
    ['courses-by-category'],
    { revalidate: 10, tags: ['courses'] }
)

export const getCategories = unstable_cache(
    async () => {
        return await db.query.categories.findMany({
            where: isNull(categories.deletedAt),
            with: {
                subcategories: {
                    where: isNull(subcategories.deletedAt)
                }
            },
            orderBy: [desc(categories.createdAt)]
        })
    },
    ['public-categories'],
    { revalidate: 10, tags: ['categories'] }
)

export const getCategoryWithSubcategories = unstable_cache(
    async (slug: string) => {
        return await db.query.categories.findFirst({
            where: and(eq(categories.slug, slug), isNull(categories.deletedAt)),
            with: {
                subcategories: {
                    where: isNull(subcategories.deletedAt)
                }
            }
        })
    },
    ['category-with-subcategories'],
    { revalidate: 10, tags: ['categories'] }
)

export const getSubcategoryWithCourses = unstable_cache(
    async (slug: string) => {
        return await db.query.subcategories.findFirst({
            where: and(eq(subcategories.slug, slug), isNull(subcategories.deletedAt)),
            with: {
                category: true,
                courses: {
                    // Include soft-deleted courses (they show as 'Out of Stock')
                    with: {
                        category: true,
                        teacher: {
                            with: {
                                user: true
                            }
                        },
                        duration: true,
                        coursePricings: {
                            with: {
                                duration: true
                            }
                        },
                        courseTimings: {
                            with: {
                                timing: true
                            }
                        }
                    }
                }
            }
        })
    },
    ['subcategory-with-courses'],
    { revalidate: 3600, tags: ['subcategories', 'courses'] }
)

export const getTeacherById = unstable_cache(
    async (id: string) => {
        return await db.query.teachers.findFirst({
            where: eq(teachers.id, id),
            with: {
                user: true,
                courses: {
                    where: isNull(courses.deletedAt),
                    with: {
                        category: true,
                        duration: true,
                        coursePricings: {
                            with: {
                                duration: true,
                            }
                        },
                        courseTimings: {
                            with: {
                                timing: true,
                            }
                        }
                    }
                }
            }
        })
    },
    ['teacher-by-id'],
    { revalidate: 3600, tags: ['teachers'] }
)

export const getTeachers = unstable_cache(
    async (limit?: number) => {
        return await db.query.teachers.findMany({
            where: isNull(teachers.deletedAt),
            with: {
                user: true,
            },
            limit: limit,
        })
    },
    ['all-teachers'],
    { revalidate: 3600, tags: ['teachers'] }
)
