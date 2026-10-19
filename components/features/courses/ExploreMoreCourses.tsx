"use client";

import { useState, useEffect } from "react";
import { Course } from "@/types/course";
import { CourseCard } from "./CourseCard";
import { motion } from "framer-motion";
import Link from "next/link";

interface ExploreMoreCoursesProps {
    excludeCategory?: string;
    title?: string;
    description?: string;
}

export const ExploreMoreCourses = ({
    excludeCategory,
    title = "Explore More Courses",
    description = "Discover other amazing skills you can learn today."
}: ExploreMoreCoursesProps) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Fetch all courses and we'll filter/shuffle here for simplicity
                const response = await fetch('/api/courses');
                const data = await response.json();

                if (Array.isArray(data)) {
                    let filtered = data;
                    if (excludeCategory) {
                        filtered = data.filter(c => c.category?.slug !== excludeCategory);
                    }

                    // Shuffle and take 3
                    const shuffled = filtered.sort(() => 0.5 - Math.random());
                    setCourses(shuffled.slice(0, 3));
                }
            } catch (error) {
                console.error('Failed to fetch explore courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [excludeCategory]);

    if (!loading && courses.length === 0) return null;

    return (
        <section className="py-20 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4"
                    >
                        {title}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 max-w-2xl mx-auto"
                    >
                        {description}
                    </motion.p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, i) => (
                            <CourseCard key={course.id} course={course} index={i} />
                        ))}
                    </div>
                )}

                <div className="mt-12 text-center">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 text-purple-400 font-bold hover:text-purple-300 transition-colors"
                    >
                        View All Categories
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
};
