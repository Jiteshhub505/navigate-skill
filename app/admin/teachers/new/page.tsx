'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save, User, Mail, Lock, Award, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { addTeacher } from '../../actions'

export default function NewTeacherPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '', // In a real app, you'd handle this via invite or admin create
        bio: '',
        expertise: '', // Will be split into array
        experience: '0',
        profileImageUrl: '',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const data = {
                ...formData,
                experience: parseInt(formData.experience),
                expertise: formData.expertise.split(',').map(s => s.trim()).filter(s => s !== ''),
            }

            await addTeacher(data)
            router.push('/admin/teachers')
        } catch (err: any) {
            setError(err.message || 'Failed to create teacher')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href="/admin/teachers"
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Add New Teacher</h1>
                        <p className="text-neutral-400">Create a new instructor profile and account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Account Information */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <User size={20} className="text-purple-400" />
                            Account Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input
                                        type="email"
                                        required
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Professional Profile */}
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Award size={20} className="text-purple-400" />
                            Professional Profile
                        </h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Expertise (Comma separated)</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-3 text-neutral-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="React, Node.js, UI/UX"
                                        value={formData.expertise}
                                        onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Years of Experience</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.experience}
                                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Biography</label>
                                <textarea
                                    rows={4}
                                    placeholder="Tell us about the teacher's background..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white resize-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Profile Image URL</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.profileImageUrl}
                                    onChange={(e) => setFormData({ ...formData, profileImageUrl: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <Link
                            href="/admin/teachers"
                            className="px-6 py-3 rounded-xl border border-neutral-800 hover:bg-neutral-800 transition-all text-neutral-300"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all font-bold"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <Save size={20} />
                                    Save Teacher
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
