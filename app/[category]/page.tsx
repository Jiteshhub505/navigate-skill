import { notFound } from "next/navigation";
import { getCategoryWithSubcategories, getCoursesByCategory } from "@/app/actions/public-courses";
import { CourseCard } from "@/components/features/courses/CourseCard";
import Link from "next/link";
import { ChevronRight, Filter, BookOpen, Users, Star } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ category: string }>
}): Promise<Metadata> {
    const { category: categorySlug } = await params;
    const category = await getCategoryWithSubcategories(categorySlug);

    if (!category) {
        return {
            title: "Category | Navigate Skill Academy",
        };
    }

    const title = `${category.name} Classes Online | Navigate Skill Academy`;
    const description = category.description
        ? `${category.description.slice(0, 155)}...`
        : `Explore professional ${category.name.toLowerCase()} courses online. Interactive live classes, expert-led guidance, and certification at Navigate Skill Academy.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/${categorySlug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://navigateskill.com/${categorySlug}`,
        }
    };
}


export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category: categorySlug } = await params;

    const category = await getCategoryWithSubcategories(categorySlug);
    if (!category) notFound();

    const courses = await getCoursesByCategory(categorySlug);

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header Section */}
            <div className="relative py-12 overflow-hidden border-b border-gray-200">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-purple-200/30 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 border border-purple-200 mb-4">
                        <span className="text-xs font-bold uppercase tracking-widest">Explore Category</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                        {category.name}
                    </h1>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {category.description || `Master ${category.name.toLowerCase()} with our industry-leading courses and expert mentors.`}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar - Subcategories */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
                                <Filter size={18} className="text-purple-600" />
                                Subcategories
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    href={`/${categorySlug}`}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-purple-600 text-white font-bold transition-all"
                                >
                                    All Courses
                                    <ChevronRight size={16} />
                                </Link>
                                {category.subcategories?.map((sub: any) => (
                                    <Link
                                        key={sub.id}
                                        href={`/${categorySlug}/subcategory/${sub.slug}`}
                                        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-purple-500/50 transition-all group"
                                    >
                                        {sub.name}
                                        <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-gray-50 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <BookOpen size={24} />
                                </div>
                                <div>
                                    <div className="text-gray-900 font-bold">{courses.length}</div>
                                    <div className="text-gray-500 text-xs uppercase font-black tracking-widest">Courses</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
                                    <Users size={24} />
                                </div>
                                <div>
                                    <div className="text-gray-900 font-bold">10k+</div>
                                    <div className="text-gray-500 text-xs uppercase font-black tracking-widest">Students</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600">
                                    <Star size={24} />
                                </div>
                                <div>
                                    <div className="text-gray-900 font-bold">4.9/5</div>
                                    <div className="text-gray-500 text-xs uppercase font-black tracking-widest">Avg Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Course Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gray-900">Available Courses</h2>
                            <div className="h-px flex-1 bg-gray-200 mx-8 hidden sm:block" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {courses.map((course: any) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                            {courses.length === 0 && (
                                <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                    <p className="text-gray-500 text-lg">No courses found in this category yet.</p>
                                    <Link href="/explore" className="text-purple-600 font-bold mt-4 inline-block hover:underline">Browse all courses</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
