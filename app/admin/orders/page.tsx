'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Search,
    Filter,
    Download,
    Eye,
    Mail,
    CheckCircle,
    XCircle,
    Clock,
    X,
    User,
    Phone,
    Copy,
    Check,
    ExternalLink,
    MessageCircle,
    CreditCard,
    Calendar,
    BookOpen,
    Tag,
    Shield
} from 'lucide-react'
import { getOrders, getOrderStats, getCourses } from '@/app/admin/actions'
import Link from 'next/link'

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [stats, setStats] = useState<{ totalSales?: number, activeStudents?: number, conversionRate?: number }>({})
    const [courses, setCourses] = useState<any[]>([])
    const [selectedCourse, setSelectedCourse] = useState('all')
    const [mounted, setMounted] = useState(false)
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
    const [copiedField, setCopiedField] = useState<string | null>(null)

    useEffect(() => {
        setMounted(true)
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const [ordersData, statsData, coursesData] = await Promise.all([
                getOrders(),
                getOrderStats(),
                getCourses()
            ])
            setOrders(ordersData || [])
            setStats(statsData || {})
            setCourses(coursesData || [])
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = (text: string, fieldId: string) => {
        if (!text) return
        navigator.clipboard.writeText(text)
        setCopiedField(fieldId)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
            case 'pending': return 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/20'
            default: return 'text-neutral-400 bg-neutral-500/10 border-neutral-500/20'
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle size={14} />
            case 'pending': return <Clock size={14} />
            case 'failed': return <XCircle size={14} />
            default: return null
        }
    }

    const handleExportCSV = () => {
        if (!orders.length) return

        const headers = [
            'Order ID',
            'Customer Name',
            'Customer Email',
            'Customer Phone',
            'Course Title',
            'Category',
            'Plan / Duration',
            'Batch / Timing Slot',
            'Base Amount (INR)',
            'Discount (INR)',
            'Final Amount Paid (INR)',
            'Status',
            'Razorpay Order ID',
            'Razorpay Payment ID',
            'Date Created'
        ]

        const rows = orders.map(o => [
            `"${o.id}"`,
            `"${o.user?.name || ''}"`,
            `"${o.user?.email || ''}"`,
            `"${o.user?.phone || ''}"`,
            `"${o.course?.title || ''}"`,
            `"${o.course?.category?.name || ''}"`,
            `"${o.duration?.name || 'Standard'}"`,
            `"${o.timing || 'Standard Schedule'}"`,
            Number(o.amount || 0).toFixed(2),
            Number(o.discountAmount || 0).toFixed(2),
            Number(o.finalAmount ?? o.amount ?? 0).toFixed(2),
            `"${o.status}"`,
            `"${o.razorpayOrderId || 'N/A'}"`,
            `"${o.razorpayPaymentId || 'N/A'}"`,
            `"${new Date(o.createdAt ?? o.created_at).toLocaleString('en-IN')}"`
        ])

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Orders Management</h1>
                    <p className="text-neutral-400 text-sm">Monitor course enrollments, customer data, and payments</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    disabled={orders.length === 0}
                    className="flex items-center justify-center gap-2 bg-neutral-900 border border-neutral-800 px-6 py-3 rounded-xl hover:bg-neutral-800 hover:border-purple-500/50 transition-all font-bold text-sm disabled:opacity-50"
                >
                    <Download size={18} />
                    Export CSV ({orders.length})
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-sm">
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Total Sales Revenue</p>
                    <h3 className="text-3xl font-black mt-2 text-white">₹{stats.totalSales ? stats.totalSales.toFixed(2) : '0.00'}</h3>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-sm">
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Unique Enrolled Students</p>
                    <h3 className="text-3xl font-black mt-2 text-purple-400">{stats.activeStudents ?? 0}</h3>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-sm">
                    <p className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Completion Rate</p>
                    <h3 className="text-3xl font-black mt-2 text-emerald-400">{stats.conversionRate ?? 0}%</h3>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by student name, email, phone, timing or Order ID..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-purple-500 text-sm transition-colors text-white placeholder:text-neutral-500"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-colors focus:outline-none focus:border-purple-500 text-sm text-neutral-300"
                    >
                        <option value="all">All Courses</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                    </select>
                    <div className="flex gap-1.5 bg-neutral-900 p-1 rounded-xl border border-neutral-800">
                        {['all', 'completed', 'pending', 'failed'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${filter === s
                                    ? 'bg-purple-600 text-white shadow-sm'
                                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-800/60 border-b border-neutral-800 text-neutral-400 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-bold">Order ID</th>
                                <th className="px-6 py-4 font-bold">Customer Details</th>
                                <th className="px-6 py-4 font-bold">Course & Plan</th>
                                <th className="px-6 py-4 font-bold">Batch Timing</th>
                                <th className="px-6 py-4 font-bold">Amount</th>
                                <th className="px-6 py-4 font-bold">Status</th>
                                <th className="px-6 py-4 font-bold">Date & Time</th>
                                <th className="px-6 py-4 font-bold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-neutral-500 text-sm">
                                        Loading orders data...
                                    </td>
                                </tr>
                            ) : (() => {
                                const filtered = orders.filter(o => {
                                    if (filter !== 'all' && o.status !== filter) return false
                                    if (selectedCourse !== 'all' && o.courseId !== selectedCourse) return false
                                    if (!search) return true
                                    const q = search.toLowerCase()
                                    return (
                                        (o.id && o.id.toLowerCase().includes(q)) ||
                                        (o.user?.email && o.user.email.toLowerCase().includes(q)) ||
                                        (o.user?.name && o.user.name.toLowerCase().includes(q)) ||
                                        (o.user?.phone && o.user.phone.toLowerCase().includes(q)) ||
                                        (o.timing && o.timing.toLowerCase().includes(q)) ||
                                        (o.razorpayOrderId && o.razorpayOrderId.toLowerCase().includes(q)) ||
                                        (o.razorpayPaymentId && o.razorpayPaymentId.toLowerCase().includes(q))
                                    )
                                })

                                if (filtered.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-neutral-500 text-sm">
                                                No orders found matching your search and filter criteria.
                                            </td>
                                        </tr>
                                    )
                                }

                                return filtered.map((order) => (
                                    <tr key={order.id} className="hover:bg-neutral-800/40 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs text-purple-400 font-bold">
                                            #{order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                                                {order.user?.name || 'Student'}
                                            </p>
                                            <p className="text-xs text-neutral-400">{order.user?.email || 'No email'}</p>
                                            {order.user?.phone ? (
                                                <p className="text-xs text-neutral-300 flex items-center gap-1 mt-1 font-mono font-medium">
                                                    <Phone size={11} className="text-purple-400 flex-shrink-0" />
                                                    {order.user.phone}
                                                </p>
                                            ) : (
                                                <p className="text-[11px] text-neutral-600 italic mt-0.5">No phone provided</p>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-white">{order.course?.title || 'Online Course'}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {order.duration?.name && (
                                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                        {order.duration.name}
                                                    </span>
                                                )}
                                                {order.course?.category?.name && (
                                                    <span className="text-[10px] text-neutral-500 font-medium">
                                                        {order.course.category.name}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {order.timing ? (
                                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium">
                                                    <Clock size={12} className="text-blue-400 flex-shrink-0" />
                                                    <span>{order.timing}</span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-neutral-500 italic">Standard Batch</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 font-black text-white text-base">
                                            ₹{Number(order.finalAmount ?? order.amount ?? 0).toFixed(2)}
                                            {order.discountAmount && Number(order.discountAmount) > 0 && (
                                                <span className="block text-[10px] text-emerald-400 font-normal">
                                                    Save ₹{Number(order.discountAmount).toFixed(0)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-neutral-400">
                                            {mounted ? (
                                                <>
                                                    <p className="font-medium text-neutral-300">
                                                        {new Date(order.createdAt ?? order.created_at).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                    <p className="text-neutral-500 text-[11px] mt-0.5">
                                                        {new Date(order.createdAt ?? order.created_at).toLocaleTimeString('en-IN', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </>
                                            ) : '...'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center gap-1.5">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    title="View Full Order Details"
                                                    className="p-2 hover:bg-purple-600/20 hover:text-purple-400 rounded-lg text-neutral-400 transition-all"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {order.user?.email && (
                                                    <a
                                                        href={`mailto:${order.user.email}?subject=Regarding Your Order on Navigate Skill Academy (${order.course?.title || 'Yoga'})`}
                                                        title="Send Email to Customer"
                                                        className="p-2 hover:bg-blue-600/20 hover:text-blue-400 rounded-lg text-neutral-400 transition-all"
                                                    >
                                                        <Mail size={18} />
                                                    </a>
                                                )}
                                                {order.user?.phone && (
                                                    <a
                                                        href={`https://wa.me/91${order.user.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(order.user.name || 'Student')},%20regarding%20your%20enrollment%20for%20${encodeURIComponent(order.course?.title || 'Yoga')}%20at%20Navigate%20Skill%20Academy`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Message on WhatsApp"
                                                        className="p-2 hover:bg-emerald-600/20 hover:text-emerald-400 rounded-lg text-neutral-400 transition-all"
                                                    >
                                                        <MessageCircle size={18} />
                                                    </a>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            })()
                            }
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ORDER DETAILS MODAL (Opens on Eye icon click) */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <div className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/50">
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-bold text-white">Order Details</h2>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                                        {getStatusIcon(selectedOrder.status)}
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <p className="text-neutral-400 text-xs font-mono mt-1">
                                    ID: #{selectedOrder.id}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
                            {/* Customer Profile Information */}
                            <div className="bg-neutral-950/60 p-5 rounded-2xl border border-neutral-800/80">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-purple-400">
                                    <User size={16} />
                                    <span>Customer Information</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-neutral-500 text-xs">Full Name</p>
                                        <p className="text-white font-bold text-base mt-0.5">
                                            {selectedOrder.user?.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 text-xs">Email Address</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-white font-semibold">{selectedOrder.user?.email || 'N/A'}</p>
                                            {selectedOrder.user?.email && (
                                                <button
                                                    onClick={() => copyToClipboard(selectedOrder.user.email, 'email')}
                                                    className="text-neutral-500 hover:text-purple-400 transition-colors"
                                                    title="Copy Email"
                                                >
                                                    {copiedField === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 text-xs">Phone Number</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-white font-mono font-semibold">
                                                {selectedOrder.user?.phone || 'Not provided'}
                                            </p>
                                            {selectedOrder.user?.phone && (
                                                <button
                                                    onClick={() => copyToClipboard(selectedOrder.user.phone, 'phone')}
                                                    className="text-neutral-500 hover:text-purple-400 transition-colors"
                                                    title="Copy Phone"
                                                >
                                                    {copiedField === 'phone' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 text-xs">User Account ID</p>
                                        <p className="text-neutral-400 font-mono text-xs mt-0.5 truncate" title={selectedOrder.userId}>
                                            {selectedOrder.userId}
                                        </p>
                                    </div>
                                </div>

                                {/* Direct Contact Action Bar */}
                                <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-wrap gap-2">
                                    {selectedOrder.user?.phone && (
                                        <a
                                            href={`https://wa.me/91${selectedOrder.user.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedOrder.user.name || 'Student')},%20this%20is%20from%20Navigate%20Skill%20Academy%20regarding%20your%20${encodeURIComponent(selectedOrder.course?.title || 'Yoga')}%20enrollment.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-600/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                                        >
                                            <MessageCircle size={14} />
                                            Chat on WhatsApp
                                        </a>
                                    )}
                                    {selectedOrder.user?.email && (
                                        <a
                                            href={`mailto:${selectedOrder.user.email}?subject=Course Enrollment Confirmation - Navigate Skill Academy`}
                                            className="px-4 py-2 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 hover:bg-purple-600/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                                        >
                                            <Mail size={14} />
                                            Send Email
                                        </a>
                                    )}
                                </div>
                            </div>

                            {/* Enrolled Course, Plan & Timing Details */}
                            <div className="bg-neutral-950/60 p-5 rounded-2xl border border-neutral-800/80">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-purple-400">
                                    <BookOpen size={16} />
                                    <span>Enrolled Course & Schedule</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-neutral-500 text-xs">Course Title</p>
                                        <p className="text-white font-bold text-base mt-0.5">{selectedOrder.course?.title || 'Yoga Course'}</p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 text-xs">Category</p>
                                        <p className="text-white font-semibold mt-0.5">{selectedOrder.course?.category?.name || 'Fitness & Wellness'}</p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 text-xs">Selected Plan / Duration</p>
                                        <p className="text-purple-400 font-bold mt-0.5">
                                            {selectedOrder.duration?.name || (Number(selectedOrder.finalAmount) <= 50 ? 'Trial Class (₹20)' : 'Standard Plan')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 text-xs">Selected Class Batch & Timing</p>
                                        <div className="mt-1">
                                            {selectedOrder.timing ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold">
                                                    <Clock size={13} className="text-blue-400" />
                                                    {selectedOrder.timing}
                                                </span>
                                            ) : (
                                                <span className="text-neutral-400 text-xs italic">Standard Batch Schedule</span>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 text-xs">Course Base Price</p>
                                        <p className="text-neutral-300 font-semibold mt-0.5">₹{selectedOrder.course?.price || selectedOrder.amount}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Gateway Breakdown */}
                            <div className="bg-neutral-950/60 p-5 rounded-2xl border border-neutral-800/80">
                                <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-purple-400">
                                    <CreditCard size={16} />
                                    <span>Payment & Transaction Breakdown</span>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-1">
                                        <span className="text-neutral-400">Subtotal Amount:</span>
                                        <span className="font-semibold text-white">₹{Number(selectedOrder.amount).toFixed(2)}</span>
                                    </div>
                                    {selectedOrder.discountAmount && Number(selectedOrder.discountAmount) > 0 && (
                                        <div className="flex justify-between items-center py-1 text-emerald-400">
                                            <span>Coupon Discount:</span>
                                            <span>- ₹{Number(selectedOrder.discountAmount).toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center py-2 border-t border-neutral-800 text-base font-black">
                                        <span className="text-white">Total Amount Paid:</span>
                                        <span className="text-purple-400 text-lg">
                                            ₹{Number(selectedOrder.finalAmount ?? selectedOrder.amount ?? 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-neutral-500 text-xs">Razorpay Order ID</p>
                                        <div className="flex items-center gap-2 mt-1 font-mono text-xs text-neutral-300">
                                            <span className="truncate">{selectedOrder.razorpayOrderId || 'N/A'}</span>
                                            {selectedOrder.razorpayOrderId && (
                                                <button
                                                    onClick={() => copyToClipboard(selectedOrder.razorpayOrderId, 'rzpOrder')}
                                                    className="text-neutral-500 hover:text-purple-400"
                                                    title="Copy Razorpay Order ID"
                                                >
                                                    {copiedField === 'rzpOrder' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-neutral-500 text-xs">Razorpay Payment ID</p>
                                        <div className="flex items-center gap-2 mt-1 font-mono text-xs text-neutral-300">
                                            <span className="truncate">{selectedOrder.razorpayPaymentId || 'N/A'}</span>
                                            {selectedOrder.razorpayPaymentId && (
                                                <button
                                                    onClick={() => copyToClipboard(selectedOrder.razorpayPaymentId, 'rzpPayment')}
                                                    className="text-neutral-500 hover:text-purple-400"
                                                    title="Copy Razorpay Payment ID"
                                                >
                                                    {copiedField === 'rzpPayment' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Timestamps */}
                            <div className="text-xs text-neutral-500 flex items-center justify-between px-2">
                                <span>Order Created: {new Date(selectedOrder.createdAt ?? selectedOrder.created_at).toLocaleString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</span>
                                <span>Status: {selectedOrder.status}</span>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t border-neutral-800 bg-neutral-950/50 flex justify-end gap-3">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    )
}
