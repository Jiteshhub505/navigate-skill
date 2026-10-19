'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { TrendingUp, Users, BookOpen, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react'
import { getOrderStats, getOrders, getCourses, getExpiredStudents } from '@/app/admin/actions'
import Link from 'next/link'

function formatCurrency(amount?: number) {
    if (!amount) return '₹0.00'
    return '₹' + amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<{ totalSales?: number, activeStudents?: number, conversionRate?: number }>({})
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [expiredStudents, setExpiredStudents] = useState<any[]>([])
    const [totalCourses, setTotalCourses] = useState<number>(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLive()
    }, [])

    async function fetchLive() {
        try {
            setLoading(true)
            const [s, orders, courses, expired] = await Promise.all([
                getOrderStats(),
                getOrders(),
                getCourses(),
                getExpiredStudents()
            ])
            setStats(s || {})
            setRecentOrders((orders || []).slice(0, 6))
            setTotalCourses((courses || []).length)
            setExpiredStudents(expired || [])
        } catch (err) {
            console.error('Error fetching admin live data', err)
        } finally {
            setLoading(false)
        }
    }

    const cards = [
        { label: 'Total Revenue', value: formatCurrency(stats.totalSales), icon: TrendingUp, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Enrolled Students', value: String(stats.activeStudents ?? 0), icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { label: 'Total Courses', value: String(totalCourses), icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Expired Plans', value: String(expiredStudents.length), icon: Users, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    ]

    return (
        <AdminLayout>
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {cards.map((stat) => (
                    <div key={stat.label} className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                                <stat.icon className={stat.color} size={22} />
                            </div>
                        </div>
                        <p className="text-neutral-400 text-xs font-semibold uppercase tracking-wider">{stat.label}</p>
                        <h3 className="text-2xl font-bold mt-1 text-white">
                            {loading ? <span className="inline-block w-16 h-7 bg-neutral-800 rounded animate-pulse" /> : stat.value}
                        </h3>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Link
                    href="/admin/orders"
                    className="p-4 bg-gradient-to-r from-purple-900/30 to-purple-800/20 border border-purple-500/20 hover:border-purple-500/50 rounded-2xl flex items-center justify-between group transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center">
                            <ShoppingBag size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Manage Orders</p>
                            <p className="text-xs text-neutral-400">View transactions & timings</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-neutral-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/admin/courses"
                    className="p-4 bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-500/20 hover:border-blue-500/50 rounded-2xl flex items-center justify-between group transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Courses & Pricing</p>
                            <p className="text-xs text-neutral-400">Update course rates & slots</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-neutral-400 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </Link>

                <Link
                    href="/admin/yoga-leads"
                    className="p-4 bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-500/20 hover:border-amber-500/50 rounded-2xl flex items-center justify-between group transition-all"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">Yoga Leads</p>
                            <p className="text-xs text-neutral-400">Customer trial inquiries</p>
                        </div>
                    </div>
                    <ArrowRight size={16} className="text-neutral-400 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-white">Recent Orders</h2>
                        <Link href="/admin/orders" className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1">
                            View All <ArrowRight size={13} />
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="py-8 text-center text-neutral-500 text-sm">Loading recent orders...</div>
                        ) : recentOrders.length === 0 ? (
                            <p className="text-neutral-500 text-sm py-4 text-center">No recent orders found</p>
                        ) : recentOrders.map((o, i) => (
                            <div key={o.id || i} className="flex items-center justify-between p-3.5 bg-neutral-800/40 rounded-xl border border-neutral-800">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 font-bold text-xs">
                                        {o.user?.name ? o.user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm text-white truncate">{o.user?.name || o.user?.email || 'Student'}</p>
                                        <p className="text-xs text-neutral-400 truncate">{o.course?.title || 'Yoga Course'} {o.timing ? `• ${o.timing}` : ''}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-3">
                                    <p className="font-bold text-sm text-white">{formatCurrency(Number(o.finalAmount ?? o.amount ?? 0))}</p>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                        o.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                                    }`}>
                                        {o.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Expired Students / Retention */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-lg font-bold text-rose-400">Expired Plans</h2>
                        <span className="text-xs text-neutral-400">{expiredStudents.length} Students</span>
                    </div>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="py-8 text-center text-neutral-500 text-sm">Checking expiry records...</div>
                        ) : expiredStudents.length === 0 ? (
                            <p className="text-neutral-500 text-sm py-4 text-center">No expired plans found</p>
                        ) : expiredStudents.slice(0, 6).map((o, i) => (
                            <div key={o.id || i} className="flex items-center justify-between p-3.5 bg-rose-500/5 rounded-xl border border-rose-500/10">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 shrink-0 font-bold text-xs">
                                        {o.user?.name ? o.user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-sm text-white truncate">{o.user?.name || o.user?.email || 'Student'}</p>
                                        <p className="text-xs text-neutral-400 truncate">{o.course?.title || 'Yoga Course'}</p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 ml-3">
                                    <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Expired</p>
                                    <p className="text-xs font-bold text-rose-400">
                                        {new Date(o.expiryDate).toLocaleDateString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}
