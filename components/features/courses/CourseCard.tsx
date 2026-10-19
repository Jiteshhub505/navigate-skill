"use client";

import Link from "next/link";
import Image from "next/image";
import { CourseWithRelations } from "@/types";
import { Clock, Users, ChevronRight, Star, AlertTriangle, BookOpen, Award } from "lucide-react";

interface CourseCardProps {
    course: CourseWithRelations;
    index?: number;
}

export const CourseCard = ({ course, index = 0 }: CourseCardProps) => {
    const categorySlug = course.category?.slug || 'course';
    const categoryName = course.category?.name || 'Category';
    const durationName = course.duration?.name || 'Duration';
    const teacherName = course.teacher?.user?.name || 'Expert Instructor';

    // Check if course is soft-deleted (Out of Stock)
    const isOutOfStock = !!course.deletedAt;

    // Check if course is yoga (only yoga should be clickable)
    const isYoga = categorySlug.toLowerCase() === 'yoga' ||
                   categoryName.toLowerCase() === 'yoga' ||
                   course.title.toLowerCase().includes('yoga') ||
                   (course.subcategory && course.subcategory.toLowerCase().includes('yoga'));

    // Handle pricing safely - skip trial option and get first regular pricing
    const regularPricing = course.coursePricings?.filter(p => 
        p.duration?.name?.toLowerCase() !== 'trial'
    );
    const firstPricing = regularPricing?.[0] || course.coursePricings?.[0];
    const price = course.price;
    const discountedPrice = firstPricing ? firstPricing.discountedPrice : price;
    const originalPrice = firstPricing ? firstPricing.originalPrice : price;

    const cardContent = (
        <div
            style={{
                // CSS fade-in-up — zero JS, runs on GPU
                animation: `fadeInUp 0.5s ease both`,
                animationDelay: `${index * 80}ms`,
            }}
            className={`h-full bg-white rounded-[1.5rem] border transition-all duration-300 flex flex-col overflow-hidden relative shadow-lg hover:shadow-2xl hover:-translate-y-2 ${
                isOutOfStock
                    ? 'border-amber-200 hover:border-amber-400'
                    : 'border-gray-200 hover:border-[#A020F0] hover:shadow-[#A020F0]/20'
            } ${!isYoga ? 'cursor-default' : ''}`}
        >
            {/* Course Image Container */}
            <div className="relative h-52 w-full overflow-hidden">
                <Image
                    src={isYoga ? "/assets/yogacard.webp" : course.imageUrl}
                    alt={course.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`object-cover transition-transform duration-500 group-hover:scale-105 ${isOutOfStock ? 'grayscale-[50%]' : ''}`}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Out of Stock Overlay */}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-amber-900/30" />
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {isOutOfStock && (
                        <span className="px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-amber-100/90 backdrop-blur-md text-amber-700 border border-amber-300 flex items-center gap-1.5">
                            <AlertTriangle size={12} />
                            Out of Stock
                        </span>
                    )}
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white/90 backdrop-blur-md text-[#A020F0] border border-[#A020F0]/30">
                        {course.subcategory || categoryName}
                    </span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md border border-yellow-400 text-yellow-600">
                        <Star size={12} fill="currentColor" />
                        <span className="text-[10px] font-bold">4.9</span>
                    </div>
                </div>

                <div className="absolute bottom-4 left-4 z-10">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg ${
                        isOutOfStock
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-gradient-to-r from-[#A020F0] to-[#D946EF] text-white'
                    }`}>
                        {course.level}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow relative bg-white">
                {/* Title */}
                <h3 className={`text-lg font-bold mb-2 transition-colors line-clamp-2 leading-tight ${
                    isOutOfStock
                        ? 'text-gray-400 group-hover:text-amber-600'
                        : 'text-gray-900 group-hover:text-[#A020F0]'
                }`}>
                    {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2 flex-grow">
                    {course.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <Clock size={14} className={isOutOfStock ? 'text-amber-500' : 'text-[#A020F0]'} />
                        <span className="text-xs font-medium">{durationName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                        <BookOpen size={14} className={isOutOfStock ? 'text-amber-500' : 'text-[#D946EF]'} />
                        <span className="text-xs font-medium">48 Lessons</span>
                    </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#A020F0] to-[#D946EF]" />
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-900">{teacherName}</span>
                        <span className="text-[10px] text-gray-500">Expert Instructor</span>
                    </div>
                </div>

                {/* Pricing & CTA */}
                <div className="pt-4 border-t border-gray-100 mt-auto flex items-center justify-between">
                    {isOutOfStock ? (
                        <div className="flex flex-col">
                            <span className="text-amber-600 text-sm font-bold">Currently Unavailable</span>
                            <span className="text-gray-500 text-xs">Enquire for availability</span>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <span className="text-gray-400 text-[10px] line-through font-medium">
                                ₹{Number(originalPrice).toLocaleString()}
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-gray-900 text-xl font-black tracking-tight">
                                    ₹{Number(discountedPrice).toLocaleString()}
                                </span>
                                <span className="text-gray-500 text-[10px] font-bold uppercase">/ course</span>
                            </div>
                        </div>
                    )}

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 transform group-hover:rotate-[-10deg] ${
                        isOutOfStock
                            ? 'bg-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
                            : 'bg-gradient-to-r from-[#A020F0]/10 to-[#D946EF]/10 text-[#A020F0] group-hover:bg-gradient-to-r group-hover:from-[#A020F0] group-hover:to-[#D946EF] group-hover:text-white'
                    }`}>
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>

            {/* Glow Border Effect on Hover */}
            <div className={`absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                isOutOfStock
                    ? 'bg-gradient-to-r from-amber-400/20 to-amber-600/20'
                    : 'bg-gradient-to-r from-[#A020F0]/20 via-[#D946EF]/20 to-[#FF4FD8]/20'
            }`} />
        </div>
    );

    // Only wrap with Link if it's a yoga course
    if (isYoga) {
        return (
            <Link href="/courses/yoga" className="block group h-full">
                {cardContent}
            </Link>
        );
    }

    return <div className="block group h-full">{cardContent}</div>;
};
