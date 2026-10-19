'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react'

function SignupContent() {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [errors, setErrors] = useState<{ name?: boolean; email?: boolean; password?: boolean }>({})
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate
        const newErrors: { name?: boolean; email?: boolean; password?: boolean } = {}
        if (!name) newErrors.name = true
        if (!email) newErrors.email = true
        if (!password) newErrors.password = true
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return

        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback${redirect ? `?next=${encodeURIComponent(redirect)}` : ''}`,
                    data: {
                        full_name: name
                    }
                }
            })

            if (error) {
                console.error('Supabase signUp error:', error)
                throw error
            }

            if (data.user) {
                // Create user in our database
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: data.user.id,
                        email,
                        name,
                        role: 'student',
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Failed to create user in DB:', errorData);
                    // We don't throw here because the auth user is already created
                }
            }

            alert('Check your email for the confirmation link!')
            router.push(redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : '/login')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <div className="flex justify-center mb-4">
                        <div className="relative w-16 h-16 bg-gradient-to-br from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center shadow-md shadow-purple-600/20">
                            <Image
                                src="/logo.png"
                                alt="NavigateSkills Logo"
                                fill
                                className="object-contain p-2.5 brightness-0 invert"
                            />
                        </div>
                    </div>
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                            Create Account
                        </h1>
                        <p className="text-gray-500 text-sm">Start your learning journey today</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs text-gray-600 ml-1">Full Name</label>
                            <div className="relative">
                                <User className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-red-500' : 'text-gray-400'}`} size={18} />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
                                        setErrors(prev => ({ ...prev, name: false }))
                                    }}
                                    className={`w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none transition-all text-gray-900 ${errors.name
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-purple-500'
                                        }`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.name && <p className="text-red-500 text-xs ml-1">Name is required</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-600 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-gray-400'}`} size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        setErrors(prev => ({ ...prev, email: false }))
                                    }}
                                    className={`w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none transition-all text-gray-900 ${errors.email
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-purple-500'
                                        }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs ml-1">Email is required</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-600 ml-1">Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-gray-400'}`} size={18} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setErrors(prev => ({ ...prev, password: false }))
                                    }}
                                    className={`w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-4 focus:outline-none transition-all text-gray-900 ${errors.password
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-gray-300 focus:border-purple-500'
                                        }`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs ml-1">Password is required</p>}
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-gray-500 text-xs">
                            Already have an account?{' '}
                            <Link
                                href={redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login"}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default function SignupPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
        }>
            <SignupContent />
        </Suspense>
    )
}
