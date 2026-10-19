import { pgTable, text, timestamp, uuid, decimal, pgEnum, jsonb, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const roleEnum = pgEnum('role', ['admin', 'teacher', 'student']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'completed', 'failed']);
export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);

// Users Table (with approval system)
export const users = pgTable('users', {
    id: uuid('id').primaryKey(), // ID comes from Supabase Auth
    email: text('email').unique().notNull(),
    name: text('name').notNull(),
    phone: text('phone'),
    role: text('role').default('student').notNull(),
    approvalStatus: text('approval_status').default('pending').notNull(),
    approvedBy: uuid('approved_by').references((): any => users.id),
    approvedAt: timestamp('approved_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
});

// Teachers Table
export const teachers = pgTable('teachers', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull().unique(),
    bio: text('bio'),
    expertise: jsonb('expertise'), // Array of expertise areas
    experience: integer('experience'), // Years of experience
    qualifications: jsonb('qualifications'), // Array of qualifications
    profileImageUrl: text('profile_image_url'), // Supabase storage URL
    socialLinks: jsonb('social_links'), // LinkedIn, Twitter, etc.
    isActive: boolean('is_active').default(true).notNull(),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Categories Table (Independent)
export const categories = pgTable('categories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    icon: text('icon'),
    imageUrl: text('image_url'), // Supabase storage URL from 'course' bucket
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Subcategories Table
export const subcategories = pgTable('subcategories', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    categoryId: uuid('category_id').references(() => categories.id).notNull(),
    description: text('description'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Durations Table (Independent)
export const durations = pgTable('durations', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull().unique(), // e.g., "1 Month", "3 Months", "6 Months"
    value: integer('value').notNull(), // Numeric value in days or months
    unit: text('unit').notNull(), // 'days', 'weeks', 'months'
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Timings Table (Independent)
export const timings = pgTable('timings', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(), // e.g., "Morning Batch", "Evening Batch"
    startTime: text('start_time').notNull(), // e.g., "09:00 AM"
    endTime: text('end_time').notNull(), // e.g., "11:00 AM"
    days: jsonb('days'), // Array of days: ["Monday", "Wednesday", "Friday"]
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Courses Table (Updated with foreign keys)
export const courses = pgTable('courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description').notNull(),
    longDescription: text('long_description'),
    price: decimal('price', { precision: 10, scale: 2 }).notNull(),
    pricing: jsonb('pricing'), // Additional pricing info

    // Foreign Keys
    categoryId: uuid('category_id').references(() => categories.id).notNull(),
    durationId: uuid('duration_id').references(() => durations.id),
    teacherId: uuid('teacher_id').references(() => teachers.id),

    // Image from Supabase Storage
    imageUrl: text('image_url').notNull(), // Supabase storage URL from 'course' bucket
    galleryImages: jsonb('gallery_images'), // Array of Supabase storage URLs

    // Course Details
    subcategory: text('subcategory'), // Keeping for backward compatibility or migration
    subcategoryId: uuid('subcategory_id').references(() => subcategories.id), // New dynamic relation
    features: jsonb('features'),
    level: text('level').notNull(), // Beginner, Intermediate, Advanced
    maxStudents: integer('max_students'),
    isActive: boolean('is_active').default(true).notNull(),
    deletedAt: timestamp('deleted_at'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Course Timings Junction Table (Many-to-Many)
export const courseTimings = pgTable('course_timings', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    timingId: uuid('timing_id').references(() => timings.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Course Pricings: allow multiple duration-based prices per course
export const coursePricings = pgTable('course_pricings', {
    id: uuid('id').defaultRandom().primaryKey(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    durationId: uuid('duration_id').references(() => durations.id).notNull(),
    originalPrice: decimal('original_price', { precision: 10, scale: 2 }).notNull(),
    discountedPrice: decimal('discounted_price', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').default('INR').notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Coupons table - supports percentage or fixed discounts, validity window and optional min purchase
export const coupons = pgTable('coupons', {
    id: uuid('id').defaultRandom().primaryKey(),
    code: text('code').notNull().unique(),
    discountType: text('discount_type').notNull(), // 'percentage' or 'fixed'
    discountValue: decimal('discount_value', { precision: 10, scale: 2 }).notNull(),
    minPurchaseAmount: decimal('min_purchase_amount', { precision: 10, scale: 2 }).default('0'),
    maxDiscountAmount: decimal('max_discount_amount', { precision: 10, scale: 2 }),
    usageLimit: integer('usage_limit'),
    usedCount: integer('used_count').default(0),
    validFrom: timestamp('valid_from').defaultNow(),
    validUntil: timestamp('valid_until'),
    isActive: boolean('is_active').default(true).notNull(),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Coupon Usage table to track who used which coupon
export const couponUsage = pgTable('coupon_usage', {
    id: uuid('id').defaultRandom().primaryKey(),
    couponId: uuid('coupon_id').references(() => coupons.id).notNull(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    orderId: uuid('order_id').references(() => orders.id).notNull(),
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Junction table to tie coupons to specific courses (coupon applies only to listed courses)
export const couponCourses = pgTable('coupon_courses', {
    id: uuid('id').defaultRandom().primaryKey(),
    couponId: uuid('coupon_id').references(() => coupons.id).notNull(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Orders Table
export const orders = pgTable('orders', {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id').references(() => users.id).notNull(),
    courseId: uuid('course_id').references(() => courses.id).notNull(),
    durationId: uuid('duration_id').references(() => durations.id), // Added for expiration tracking
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    couponId: uuid('coupon_id').references(() => coupons.id),
    discountAmount: decimal('discount_amount', { precision: 10, scale: 2 }).default('0'),
    finalAmount: decimal('final_amount', { precision: 10, scale: 2 }),
    status: text('status').default('pending').notNull(),
    timing: text('timing'), // Selected batch timing slot from form
    razorpayOrderId: text('razorpay_order_id'),
    razorpayPaymentId: text('razorpay_payment_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
    orders: many(orders),
    teacherProfile: one(teachers, {
        fields: [users.id],
        references: [teachers.userId],
    }),
    approvedUsers: many(users, {
        relationName: 'approver',
    }),
    approver: one(users, {
        fields: [users.approvedBy],
        references: [users.id],
        relationName: 'approver',
    }),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
    user: one(users, {
        fields: [teachers.userId],
        references: [users.id],
    }),
    courses: many(courses),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
    courses: many(courses),
    subcategories: many(subcategories),
}));

export const subcategoriesRelations = relations(subcategories, ({ one, many }) => ({
    category: one(categories, {
        fields: [subcategories.categoryId],
        references: [categories.id],
    }),
    courses: many(courses),
}));

export const durationsRelations = relations(durations, ({ many }) => ({
    courses: many(courses),
}));

export const timingsRelations = relations(timings, ({ many }) => ({
    courseTimings: many(courseTimings),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
    category: one(categories, {
        fields: [courses.categoryId],
        references: [categories.id],
    }),
    duration: one(durations, {
        fields: [courses.durationId],
        references: [durations.id],
    }),
    teacher: one(teachers, {
        fields: [courses.teacherId],
        references: [teachers.id],
    }),
    orders: many(orders),
    courseTimings: many(courseTimings),
    coursePricings: many(coursePricings),
    subcategoryDetails: one(subcategories, {
        fields: [courses.subcategoryId],
        references: [subcategories.id],
    }),
}));

export const courseTimingsRelations = relations(courseTimings, ({ one }) => ({
    course: one(courses, {
        fields: [courseTimings.courseId],
        references: [courses.id],
    }),
    timing: one(timings, {
        fields: [courseTimings.timingId],
        references: [timings.id],
    }),
}));

// Relations for course_pricings
export const coursePricingsRelations = relations(coursePricings, ({ one }) => ({
    course: one(courses, {
        fields: [coursePricings.courseId],
        references: [courses.id],
    }),
    duration: one(durations, {
        fields: [coursePricings.durationId],
        references: [durations.id],
    }),
}));

// Relations for coupons and coupon_courses
export const couponsRelations = relations(coupons, ({ many }) => ({
    couponCourses: many(couponCourses),
}));

export const couponCoursesRelations = relations(couponCourses, ({ one }) => ({
    coupon: one(coupons, {
        fields: [couponCourses.couponId],
        references: [coupons.id],
    }),
    course: one(courses, {
        fields: [couponCourses.courseId],
        references: [courses.id],
    }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    course: one(courses, {
        fields: [orders.courseId],
        references: [courses.id],
    }),
    duration: one(durations, {
        fields: [orders.durationId],
        references: [durations.id],
    }),
}));

// ─── Yoga Leads Table ─────────────────────────────────────────────────────────
// Stores enquiries submitted via the /courses/yoga/conversation chatbot page.
// Anonymous leads — no user account required.

export const yogaLeads = pgTable('yoga_leads', {
    id:          uuid('id').defaultRandom().primaryKey(),
    name:        text('name').notNull(),
    phone:       text('phone').notNull(),       // 10-digit, stored without +91
    batch:       text('batch').notNull(),        // 'Morning' | 'Afternoon' | 'Evening'
    slot:        text('slot').notNull(),         // e.g. '6–7 AM', '12–1 PM'
    requirement: text('requirement'),            // null when user clicked Skip
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
});

