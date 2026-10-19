'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Trash2, Clock, Loader2, Search } from 'lucide-react'
import { getDurations, addDuration, deleteDuration } from '../actions'
import { durationSchema } from '@/lib/validations/duration'

export default function DurationsPage() {
    const [durations, setDurations] = useState<any[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadDurations()
    }, [])

    async function loadDurations() {
        const data = await getDurations()
        setDurations(data)
        setLoading(false)
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this duration?')) {
            await deleteDuration(id)
            loadDurations()
        }
    }

    const filteredDurations = durations.filter(duration =>
        duration.name.toLowerCase().includes(search.toLowerCase()) ||
        duration.value.toString().includes(search) ||
        duration.unit.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Durations</h1>
                    <p className="text-neutral-400">Manage course durations</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Duration
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search durations by name, value or unit..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        Loading durations...
                    </div>
                ) : filteredDurations.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        No durations found.
                    </div>
                ) : filteredDurations.map((duration) => (
                    <div key={duration.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <Clock size={20} />
                            </div>
                            <button
                                onClick={() => handleDelete(duration.id)}
                                className="text-neutral-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{duration.name}</h3>
                        <p className="text-neutral-400 text-sm">
                            {duration.value} {duration.unit}
                        </p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <AddDurationModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false)
                        loadDurations()
                    }}
                />
            )}
        </AdminLayout>
    )
}

function AddDurationModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        name: '',
        value: '',
        unit: 'months'
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrors({})

        const dataToValidate = {
            ...formData,
            value: parseInt(formData.value)
        }

        const result = durationSchema.safeParse(dataToValidate)
        if (!result.success) {
            const formattedErrors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0] as string] = issue.message
            })
            setErrors(formattedErrors)
            return
        }

        setLoading(true)
        try {
            await addDuration(dataToValidate)
            onSuccess()
        } catch (error) {
            alert('Error adding duration')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">Add New Duration</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Display Name</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. 3 Months"
                            className={`w-full bg-neutral-800 border rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 ${errors.name ? 'border-red-500' : 'border-neutral-700'}`}
                        />
                        {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Value</label>
                            <input
                                type="number"
                                value={formData.value}
                                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                placeholder="e.g. 90"
                                className={`w-full bg-neutral-800 border rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 ${errors.value ? 'border-red-500' : 'border-neutral-700'}`}
                            />
                            {errors.value && <p className="text-red-400 text-xs">{errors.value}</p>}
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Unit</label>
                            <select
                                value={formData.unit}
                                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500"
                            >
                                <option value="days">Days</option>
                                <option value="weeks">Weeks</option>
                                <option value="months">Months</option>
                                <option value="years">Years</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-xl border border-neutral-700 hover:bg-neutral-800 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 size={16} className="animate-spin" />}
                            {loading ? 'Adding...' : 'Add Duration'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
