import { notFound } from "next/navigation";
import { getTeacherById } from "@/app/actions/public-courses";
import { CourseCard } from "@/components/features/courses/CourseCard";
import {
    Mail, Award, BookOpen, Star, Linkedin, Twitter,
    Globe, User, Users, ArrowLeft, CheckCircle2,
    Instagram, Youtube, Facebook
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const teacher = await getTeacherById(id);

    if (!teacher) return { title: "Teacher Not Found" };

    return {
        title: `${teacher.user?.name} | Expert Instructor | NavigateSkills Academy`,
        description: teacher.bio || `Learn from ${teacher.user?.name} at NavigateSkills Academy.`,
    };
}

export default async function TeacherDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const teacher = await getTeacherById(id);

    if (!teacher) {
        notFound();
    }

    const expertise = Array.isArray(teacher.expertise) ? teacher.expertise : [];
    const qualifications = Array.isArray(teacher.qualifications) ? teacher.qualifications : [];
    const socialLinks: any = teacher.socialLinks || {};

    return (
        <div className="min-h-screen pt-10 pb-20 bg-gray-50 overflow-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-200/30 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <Link
                    href="/teachers"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors mb-12 group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm uppercase tracking-widest">Back to All Experts</span>
                </Link>

                {/* Profile Hero Section */}
                <div className="relative mb-20">
                    <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
                        {/* Image Container */}
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600 to-fuchsia-600 rounded-[3.5rem] opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-500" />
                            <div className="relative w-56 h-56 md:w-72 md:h-72 rounded-[3rem] overflow-hidden border-2 border-gray-200 shadow-2xl group-hover:border-purple-500/50 transition-colors duration-500">
                                {teacher.profileImageUrl ? (
                                    <Image
                                        src={teacher.profileImageUrl}
                                        alt={teacher.user?.name || 'Teacher'}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <User size={100} />
                                    </div>
                                )}
                            </div>

                            {/* Experience Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-purple-600 text-white px-6 py-3 rounded-2xl font-black shadow-xl shadow-purple-600/20 border border-white/20 transform hover:scale-105 transition-transform">
                                <div className="text-[10px] uppercase tracking-widest opacity-80">Experience</div>
                                <div className="text-xl">{teacher.experience || 0}+ Years</div>
                            </div>
                        </div>

                        {/* Info Content */}
                        <div className="flex-1 text-center lg:text-left pt-4">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 text-purple-600 border border-purple-200 mb-6">
                                <Award size={16} />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Verified Expert Instructor</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tighter bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                                {teacher.user?.name}
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl leading-relaxed font-medium italic">
                                "{teacher.bio || 'Sharing expertise and empowering students to reach their full potential through dedicated guidance and practical learning.'}"
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-10">
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Rating</span>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Star size={20} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-2xl font-black">4.9</span>
                                    </div>
                                </div>
                                <div className="w-px h-12 bg-gray-200 hidden sm:block" />
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Active Courses</span>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <BookOpen size={20} className="text-purple-600" />
                                        <span className="text-2xl font-black">{teacher.courses?.length || 0}</span>
                                    </div>
                                </div>
                                <div className="w-px h-12 bg-gray-200 hidden sm:block" />
                                <div className="flex flex-col">
                                    <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Students Taught</span>
                                    <div className="flex items-center gap-2 text-gray-900">
                                        <Users size={20} className="text-blue-600" />
                                        <span className="text-2xl font-black">1.2k+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                {socialLinks.linkedin && (
                                    <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-purple-500/50 hover:bg-gray-50 transition-all group">
                                        <Linkedin size={22} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {socialLinks.twitter && (
                                    <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-purple-500/50 hover:bg-gray-50 transition-all group">
                                        <Twitter size={22} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {socialLinks.instagram && (
                                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-purple-500/50 hover:bg-gray-50 transition-all group">
                                        <Instagram size={22} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {socialLinks.youtube && (
                                    <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-purple-500/50 hover:bg-gray-50 transition-all group">
                                        <Youtube size={22} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                                {socialLinks.website && (
                                    <a href={socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-purple-500/50 hover:bg-gray-50 transition-all group">
                                        <Globe size={22} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column - Sidebar Info */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Expertise Card */}
                        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200/30 rounded-full blur-3xl group-hover:bg-purple-200/50 transition-colors" />
                            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Star size={20} />
                                </div>
                                Areas of Expertise
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {expertise.map((exp: string) => (
                                    <div key={exp} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm border border-gray-200 hover:border-purple-500/30 transition-colors">
                                        <CheckCircle2 size={14} className="text-purple-600" />
                                        {exp}
                                    </div>
                                ))}
                                {expertise.length === 0 && <p className="text-gray-500 italic">No expertise areas listed.</p>}
                            </div>
                        </div>

                        {/* Qualifications Card */}
                        {qualifications.length > 0 && (
                            <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-[2.5rem] p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200/30 rounded-full blur-3xl group-hover:bg-blue-200/50 transition-colors" />
                                <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                                        <Award size={20} />
                                    </div>
                                    Qualifications
                                </h3>
                                <div className="space-y-4">
                                    {qualifications.map((qual: string, i: number) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                            <span className="text-gray-700 text-sm leading-relaxed">{qual}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact/Support Card */}
                        <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-[2.5rem] p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Have Questions?</h3>
                            <p className="text-gray-600 text-sm mb-6">
                                Interested in learning from {teacher.user?.name?.split(' ')[0]}? Get in touch with our team for more details about the courses.
                            </p>
                            <Link
                                href="/contact"
                                className="w-full py-4 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                            >
                                <Mail size={18} />
                                Contact Support
                            </Link>
                        </div>
                    </div>

                    {/* Right Column - Courses Listing */}
                    <div className="lg:col-span-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                                    Courses by {teacher.user?.name?.split(' ')[0]}
                                </h2>
                                <p className="text-gray-500 mt-1">Explore all active programs led by this instructor</p>
                            </div>
                            <div className="h-px flex-1 bg-gray-200 mx-6 hidden xl:block" />
                            <div className="px-4 py-2 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-bold uppercase tracking-widest">
                                {teacher.courses?.length || 0} Programs
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {teacher.courses?.map((course: any, i: number) => (
                                <CourseCard key={course.id} course={course} index={i} />
                            ))}
                            {(!teacher.courses || teacher.courses.length === 0) && (
                                <div className="col-span-full py-32 text-center bg-gray-100 rounded-[3rem] border border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
                                        <BookOpen size={40} />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-500 mb-2">No Active Courses</h3>
                                    <p className="text-gray-400 max-w-xs mx-auto">This instructor doesn't have any active courses at the moment. Check back soon!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
