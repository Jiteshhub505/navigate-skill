import { z } from 'zod'

export const courseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    longDescription: z.string().optional(),
    price: z.string().optional(), // Derived from pricings in backend
    categoryId: z.string().min(1, 'Category is required'),
    subcategory: z.string().optional(),
    subcategoryId: z.string().optional(),
    imageUrl: z.string().min(1, 'Course image is required'),
    galleryImages: z.array(z.string()).optional(),
    teacherId: z.string().min(1, 'Teacher is required'),
    durationId: z.string().optional(), // Optional now as we use pricings
    timingIds: z.array(z.string()).optional(),
    features: z.array(z.string()).optional(),
    level: z.string().optional(),
    maxStudents: z.string().nullable().optional(),
    pricings: z.array(z.object({
        durationId: z.string().min(1, 'Duration is required'),
        originalPrice: z.string().min(1, 'Original price is required'),
        discountedPrice: z.string().min(1, 'Discounted price is required'),
    })).min(1, 'At least one pricing is required')
})

export type CourseFormData = z.infer<typeof courseSchema>
