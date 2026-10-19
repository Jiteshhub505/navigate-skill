import { getCategories } from "@/app/actions/public-courses";
import Link from "next/link";
import { ChevronRight, BookOpen, Layers, Users } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "All Course Categories | Yoga, Fitness, Dance & Trading",
    description: "Explore all course categories at Navigate Skill Academy — online yoga classes, fitness training, dance courses, and stock trading programs in India.",
    alternates: {
        canonical: '/categories',
    },
    openGraph: {
        title: "All Course Categories — Navigate Skill Academy",
        description: "Explore online yoga, fitness, dance and trading courses at Navigate Skill Academy.",
        url: 'https://navigateskill.com/categories',
    }
};

const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://navigateskill.com" },
        { "@type": "ListItem", "position": 2, "name": "Categories", "item": "https://navigateskill.com/categories" }
    ]
};

export const revalidate = 3600;

export default async function CategoriesPage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#faf7ff]">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 mb-2">
                        <Layers size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">Course Catalog</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight">Explore Categories</h1>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">Discover specialized learning paths designed to take you from beginner to expert.</p>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {categories.map((category: any) => (
                        <div key={category.id} className="group relative bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-purple-200 transition-all duration-500 shadow-md">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                                {/* Category Image/Hero */}
                                <div className="lg:col-span-4 relative h-64 lg:h-auto overflow-hidden">
                                    <Image
                                        src={category.imageUrl || (category.slug === 'yoga' ? '/assets/yogacard.webp' : '/assets/trading/trading.avif')}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                    <div className="absolute bottom-6 left-6">
                                        <h2 className="text-2xl sm:text-3xl font-black text-white">{category.name}</h2>
                                    </div>
                                </div>

                                {/* Content & Subcategories */}
                                <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-center">
                                    <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-2xl leading-relaxed">
                                        {category.description || `Master the art of ${category.name.toLowerCase()} with our comprehensive curriculum and expert-led sessions.`}
                                    </p>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-purple-700">
                                            <div className="w-6 h-0.5 bg-purple-600 rounded-full" />
                                            Popular Subcategories
                                        </div>

                                        <div className="flex flex-wrap gap-2.5">
                                            {category.subcategories?.map((sub: any) => (
                                                <Link
                                                    key={sub.id}
                                                    href={`/${category.slug}/subcategory/${sub.slug}`}
                                                    className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50/50 transition-all font-semibold text-xs sm:text-sm flex items-center gap-1.5 group/sub"
                                                >
                                                    {sub.name}
                                                    <ChevronRight size={14} className="text-gray-400 group-hover/sub:text-purple-600 transition-colors" />
                                                </Link>
                                            ))}
                                            {(!category.subcategories || category.subcategories.length === 0) && (
                                                <span className="text-gray-400 text-xs italic">Live sessions updated regularly.</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <BookOpen size={16} className="text-purple-600" />
                                                <span className="text-xs sm:text-sm font-bold text-gray-700">Structured Batches</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Users size={16} className="text-purple-600" />
                                                <span className="text-xs sm:text-sm font-bold text-gray-700">Live Mentorship</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/${category.slug}`}
                                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-xs sm:text-sm hover:from-purple-700 hover:to-fuchsia-700 transition-all shadow-md shadow-purple-600/20"
                                        >
                                            View Courses
                                            <ChevronRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
