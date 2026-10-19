"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Star,
    Clock,
    BookOpen,
    ChevronRight,
    ArrowRight,
    Sparkles,
    Flame,
    Award,
    CheckCircle2,
    Users,
    MessageCircle,
    SlidersHorizontal,
    AlertCircle,
    ShieldCheck
} from "lucide-react";
import { CourseWithRelations, Category } from "@/types";

interface ExploreViewProps {
    initialCourses: CourseWithRelations[];
    categories: (Category & { subcategories?: any[] })[];
    activeCategorySlug?: string;
}

export function ExploreView({
    initialCourses,
    categories,
    activeCategorySlug = "all",
}: ExploreViewProps) {
    const [selectedCategory, setSelectedCategory] = useState<string>(activeCategorySlug);
    const [selectedLevel, setSelectedLevel] = useState<string>("all");
    const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

    // Standard curated courses list with live Yoga pricing & other 4 courses marked Out of Stock
    const curatedCourses = useMemo(() => {
        const yogaDb = initialCourses.find(
            (c) =>
                c.slug === "yoga" ||
                c.category?.slug === "yoga" ||
                c.title.toLowerCase().includes("yoga")
        ) || initialCourses[0];

        const regularPricing = yogaDb?.coursePricings?.filter(
            (p) => p.duration?.name?.toLowerCase() !== "trial"
        );
        const firstPricing = regularPricing?.[0] || yogaDb?.coursePricings?.[0];
        const yogaDiscounted = firstPricing ? Number(firstPricing.discountedPrice) : Number(yogaDb?.price || 599);
        const yogaOriginal = firstPricing ? Number(firstPricing.originalPrice) : 999;
        const yogaDiscountPct = yogaOriginal > yogaDiscounted ? Math.round(((yogaOriginal - yogaDiscounted) / yogaOriginal) * 100) : 40;

        return [
            {
                id: "course-yoga",
                title: yogaDb?.title || "Online Yoga Classes",
                description: yogaDb?.description || "Enhance your strength, balance, and mindfulness through structured daily live yoga sessions with certified trainers.",
                categoryName: "Fitness",
                categorySlug: "fitness",
                mentor: yogaDb?.teacher?.user?.name || "Bhardwaj sir",
                duration: yogaDb?.duration?.name || "1, 3 & 6 Months",
                sessions: "20 Live Sessions",
                rating: 4.9,
                level: "All Levels",
                imageUrl: "/assets/yogacard.webp",
                price: yogaDiscounted,
                originalPrice: yogaOriginal,
                discountPercent: yogaDiscountPct,
                isAvailable: true,
                slug: "yoga",
            },
            {
                id: "course-trading",
                title: "Mastering Stock Trading",
                description: "Learn technical analysis, chart patterns, risk management, and live market strategies for consistent profitability.",
                categoryName: "Finance",
                categorySlug: "finance",
                mentor: "Rohan Mehta",
                duration: "12 Weeks",
                sessions: "24 Live Sessions",
                rating: 4.9,
                level: "Intermediate",
                imageUrl: "/assets/course-trading.jpg",
                price: 2999,
                originalPrice: 4999,
                discountPercent: 40,
                isAvailable: false,
                slug: "stock-trading",
            },
            {
                id: "course-hiphop",
                title: "Urban HipHop Choreography",
                description: "Master groove, rhythm, footwork, and viral choreography styles in high-energy live cohort classes.",
                categoryName: "Dance",
                categorySlug: "dance",
                mentor: "Aman Verma",
                duration: "10 Weeks",
                sessions: "20 Live Sessions",
                rating: 4.9,
                level: "Beginner",
                imageUrl: "/assets/course-hiphop.jpg",
                price: 1899,
                originalPrice: 2999,
                discountPercent: 37,
                isAvailable: false,
                slug: "urban-hiphop",
            },
            {
                id: "course-fitness",
                title: "Strength & Conditioning",
                description: "Build lean muscle, boost endurance, and master functional athletic movements with certified strength coaches.",
                categoryName: "Fitness",
                categorySlug: "fitness",
                mentor: "Karan Singh",
                duration: "12 Weeks",
                sessions: "24 Live Sessions",
                rating: 4.7,
                level: "All Levels",
                imageUrl: "/assets/cat-fitness.jpg",
                price: 2499,
                originalPrice: 3999,
                discountPercent: 38,
                isAvailable: false,
                slug: "strength-conditioning",
            },
            {
                id: "course-dance",
                title: "Contemporary Dance Pro",
                description: "Express emotion through fluid movement, floor work, dynamic turns, and contemporary dance fundamentals.",
                categoryName: "Dance",
                categorySlug: "dance",
                mentor: "Ritu Kapoor",
                duration: "9 Weeks",
                sessions: "18 Live Sessions",
                rating: 4.8,
                level: "All Levels",
                imageUrl: "/assets/cat-dance.jpg",
                price: 1799,
                originalPrice: 2499,
                discountPercent: 28,
                isAvailable: false,
                slug: "contemporary-dance",
            },
        ];
    }, [initialCourses]);

    // Categories tabs with counts based on curated courses
    const allCategories = useMemo(() => {
        return [
            { id: "all", name: "All Programs", slug: "all", icon: "✨" },
            { id: "fitness", name: "Fitness", slug: "fitness", icon: "💪" },
            { id: "finance", name: "Finance", slug: "finance", icon: "📈" },
            { id: "dance", name: "Dance", slug: "dance", icon: "💃" },
        ];
    }, []);

    // Find the featured yoga / flagship course
    const featuredCourse = useMemo(() => {
        return initialCourses.find(
            (c) =>
                c.slug === "yoga" ||
                c.category?.slug === "yoga" ||
                c.title.toLowerCase().includes("yoga")
        ) || initialCourses[0];
    }, [initialCourses]);

    // Filter & sort curated courses
    const filteredCourses = useMemo(() => {
        return curatedCourses
            .filter((course) => {
                // Category filter
                const matchesCategory =
                    selectedCategory === "all" ||
                    course.categorySlug === selectedCategory;

                // Level filter
                const matchesLevel =
                    selectedLevel === "all" ||
                    course.level.toLowerCase().includes(selectedLevel.toLowerCase());

                return matchesCategory && matchesLevel;
            })
            .sort((a, b) => {
                if (sortBy === "price-asc") {
                    return a.price - b.price;
                }
                if (sortBy === "price-desc") {
                    return b.price - a.price;
                }
                return 0; // featured / default order
            });
    }, [curatedCourses, selectedCategory, selectedLevel, sortBy]);

    return (
        <div className="min-h-screen bg-[#fcfbfe] text-gray-900 relative selection:bg-purple-600 selection:text-white pb-24">
            {/* Soft Ambient Background Highlights */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[140px]" />
                <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-fuchsia-100/60 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/4 left-1/3 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[160px]" />
            </div>

            {/* 1. Hero Header Section */}
            <section className="relative pt-12 pb-8 sm:pt-16 sm:pb-12 border-b border-purple-100/80 bg-gradient-to-b from-purple-50/60 via-white to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100/80 border border-purple-200 text-purple-700 mb-6 shadow-sm"
                    >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                            Structured Live Cohorts & Certification
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 mb-5 leading-tight"
                    >
                        Explore Our Live Programs &{" "}
                        <span className="bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                            Master New Skills
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 }}
                        className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
                    >
                        Join expert-led live interactive classes in Yoga, Fitness, Dance, and Finance. Get real-time corrections, capped batch sizes, and certificates.
                    </motion.p>

                    {/* Trust Highlights */}
                    <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs sm:text-sm font-medium text-gray-600">
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-100 shadow-sm">
                            <Users className="w-4 h-4 text-purple-600" />
                            <span><strong className="text-gray-900 font-bold">5,000+</strong> Active Learners</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-100 shadow-sm">
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                            <span><strong className="text-gray-900 font-bold">4.9/5</strong> Rating</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-100 shadow-sm">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span><strong className="text-gray-900 font-bold">100%</strong> Live Classes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-purple-100 shadow-sm">
                            <Award className="w-4 h-4 text-purple-600" />
                            <span>Verified Certificate</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. Spotlight Flagship Card (Featured Program) */}
            {featuredCourse && (
                <section className="py-10 relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative rounded-[2rem] p-1 bg-gradient-to-r from-purple-200 via-fuchsia-200 to-indigo-200 shadow-xl shadow-purple-500/5">
                            <div className="rounded-[1.9rem] bg-white p-6 sm:p-10 lg:p-12 overflow-hidden relative">
                                <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                                    {/* Left Content */}
                                    {(() => {
                                        const featuredPricings = featuredCourse.coursePricings || [];
                                        const featuredStandardPricing = featuredPricings.find((p: any) => {
                                            const l = p.duration?.name?.toLowerCase() || '';
                                            return !l.includes('trial') && !l.includes('demo');
                                        }) || featuredPricings[0];
                                        const featuredTrialPricing = featuredPricings.find((p: any) => {
                                            const l = p.duration?.name?.toLowerCase() || '';
                                            return l.includes('trial') || l.includes('demo');
                                        });

                                        const featuredDiscounted = featuredStandardPricing ? Number(featuredStandardPricing.discountedPrice) : Number(featuredCourse.price || 599);
                                        const featuredOriginal = featuredStandardPricing ? Number(featuredStandardPricing.originalPrice) : (featuredDiscounted > 0 ? Math.round(featuredDiscounted * 1.5) : 999);
                                        const featuredDiscountPct = featuredOriginal > featuredDiscounted ? Math.round(((featuredOriginal - featuredDiscounted) / featuredOriginal) * 100) : 0;
                                        const trialPriceVal = featuredTrialPricing ? Number(featuredTrialPricing.discountedPrice) : 20;

                                        return (
                                            <div className="lg:col-span-7 space-y-5">
                                                <div className="flex flex-wrap items-center gap-2.5">
                                                    <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                                                        <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                                                        Featured Program
                                                    </span>
                                                    <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                                                        🎁 ₹{trialPriceVal} Trial Class Available
                                                    </span>
                                                    <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-200 text-xs font-semibold text-gray-700">
                                                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                        <span>4.9 (2,800+ reviews)</span>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h2 className="text-3xl sm:text-4xl font-black text-gray-950 leading-tight mb-3">
                                                        {featuredCourse.title}
                                                    </h2>
                                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                                                        {featuredCourse.description}
                                                    </p>
                                                </div>

                                                {/* Key Highlights */}
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                                                    <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                                                        <p className="text-[11px] text-purple-700 uppercase font-bold tracking-wider">Schedule</p>
                                                        <p className="text-sm font-bold text-gray-900">5 Days/Week</p>
                                                    </div>
                                                    <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                                                        <p className="text-[11px] text-purple-700 uppercase font-bold tracking-wider">Batches</p>
                                                        <p className="text-sm font-bold text-gray-900">Morning & Evening</p>
                                                    </div>
                                                    <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                                                        <p className="text-[11px] text-purple-700 uppercase font-bold tracking-wider">Format</p>
                                                        <p className="text-sm font-bold text-purple-700">100% Live Online</p>
                                                    </div>
                                                </div>

                                                {/* Pricing & Actions */}
                                                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100">
                                                    <div>
                                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Starting at</p>
                                                        <div className="flex items-baseline gap-2">
                                                            <span className="text-3xl sm:text-4xl font-black text-gray-950">₹{featuredDiscounted}</span>
                                                            {featuredOriginal > featuredDiscounted && (
                                                                <span className="text-sm text-gray-400 line-through">₹{featuredOriginal}</span>
                                                            )}
                                                            {featuredDiscountPct > 0 && (
                                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                                                                    {featuredDiscountPct}% OFF
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <Link
                                                            href="/courses/yoga"
                                                            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 font-bold text-sm text-white hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-md hover:shadow-lg shadow-purple-600/20 flex items-center gap-2"
                                                        >
                                                            View Details & Batches
                                                            <ArrowRight className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href="/courses/yoga#enroll"
                                                            className="px-5 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 font-bold text-sm text-purple-900 transition-all flex items-center gap-2 shadow-sm"
                                                        >
                                                            <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
                                                            Book ₹{trialPriceVal} Trial Class
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    {/* Right Image Container */}
                                    <div className="lg:col-span-5 relative">
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 shadow-xl group">
                                            <Image
                                                src="/assets/yogacard.webp"
                                                alt={featuredCourse.title}
                                                fill
                                                priority
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                                <span className="px-3 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-bold text-white">
                                                    {featuredCourse.teacher?.user?.name || "Master Instructor"}
                                                </span>
                                                <span className="px-3 py-1 rounded-lg bg-purple-600 text-xs font-bold text-white shadow-sm">
                                                    20 Live Sessions
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* 3. Main Course Explorer Section */}
            <section id="explore-grid" className="py-8 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header + Filter Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-black text-gray-950">
                                All Live Programs ({filteredCourses.length})
                            </h2>
                            <p className="text-gray-500 text-sm mt-0.5">
                                Choose from our curated live classes
                            </p>
                        </div>

                        {/* Controls (Level + Sort) */}
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Level Filter */}
                            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 shadow-sm">
                                <span className="text-gray-400">Level:</span>
                                <select
                                    value={selectedLevel}
                                    onChange={(e) => setSelectedLevel(e.target.value)}
                                    className="bg-transparent text-gray-900 font-bold outline-none cursor-pointer"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-medium text-gray-700 shadow-sm">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                                <span className="text-gray-400">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="bg-transparent text-gray-900 font-bold outline-none cursor-pointer"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
                        {allCategories.map((cat) => {
                            const isSelected = selectedCategory === cat.slug;
                            const count =
                                cat.slug === "all"
                                    ? curatedCourses.length
                                    : curatedCourses.filter((c) => c.categorySlug === cat.slug).length;

                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.slug)}
                                    className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border shadow-sm ${
                                        isSelected
                                            ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-purple-600 shadow-purple-600/20 scale-105"
                                            : "bg-white text-gray-700 hover:text-gray-950 border-gray-200 hover:border-purple-200 hover:bg-purple-50/50"
                                    }`}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.name}</span>
                                    <span
                                        className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                                            isSelected
                                                ? "bg-white/25 text-white"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Courses Grid */}
                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {filteredCourses.map((course, index) => {
                                const isYoga = course.isAvailable;

                                return (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.35, delay: index * 0.04 }}
                                        className="h-full"
                                    >
                                        <div className="h-full rounded-3xl bg-white border border-gray-200/80 hover:border-purple-400 transition-all duration-300 flex flex-col overflow-hidden shadow-md hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1.5 group">
                                            {/* Image Container */}
                                            <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                                                <Image
                                                    src={course.imageUrl}
                                                    alt={course.title}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                                                {/* Out of Stock Overlay */}
                                                {!course.isAvailable && (
                                                    <div className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex items-center justify-center z-20">
                                                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black uppercase tracking-widest shadow-lg border border-white/20">
                                                            Out of Stock
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Badges Overlay */}
                                                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                                                    {course.isAvailable ? (
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 text-purple-700 border border-purple-200 backdrop-blur-md shadow-sm">
                                                            {course.categoryName}
                                                        </span>
                                                    ) : (
                                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white border border-red-500 backdrop-blur-md flex items-center gap-1 shadow-sm">
                                                            <AlertCircle size={12} />
                                                            Out of Stock
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="absolute top-3 right-3 z-10">
                                                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-gray-200 text-amber-600 text-xs font-bold shadow-sm">
                                                        <Star size={12} className="fill-amber-400 text-amber-400" />
                                                        <span>{course.rating}</span>
                                                    </div>
                                                </div>

                                                <div className="absolute bottom-3 left-3 z-10">
                                                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/20">
                                                        {course.level}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Body */}
                                            <div className="p-6 flex flex-col flex-grow">
                                                {isYoga ? (
                                                    <Link href="/courses/yoga">
                                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 mb-2">
                                                            {course.title}
                                                        </h3>
                                                    </Link>
                                                ) : (
                                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1 mb-2">
                                                        {course.title}
                                                    </h3>
                                                )}

                                                <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-4 flex-grow">
                                                    {course.description}
                                                </p>

                                                {/* Meta details */}
                                                <div className="flex items-center gap-4 py-3 border-y border-gray-100 text-xs text-gray-600 mb-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <Clock size={13} className="text-purple-600" />
                                                        <span>{course.duration}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <BookOpen size={13} className="text-fuchsia-600" />
                                                        <span>{course.sessions}</span>
                                                    </div>
                                                </div>

                                                {/* Instructor */}
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-600 flex items-center justify-center text-[10px] font-bold text-white">
                                                            {course.mentor?.[0] || "M"}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-semibold text-gray-900">
                                                                {course.mentor}
                                                            </span>
                                                            <span className="text-[10px] text-gray-500">Live Mentor</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Pricing & CTA Button */}
                                                <div className="pt-2 flex items-center justify-between">
                                                    <div>
                                                        {!course.isAvailable ? (
                                                            <span className="text-xs font-bold text-red-600">Out of Stock</span>
                                                        ) : (
                                                            <div className="flex items-baseline gap-1.5">
                                                                <span className="text-xl font-black text-gray-950">
                                                                    ₹{Number(course.price).toLocaleString()}
                                                                </span>
                                                                {course.originalPrice && Number(course.originalPrice) > Number(course.price) && (
                                                                    <span className="text-xs text-gray-400 line-through">
                                                                        ₹{Number(course.originalPrice).toLocaleString()}
                                                                    </span>
                                                                )}
                                                                {course.discountPercent && (
                                                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                                                                        {course.discountPercent}% OFF
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {isYoga ? (
                                                        <Link
                                                            href="/courses/yoga"
                                                            className="px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-md shadow-purple-600/20 hover:scale-[1.02]"
                                                        >
                                                            Enroll Now
                                                            <ChevronRight size={14} />
                                                        </Link>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none select-none"
                                                        >
                                                            Out of Stock
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-3xl border border-gray-200">
                            <div className="text-5xl mb-4">🧘</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No programs in this category yet</h3>
                            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                                Try selecting "All Programs" to explore available courses.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedCategory("all");
                                    setSelectedLevel("all");
                                }}
                                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md"
                            >
                                View All Programs
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* 4. Why Learn With Navigate Skill Advantage */}
            <section className="py-16 border-t border-purple-100/80 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2 block">
                            The Navigate Skill Advantage
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-950 mb-4">
                            Why Thousands Choose Our Live Programs
                        </h2>
                        <p className="text-gray-600 text-sm sm:text-base">
                            We believe live interaction drives real learning. No dull recordings, just interactive training tailored to your progress.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: "🎥",
                                title: "100% Live Sessions",
                                desc: "Real-time posture corrections, instructor Q&A, and interactive practice every single day.",
                            },
                            {
                                icon: "👥",
                                title: "Capped Batch Sizes",
                                desc: "Small groups ensure the instructor sees and corrects you individually throughout the class.",
                            },
                            {
                                icon: "🏆",
                                title: "Verified Certification",
                                desc: "Earn completion certificates upon finishing your course to showcase your achievement.",
                            },
                            {
                                icon: "💬",
                                title: "Direct Mentor Support",
                                desc: "Get answers to your queries and workout advice directly via WhatsApp support.",
                            },
                        ].map((feature, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-3xl bg-purple-50/40 border border-purple-100 hover:border-purple-300 hover:bg-purple-50 transition-all group shadow-sm"
                            >
                                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Free Trial Call to Action Banner */}
            <section className="py-12">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="rounded-[2.5rem] bg-gradient-to-r from-purple-700 via-fuchsia-700 to-purple-800 border border-purple-500/30 p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
                        <div className="relative z-10 space-y-6">
                            <span className="px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-xs font-bold uppercase tracking-wider text-purple-100 inline-block backdrop-blur-md">
                                Not Sure Which Program To Choose?
                            </span>
                            {(() => {
                                const featuredPricings = featuredCourse?.coursePricings || [];
                                const featuredTrialPricing = featuredPricings.find((p: any) => {
                                    const l = p.duration?.name?.toLowerCase() || '';
                                    return l.includes('trial') || l.includes('demo');
                                });
                                const trialPriceVal = featuredTrialPricing ? Number(featuredTrialPricing.discountedPrice) : 20;

                                return (
                                    <>
                                        <h2 className="text-3xl sm:text-5xl font-black">
                                            Book A Live Trial Class for ₹{trialPriceVal}
                                        </h2>
                                        <p className="text-purple-100 max-w-xl mx-auto text-sm sm:text-base">
                                            Experience our interactive teaching method firsthand. Book your ₹{trialPriceVal} live trial slot today.
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-4 pt-2">
                                            <Link
                                                href="/courses/yoga#enroll"
                                                className="px-8 py-4 rounded-full bg-white hover:bg-purple-50 text-purple-900 font-black text-sm tracking-wide transition-all shadow-xl hover:scale-[1.02] flex items-center gap-2"
                                            >
                                                <Sparkles className="w-5 h-5 text-purple-600" />
                                                Book ₹{trialPriceVal} Trial Class
                                            </Link>
                                            <Link
                                                href="/contact"
                                                className="px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/30 transition-all backdrop-blur-md"
                                            >
                                                Contact Support
                                            </Link>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
