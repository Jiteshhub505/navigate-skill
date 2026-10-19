'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save, User, Mail, Lock, Shield } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'

// We'll use a server action for this
import { addUser } from '../../actions'

export default function NewUserPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'student',
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            await addUser(formData)
            router.push('/admin/users')
        } catch (err: any) {
            setError(err.message || 'Failed to create user')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="max-w-2xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href="/admin/users"
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Add New User</h1>
                        <p className="text-neutral-400">Create a new student or admin account</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                        <div className="space-y-4">
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

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Role</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                    <select
                                        value={formData.role}
                                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white appearance-none"
                                    >
                                        <option value="student">Student</option>
                                        <option value="admin">Admin</option>
                                        <option value="teacher">Teacher</option>
                                    </select>
                                </div>
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
                            href="/admin/users"
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
                                    Save User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
