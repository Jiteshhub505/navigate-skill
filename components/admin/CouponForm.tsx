'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2 } from 'lucide-react'

interface CouponFormProps {
    initialData?: any
    onClose: () => void
    onSubmit: (data: any) => Promise<void>
}

export default function CouponForm({ initialData, onClose, onSubmit }: CouponFormProps) {
    const [loading, setLoading] = useState(false)
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

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                discountValue: initialData.discountValue?.toString() || '',
                minPurchaseAmount: initialData.minPurchaseAmount?.toString() || '0',
                maxDiscountAmount: initialData.maxDiscountAmount?.toString() || '',
                usageLimit: initialData.usageLimit?.toString() || '',
                validFrom: initialData.validFrom ? new Date(initialData.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                validUntil: initialData.validUntil ? new Date(initialData.validUntil).toISOString().split('T')[0] : '',
            })
        }
    }, [initialData])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = {
                ...formData,
                discountValue: parseFloat(formData.discountValue),
                minPurchaseAmount: parseFloat(formData.minPurchaseAmount),
                maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                validUntil: formData.validUntil || null
            }
            await onSubmit(data)
        } catch (error) {
            console.error('Error submitting coupon:', error)
            alert('Failed to save coupon')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-2xl overflow-hidden">
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
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

                    <div className="pt-6 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-neutral-800 rounded-xl hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? 'Saving...' : initialData ? 'Update Coupon' : 'Create Coupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
