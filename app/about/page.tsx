import { Suspense } from "react";
import { getTeachers } from "@/app/actions/public-courses";
import AboutContent from "@/components/about/AboutContent";
import { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
    title: "About Us | Our Mission & Expert Team",
    description: "Discover Navigate Skill Academy's mission to make quality online yoga, fitness, dance and trading education accessible across India. Meet our expert instructors and learn our story.",
    alternates: {
        canonical: '/about',
    },
    openGraph: {
        title: "About Navigate Skill Academy",
        description: "Our mission is to make expert-led online yoga, fitness, dance and trading courses accessible to everyone in India.",
        url: 'https://navigateskill.com/about',
    }
};

// Async component that loads teachers in the background
async function TeachersSection() {
    const teachers = await getTeachers(3);
    if (!teachers || teachers.length === 0) return null;

    // Lazy import only when needed
    const { PublicTeacherCard } = await import("@/components/features/teachers/PublicTeacherCard");

    return (
        <section className="py-12 lg:py-16 bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 text-center mb-12">
                    Meet Our Experts
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {teachers.map((teacher, i) => (
                        <PublicTeacherCard key={teacher.id} teacher={teacher} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// Skeleton for teacher cards
function TeachersSkeleton() {
    return (
        <section className="py-12 lg:py-16 bg-gradient-to-b from-purple-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-12 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[0, 1, 2].map((i) => (
                        <div key={i} className="rounded-3xl bg-white border border-gray-100 overflow-hidden animate-pulse">
                            <div className="h-56 bg-gray-200" />
                            <div className="p-5 space-y-3">
                                <div className="h-5 bg-gray-200 rounded w-2/3" />
                                <div className="h-4 bg-gray-100 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function AboutPage() {
    return (
        // Pass empty teachers array — static content renders instantly
        // Teachers section streams in separately via Suspense
        <AboutContent
            teachers={[]}
            teachersSection={
                <Suspense fallback={<TeachersSkeleton />}>
                    <TeachersSection />
                </Suspense>
            }
        />
    );
}
