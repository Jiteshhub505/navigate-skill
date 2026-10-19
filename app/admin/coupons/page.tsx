'use client'

import { Plus, Trash2, Edit2, Tag, Calendar, Percent, Search, RotateCcw, Trash } from 'lucide-react'
import {
    getCoupons,
    deleteCoupon,
    createCoupon,
    updateCoupon,
    getDeletedCoupons,
    restoreCoupon,
    permanentDeleteCoupon
} from '../actions'
import CouponForm from '@/components/admin/CouponForm'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

interface Coupon {
    id: string
    code: string
    discountType: string
    discountValue: string | number
    minPurchaseAmount: string | number | null
    maxDiscountAmount: string | number | null
    usageLimit: number | null
    usedCount: number | null
    validFrom: any
    validUntil: any
    isActive: boolean
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [deletedCoupons, setDeletedCoupons] = useState<Coupon[]>([])
    const [showTrash, setShowTrash] = useState(false)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            const [data, deletedData] = await Promise.all([
                getCoupons(),
                getDeletedCoupons()
            ])
            setCoupons(data as any)
            setDeletedCoupons(deletedData as any)
        } catch (error) {
            console.error('Error fetching coupons:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddCoupon = async (formData: any) => {
        try {
            await createCoupon(formData)
            fetchData()
            setIsFormOpen(false)
        } catch (error) {
            alert('Error creating coupon')
        }
    }

    const handleUpdateCoupon = async (formData: any) => {
        try {
            await updateCoupon(editingCoupon!.id, formData)
            fetchData()
            setEditingCoupon(null)
        } catch (error) {
            alert('Error updating coupon')
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreCoupon(id)
            fetchData()
        } catch (error) {
            alert('Error restoring coupon')
        }
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('This will permanently delete the coupon. Continue?')) return
        try {
            await permanentDeleteCoupon(id)
            fetchData()
        } catch (error) {
            alert('Error deleting coupon permanently')
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to move this coupon to trash?')) {
            await deleteCoupon(id)
            fetchData()
        }
    }

    function formatDate(dateString: any) {
        if (!dateString) return ''
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    }

    const displayCoupons = showTrash ? deletedCoupons : coupons
    const filteredCoupons = displayCoupons.filter(coupon =>
        coupon.code.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{showTrash ? 'Trash - Coupons' : 'Coupons'}</h1>
                    <p className="text-neutral-400">
                        {showTrash ? 'Manage deleted discount coupons' : 'Manage discount coupons'}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowTrash(!showTrash)}
                        className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all border ${showTrash
                            ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:bg-neutral-800'
                            }`}
                    >
                        {showTrash ? <RotateCcw size={20} /> : <Trash size={20} />}
                        {showTrash ? 'View Active' : 'View Trash'}
                    </button>
                    {!showTrash && (
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors font-bold"
                        >
                            <Plus size={20} />
                            Create Coupon
                        </button>
                    )}
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search coupons by code..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-800/50 border-b border-neutral-800 text-neutral-400 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">Code</th>
                                <th className="px-6 py-4 font-medium">Discount</th>
                                <th className="px-6 py-4 font-medium">Usage</th>
                                <th className="px-6 py-4 font-medium">Valid Until</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        Loading coupons...
                                    </td>
                                </tr>
                            ) : filteredCoupons.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        {showTrash ? 'Trash is empty' : 'No coupons found.'}
                                    </td>
                                </tr>
                            ) : filteredCoupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Tag className="text-purple-400" size={16} />
                                            <span className="font-mono font-bold text-white">{coupon.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-white">
                                            {coupon.discountType === 'percentage' ? (
                                                <span className="flex items-center gap-1">
                                                    <Percent size={14} className="text-green-400" />
                                                    {coupon.discountValue}% off
                                                </span>
                                            ) : (
                                                <span>₹{coupon.discountValue} off</span>
                                            )}
                                        </div>
                                        {coupon.minPurchaseAmount && Number(coupon.minPurchaseAmount) > 0 && (
                                            <div className="text-xs text-neutral-400">
                                                Min: ₹{coupon.minPurchaseAmount}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        {coupon.usedCount || 0} / {coupon.usageLimit || '∞'}
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">
                                        {coupon.validUntil ? (
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {formatDate(coupon.validUntil)}
                                            </div>
                                        ) : (
                                            'No expiry'
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {showTrash ? (
                                            <span className="text-red-400 text-sm">Deleted</span>
                                        ) : (
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${coupon.isActive
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {coupon.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {showTrash ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRestore(coupon.id)}
                                                        className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"
                                                        title="Restore"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handlePermanentDelete(coupon.id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                                                        title="Delete Permanently"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => setEditingCoupon(coupon)}
                                                        className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors"
                                                        title="Edit Coupon"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(coupon.id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                                        title="Delete Coupon"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(isFormOpen || editingCoupon) && (
                <CouponForm
                    initialData={editingCoupon}
                    onClose={() => {
                        setIsFormOpen(false)
                        setEditingCoupon(null)
                    }}
                    onSubmit={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
                />
            )}
        </AdminLayout>
    )
}
