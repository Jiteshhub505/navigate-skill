'use client'

import { useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { createCoupon } from '../../actions'

export default function NewCouponPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [formData, setFormData] = useState({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        minPurchaseAmount: '0',
        maxDiscountAmount: '',
        usageLimit: '',
        validFrom: new Date().toISOString().split('T')[0],
        validUntil: '',
        isActive: true
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const data = {
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                minPurchaseAmount: parseFloat(formData.minPurchaseAmount),
                maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                validUntil: formData.validUntil || null
            }

            await createCoupon(data)
            router.push('/admin/coupons')
        } catch (err: any) {
            setError(err.message || 'Failed to create coupon')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminLayout>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex items-center gap-4">
                    <Link
                        href="/admin/coupons"
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Create New Coupon</h1>
                        <p className="text-neutral-400">Set up a new discount code for your students</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Coupon Code</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="E.g. WELCOME50"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white font-mono"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Discount Type</label>
                                <select
                                    value={formData.discountType}
                                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (₹)</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">
                                    Discount Value {formData.discountType === 'percentage' ? '(%)' : '(₹)'}
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.discountValue}
                                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Min Purchase Amount (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.minPurchaseAmount}
                                    onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                />
                            </div>

                            {formData.discountType === 'percentage' && (
                                <div className="space-y-2">
                                    <label className="text-sm text-neutral-400">Max Discount Amount (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Optional"
                                        value={formData.maxDiscountAmount}
                                        onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                    />
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Usage Limit</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Unlimited if empty"
                                    value={formData.usageLimit}
                                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Valid From</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.validFrom}
                                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Valid Until</label>
                                <input
                                    type="date"
                                    value={formData.validUntil}
                                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 rounded border-neutral-700 bg-neutral-800 text-purple-600 focus:ring-purple-500"
                            />
                            <label htmlFor="isActive" className="text-sm text-neutral-300">Active and ready to use</label>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-4">
                        <Link
                            href="/admin/coupons"
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
                                    Save Coupon
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    )
}
