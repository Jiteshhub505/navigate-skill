import { z } from 'zod';

// Course Pricing validation schema
export const coursePricingSchema = z.object({
    durationId: z.string().uuid('Invalid duration ID'),
    originalPrice: z.number().positive('Original price must be positive'),
    discountedPrice: z.number().positive('Discounted price must be positive'),
}).refine((data) => data.discountedPrice <= data.originalPrice, {
    message: 'Discounted price cannot be greater than original price',
    path: ['discountedPrice'],
});

// Course Form validation schema
export const courseFormSchema = z.object({
    title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
    slug: z.string().min(1, 'Slug is required').max(255, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: z.string().min(1, 'Description is required'),
    longDescription: z.string().optional(),
    categoryId: z.string().uuid('Invalid category ID'),
    teacherId: z.string().uuid('Invalid teacher ID').optional().nullable(),
    imageUrl: z.string().url('Invalid image URL').optional().nullable(),
    galleryImages: z.array(z.string().url()).optional(),
    features: z.array(z.string()).optional(),
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'All Levels']).optional().nullable(),
    timingIds: z.array(z.string().uuid()).min(1, 'At least one timing is required'),
    pricings: z.array(coursePricingSchema).min(1, 'At least one pricing is required'),
});

// Category Form validation schema
export const categoryFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    slug: z.string().min(1, 'Slug is required').max(100, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase with hyphens'),
    description: z.string().optional().nullable(),
    icon: z.string().optional().nullable(),
    imageUrl: z.string().url('Invalid image URL').optional().nullable(),
});

// Teacher Form validation schema
export const teacherFormSchema = z.object({
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    bio: z.string().optional().nullable(),
    imageUrl: z.string().url('Invalid image URL').optional().nullable(),
    specialization: z.string().optional().nullable(),
});

// Coupon Form validation schema
export const couponFormSchema = z.object({
    code: z.string().min(1, 'Code is required').max(50, 'Code too long').regex(/^[A-Z0-9]+$/, 'Code must be uppercase letters and numbers'),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().positive('Discount value must be positive'),
    maxUses: z.number().int().positive('Max uses must be a positive integer').optional().nullable(),
    validFrom: z.date().optional().nullable(),
    validUntil: z.date().optional().nullable(),
    courseIds: z.array(z.string().uuid()).optional(),
}).refine((data) => {
    if (data.discountType === 'percentage') {
        return data.discountValue <= 100;
    }
    return true;
}, {
    message: 'Percentage discount cannot exceed 100%',
    path: ['discountValue'],
}).refine((data) => {
    if (data.validFrom && data.validUntil) {
        return data.validUntil > data.validFrom;
    }
    return true;
}, {
    message: 'Valid until date must be after valid from date',
    path: ['validUntil'],
});

// User/Auth validation schemas
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required').max(255, 'Name too long'),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional().nullable(),
});

// Type exports
export type CoursePricingInput = z.infer<typeof coursePricingSchema>;
export type CourseFormInput = z.infer<typeof courseFormSchema>;
export type CategoryFormInput = z.infer<typeof categoryFormSchema>;
export type TeacherFormInput = z.infer<typeof teacherFormSchema>;
export type CouponFormInput = z.infer<typeof couponFormSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
