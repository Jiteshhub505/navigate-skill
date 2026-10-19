"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

export function PublicTeacherCard({ teacher, index }: { teacher: any, index: number }) {
    const expertise = Array.isArray(teacher.expertise) ? teacher.expertise : [];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative h-full"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-[2.5rem] opacity-0 group-hover:opacity-20 blur transition duration-500" />
            <div className="relative bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-200 group-hover:border-purple-500/30 transition-all duration-500 flex flex-col h-full">
                {/* Image & Experience */}
                <div className="relative mb-8 mx-auto">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-500 relative">
                        {teacher.profileImageUrl ? (
                            <Image
                                src={teacher.profileImageUrl}
                                alt={teacher.user?.name || 'Teacher'}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-lg border border-white/10">
                        {teacher.experience || 0}+ YRS
                    </div>
                </div>

                {/* Content */}
                <div className="text-center flex-grow">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-purple-600 transition-colors tracking-tight">
                        {teacher.user?.name}
                    </h3>
                    <p className="text-purple-600 font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
                        {expertise[0] || 'Expert Instructor'}
                    </p>
                    <p className="text-gray-600 text-sm mb-6 line-clamp-2 italic leading-relaxed">
                        "{teacher.bio || 'Dedicated to helping students achieve their full potential through expert guidance.'}"
                    </p>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {expertise.slice(0, 3).map((exp: string) => (
                            <span key={exp} className="text-[10px] px-3 py-1.5 rounded-xl bg-gray-100 text-gray-600 border border-gray-200 group-hover:border-purple-500/20 transition-colors">
                                {exp}
                            </span>
                        ))}
                    </div>
                </div>

                <Link
                    href={`/teachers/${teacher.id}`}
                    className="mt-auto inline-flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-all duration-300 group/btn"
                >
                    View Full Profile
                    <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                </Link>
            </div>
        </motion.div>
    );
}
