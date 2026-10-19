'use client'

import { useState, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'

function LoginContent() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [errors, setErrors] = useState<{ email?: boolean; password?: boolean }>({})
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const redirect = searchParams.get('redirect')
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validate
        const newErrors: { email?: boolean; password?: boolean } = {}
        if (!email) newErrors.email = true
        if (!password) newErrors.password = true
        setErrors(newErrors)
        if (Object.keys(newErrors).length > 0) return

        setLoading(true)
        setError(null)

        try {

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                // Parse Supabase error messages to show user-friendly messages
                const errorMessage = error.message?.toLowerCase() || '';

                if (errorMessage.includes('invalid login credentials') ||
                    errorMessage.includes('invalid credentials')) {
                    // Check if user exists by trying to find them
                    setError('Invalid credentials. Please check your email and password.');
                } else if (errorMessage.includes('email not confirmed')) {
                    setError('Please verify your email address before logging in. Check your inbox for the verification link.');
                } else if (errorMessage.includes('too many requests')) {
                    setError('Too many login attempts. Please wait a few minutes and try again.');
                } else if (errorMessage.includes('user not found')) {
                    setError('This email does not have an account. Please create an account first.');
                } else {
                    setError(error.message || 'Login failed. Please try again.');
                }
                return;
            }

            // Check if admin
            const { data: dbUser } = await supabase
                .from('users')
                .select('role')
                .eq('email', data.user.email)
                .single()

            if (redirect) {
                router.push(redirect)
            } else if (dbUser?.role === 'admin') {
                router.push('/admin')
            } else {
                router.push('/')
            }
        } catch (err: any) {
            console.error('Login error:', err)
            setError('Something went wrong. Please try again.')
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
                            Welcome Back
                        </h1>
                        <p className="text-gray-500 text-sm">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
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
                                    placeholder="admin@example.com"
                                />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs ml-1">Email is required</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs text-gray-600 ml-1">Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-gray-400'}`} size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        setErrors(prev => ({ ...prev, password: false }))
                                    }}
                                    className={`w-full bg-gray-50 border rounded-xl py-2.5 pl-10 pr-10 focus:outline-none transition-all text-gray-900 ${errors.password
                                        ? 'border-red-500 focus:border-red-500'
                                        : 'border-gray-300 focus:border-purple-500'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
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
                                    Sign In
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-gray-500 text-xs">
                            Don't have an account?{' '}
                            <Link
                                href={redirect ? `/signup?redirect=${encodeURIComponent(redirect)}` : "/signup"}
                                className="text-purple-600 hover:text-purple-700 font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="animate-spin text-purple-500" size={40} />
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}
