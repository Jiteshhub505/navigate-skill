import { getTeachers } from "@/app/actions/public-courses";
import { PublicTeacherCard } from "@/components/features/teachers/PublicTeacherCard";
import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
    title: "Our Expert Instructors | Yoga, Fitness & Dance Teachers",
    description: "Learn from certified yoga instructors, fitness coaches, dance experts and trading mentors at Navigate Skill Academy. Expert-led live online classes in India.",
    alternates: {
        canonical: '/teachers',
    },
    openGraph: {
        title: "Expert Instructors — Navigate Skill Academy",
        description: "Learn from certified yoga, fitness, dance and trading experts with Navigate Skill Academy's experienced faculty.",
        url: 'https://navigateskill.com/teachers',
    }
};

export const revalidate = 3600;

export default async function TeachersPage() {
    const teachers = await getTeachers();

    return (
        <div className="min-h-screen pt-28 pb-20 bg-[#faf7ff]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero Section */}
                <div className="relative mb-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200 mb-4">
                        <Users size={14} />
                        <span className="text-xs font-bold uppercase tracking-widest">World Class Faculty</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-950 tracking-tight mb-4">
                        Meet Our <span className="bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">Instructors</span>
                    </h1>
                    <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Our instructors are certified yoga gurus, fitness experts, and dedicated mentors committed to guiding your transformation.
                    </p>
                </div>

                {/* Teachers Grid */}
                {teachers && teachers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {teachers.map((teacher, i) => (
                            <PublicTeacherCard key={teacher.id} teacher={teacher} index={i} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-md mx-auto p-8">
                        <p className="text-gray-600 text-base font-medium">Instructor profiles are being updated. Check back soon!</p>
                    </div>
                )}

                {/* Join CTA */}
                <div className="mt-20 bg-gradient-to-br from-purple-700 via-fuchsia-700 to-purple-800 rounded-[2.5rem] p-8 sm:p-14 text-center text-white relative overflow-hidden shadow-2xl">
                    <h2 className="text-3xl sm:text-4xl font-black mb-3">Want to Join Our Teaching Team?</h2>
                    <p className="text-purple-100 max-w-xl mx-auto text-sm sm:text-base mb-8">
                        We are looking for passionate, certified yoga & fitness experts. If you love coaching and inspiring students, let&apos;s collaborate.
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white text-purple-900 font-bold text-sm hover:bg-purple-50 transition-all shadow-lg hover:scale-[1.02]"
                    >
                        Apply as Instructor
                    </Link>
                </div>
            </div>
        </div>
    );
}
