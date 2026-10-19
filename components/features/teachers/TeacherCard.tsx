import { Mail, User, Award, ExternalLink, Trash2, RotateCcw, Edit2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface TeacherCardProps {
    teacher: any
    showTrash?: boolean
    onEdit?: (teacher: any) => void
    onDelete?: (id: string) => void
    onRestore?: (id: string) => void
    onPermanentDelete?: (id: string) => void
}

export default function TeacherCard({
    teacher,
    showTrash,
    onEdit,
    onDelete,
    onRestore,
    onPermanentDelete
}: TeacherCardProps) {
    const expertise = Array.isArray(teacher.expertise) ? teacher.expertise : []

    return (
        <div className="bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-3xl overflow-hidden group hover:border-purple-500/50 transition-all duration-500 flex flex-col h-full">
            {/* Header with Image & Basic Info */}
            <div className="p-6 pb-0 flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-2xl bg-neutral-800 overflow-hidden flex-shrink-0 border border-neutral-700 group-hover:border-purple-500/30 transition-colors">
                    {teacher.profileImageUrl ? (
                        <Image
                            src={teacher.profileImageUrl}
                            alt={teacher.user?.name || 'Teacher'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                            <User size={32} />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate group-hover:text-purple-400 transition-colors">
                        {teacher.user?.name}
                    </h3>
                    <p className="text-neutral-400 text-sm flex items-center gap-1.5 truncate mb-2">
                        <Mail size={14} className="text-purple-500" />
                        {teacher.user?.email}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            {teacher.experience || 0} Years Exp
                        </span>
                    </div>
                </div>
            </div>

            {/* Bio Section */}
            <div className="p-6 flex-grow">
                <p className="text-neutral-400 text-sm line-clamp-3 mb-4 leading-relaxed">
                    {teacher.bio || 'No biography available.'}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-2 max-h-20 overflow-hidden relative">
                    {expertise.slice(0, 4).map((exp: string) => (
                        <span
                            key={exp}
                            className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 border border-neutral-700 group-hover:border-neutral-600 transition-colors"
                        >
                            {exp}
                        </span>
                    ))}
                    {expertise.length > 4 && (
                        <span className="text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800/50 text-neutral-500 border border-neutral-700/50">
                            +{expertise.length - 4} more
                        </span>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-neutral-950/50 border-t border-neutral-800 flex items-center justify-between">
                <Link
                    href={`/teachers/${teacher.id}`}
                    className="text-xs font-bold text-neutral-500 hover:text-purple-400 flex items-center gap-1 transition-colors"
                >
                    View Profile <ExternalLink size={12} />
                </Link>

                <div className="flex items-center gap-2">
                    {showTrash ? (
                        <>
                            <button
                                onClick={() => onRestore?.(teacher.id)}
                                className="p-2 bg-green-500/10 text-green-400 rounded-xl hover:bg-green-500/20 transition-all border border-green-500/20"
                                title="Restore"
                            >
                                <RotateCcw size={18} />
                            </button>
                            <button
                                onClick={() => onPermanentDelete?.(teacher.id)}
                                className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                                title="Delete Permanently"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => onEdit?.(teacher)}
                                className="p-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl transition-all border border-neutral-700"
                                title="Edit"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => onDelete?.(teacher.id)}
                                className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500/20 transition-all border border-red-500/20"
                                title="Move to Trash"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
