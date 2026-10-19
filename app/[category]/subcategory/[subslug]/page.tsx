import { notFound } from "next/navigation";
import { getSubcategoryWithCourses, getCategoryWithSubcategories } from "@/app/actions/public-courses";
import { CourseCard } from "@/components/features/courses/CourseCard";
import Link from "next/link";
import { ChevronRight, Filter, BookOpen, Users, Star, ArrowLeft } from "lucide-react";
import { Metadata } from "next";

export async function generateMetadata({
    params
}: {
    params: Promise<{ category: string; subslug: string }>
}): Promise<Metadata> {
    const { category: categorySlug, subslug } = await params;
    const subcategory = await getSubcategoryWithCourses(subslug);

    if (!subcategory) {
        return {
            title: "Subcategory | Navigate Skill Academy",
        };
    }

    const title = `${subcategory.name} Online Classes | ${subcategory.category?.name || "Category"} | Navigate Skill Academy`;
    const description = subcategory.description
        ? `${subcategory.description.slice(0, 155)}...`
        : `Learn ${subcategory.name.toLowerCase()} online at Navigate Skill Academy. Live expert guidance, structured courses, and certification.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/${categorySlug}/subcategory/${subslug}`,
        },
        openGraph: {
            title,
            description,
            url: `https://navigateskill.com/${categorySlug}/subcategory/${subslug}`,
        }
    };
}


export default async function SubcategoryPage({
    params
}: {
    params: Promise<{ category: string; subslug: string }>
}) {
    const { category: categorySlug, subslug } = await params;

    const subcategory = await getSubcategoryWithCourses(subslug);
    if (!subcategory || subcategory.category?.slug !== categorySlug) notFound();

    const category = await getCategoryWithSubcategories(categorySlug);

    return (
        <div className="min-h-screen bg-white pt-10 pb-20">
            {/* Header Section */}
            <div className="relative py-16 overflow-hidden border-b border-gray-200">
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-200/30 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href={`/${categorySlug}`}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-8 font-bold text-sm group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to {subcategory.category?.name}
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-600 border border-blue-200 mb-6">
                                <span className="text-xs font-bold uppercase tracking-widest">Subcategory</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                                {subcategory.name}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {subcategory.description || `Specialized courses in ${subcategory.name.toLowerCase()} to help you reach the next level.`}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-center">
                                <div className="text-2xl font-black text-gray-900">{subcategory.courses?.length || 0}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Courses</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-center">
                                <div className="text-2xl font-black text-gray-900">4.8</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">Rating</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar - Other Subcategories */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-gray-900 font-bold mb-6 flex items-center gap-2">
                                <Filter size={18} className="text-purple-600" />
                                More in {subcategory.category?.name}
                            </h3>
                            <div className="space-y-2">
                                <Link
                                    href={`/${categorySlug}`}
                                    className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-200 text-gray-600 hover:text-gray-900 transition-all"
                                >
                                    All Courses
                                    <ChevronRight size={16} />
                                </Link>
                                {category?.subcategories?.map((sub: any) => (
                                    <Link
                                        key={sub.id}
                                        href={`/${categorySlug}/subcategory/${sub.slug}`}
                                        className={`flex items-center justify-between p-4 rounded-2xl transition-all group ${sub.slug === subslug
                                            ? 'bg-purple-600 text-white font-bold'
                                            : 'bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-purple-500/50'
                                            }`}
                                    >
                                        {sub.name}
                                        {sub.slug !== subslug && <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Course Grid */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-black text-gray-900">{subcategory.name} Courses</h2>
                            <div className="h-px flex-1 bg-gray-200 mx-8 hidden sm:block" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {subcategory.courses?.map((course: any) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                            {(!subcategory.courses || subcategory.courses.length === 0) && (
                                <div className="col-span-full py-32 text-center bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                                    <p className="text-gray-500 text-lg">No courses found in this subcategory yet.</p>
                                    <Link href={`/${categorySlug}`} className="text-purple-600 font-bold mt-4 inline-block hover:underline">View all {subcategory.category?.name} courses</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
