import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";

export default async function MyCoursesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch completed orders with course details
    const enrolledCourses = await db.query.orders.findMany({
        where: (orders, { eq, and }) => and(
            eq(orders.userId, user.id),
            eq(orders.status, 'completed')
        ),
        with: {
            course: {
                with: {
                    category: true,
                    teacher: {
                        with: {
                            user: true
                        }
                    },
                    duration: true
                }
            }
        },
        orderBy: (orders, { desc }) => [desc(orders.createdAt)]
    });

    return (
        <div className="min-h-screen bg-[#faf7ff] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-10">
                    <span className="px-3.5 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                        Student Dashboard
                    </span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 mb-3 tracking-tight">
                        My <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Learning</span>
                    </h1>
                    <p className="text-gray-600 text-base max-w-2xl">
                        Continue your wellness journey and access your enrolled sessions.
                    </p>
                </div>

                {enrolledCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {enrolledCourses.map((enrollment) => {
                            const course = enrollment.course;
                            if (!course) return null;

                            return (
                                <div
                                    key={enrollment.id}
                                    className="group bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col"
                                >
                                    {/* Image Section */}
                                    <div className="relative h-52 w-full overflow-hidden">
                                        <Image
                                            src={course.imageUrl || "/assets/yogacard.webp"}
                                            alt={course.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-purple-800 shadow-sm">
                                                {course.category?.name || "Online Course"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content Section */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-600 text-xs sm:text-sm mb-6 line-clamp-2 flex-grow">
                                            {course.description}
                                        </p>

                                        {/* Instructor & Duration */}
                                        <div className="flex items-center justify-between mb-6 pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xs font-bold">
                                                    {course.teacher?.user?.name?.charAt(0) || "I"}
                                                </div>
                                                <span className="text-xs text-gray-700 font-semibold">
                                                    {course.teacher?.user?.name || "Instructor"}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                <Clock className="w-4 h-4 text-purple-600" />
                                                {course.duration?.name || "Active"}
                                            </div>
                                        </div>

                                        {/* Action Button */}
                                        <Link
                                            href={`/${course.category?.slug || 'fitness'}/${course.slug}`}
                                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-sm text-center hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-sm shadow-purple-600/20"
                                        >
                                            Continue Learning
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto p-8">
                        <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                            <BookOpen className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">No active courses yet</h2>
                        <p className="text-gray-500 text-sm mb-6">You have not enrolled in any courses or trial classes yet.</p>
                        <Link
                            href="/explore"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-sm hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-md shadow-purple-600/20"
                        >
                            Explore Courses
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
