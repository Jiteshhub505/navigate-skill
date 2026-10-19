export interface Course {
    id: string;
    slug: string;
    title: string;
    description: string;
    longDescription?: string;
    price: string;
    pricing?: Record<string, any> | null;
    imageUrl: string;
    galleryImages?: string[];
    subcategory?: string | null;
    subcategoryId?: string | null;
    features?: string[];
    level: string;
    maxStudents?: number | string | null;
    isActive: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
    deletedAt?: Date | string | null;
    categoryId: string;
    teacherId?: string | null;
    durationId?: string | null;
}

export interface CoursePricing {
    id: string;
    courseId: string;
    durationId: string;
    originalPrice: string;
    discountedPrice: string;
    currency: string;
    isActive: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
    imageUrl?: string | null;
    deletedAt?: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Subcategory {
    id: string;
    name: string;
    slug: string;
    categoryId: string;
    description?: string | null;
    deletedAt?: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
    category?: Category;
}

export interface Teacher {
    id: string;
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    bio?: string | null;
    expertise?: string[] | null;
    experience?: number | null;
    qualifications?: string[] | null;
    profileImageUrl?: string | null;
    socialLinks?: Record<string, string> | null;
    isActive: boolean;
    deletedAt?: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface Duration {
    id: string;
    name: string;
    value: number;
    unit: string;
    createdAt: Date | string;
}

export interface Timing {
    id: string;
    name: string;
    startTime: string;
    endTime: string;
    days?: string[] | null;
    createdAt: Date | string;
}

export interface CoursePricingWithDuration extends CoursePricing {
    duration?: Duration;
}

export interface CourseTimingWithTiming {
    id: string;
    courseId: string;
    timingId: string;
    timing?: Timing;
    createdAt: Date | string;
}

export interface CourseWithRelations extends Course {
    category?: Category;
    subcategoryDetails?: Subcategory;
    teacher?: Teacher;
    duration?: Duration;
    courseTimings?: CourseTimingWithTiming[];
    coursePricings?: CoursePricingWithDuration[];
    timingIds?: string[];
}

export interface Coupon {
    id: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: string;
    minPurchaseAmount: string;
    maxDiscountAmount?: string | null;
    usageLimit?: number | null;
    usedCount: number;
    validFrom: Date | string | null;
    validUntil: Date | string | null;
    isActive: boolean;
    deletedAt?: Date | string | null;
    createdAt: Date | string;
    updatedAt: Date | string;
}

