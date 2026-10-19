'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Trash2, Calendar, Loader2, Search } from 'lucide-react'
import { getTimings, addTiming, deleteTiming } from '../actions'
import { timingSchema } from '@/lib/validations/timing'

export default function TimingsPage() {
    const [timings, setTimings] = useState<any[]>([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        loadTimings()
    }, [])

    async function loadTimings() {
        const data = await getTimings()
        setTimings(data)
        setLoading(false)
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to delete this timing?')) {
            await deleteTiming(id)
            loadTimings()
        }
    }

    const filteredTimings = timings.filter(timing =>
        timing.name.toLowerCase().includes(search.toLowerCase()) ||
        timing.startTime.toLowerCase().includes(search.toLowerCase()) ||
        timing.endTime.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">Timings</h1>
                    <p className="text-neutral-400">Manage course timings and batches</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Timing
                </button>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search timings by name or time..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        Loading timings...
                    </div>
                ) : filteredTimings.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        No timings found.
                    </div>
                ) : filteredTimings.map((timing) => (
                    <div key={timing.id} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <Calendar size={20} />
                            </div>
                            <button
                                onClick={() => handleDelete(timing.id)}
                                className="text-neutral-500 hover:text-red-400 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                        <h3 className="text-xl font-bold mb-1">{timing.name}</h3>
                        <p className="text-neutral-400 text-sm mb-2">
                            {timing.startTime} - {timing.endTime}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {timing.days?.map((day: string) => (
                                <span key={day} className="text-xs px-2 py-1 rounded-md bg-neutral-800 text-neutral-400">
                                    {day.slice(0, 3)}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <AddTimingModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                        setIsModalOpen(false)
                        loadTimings()
                    }}
                />
            )}
        </AdminLayout>
    )
}

function AddTimingModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        name: '',
        startTime: '',
        endTime: '',
        days: [] as string[]
    })

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setErrors({})

        const result = timingSchema.safeParse(formData)
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
            await addTiming(formData)
            onSuccess()
        } catch (error) {
            alert('Error adding timing')
        } finally {
            setLoading(false)
        }
    }

    const toggleDay = (day: string) => {
        const currentDays = formData.days
        if (currentDays.includes(day)) {
            setFormData({ ...formData, days: currentDays.filter(d => d !== day) })
        } else {
            setFormData({ ...formData, days: [...currentDays, day] })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-neutral-900 border border-neutral-800 w-full max-w-md rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-6">Add New Timing</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-neutral-400 mb-1">Batch Name</label>
                        <input
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Morning Batch A"
                            className={`w-full bg-neutral-800 border rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 ${errors.name ? 'border-red-500' : 'border-neutral-700'}`}
                        />
                        {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">Start Time</label>
                            <input
                                type="time"
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                className={`w-full bg-neutral-800 border rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 ${errors.startTime ? 'border-red-500' : 'border-neutral-700'}`}
                            />
                            {errors.startTime && <p className="text-red-400 text-xs">{errors.startTime}</p>}
                        </div>
                        <div>
                            <label className="block text-sm text-neutral-400 mb-1">End Time</label>
                            <input
                                type="time"
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                className={`w-full bg-neutral-800 border rounded-xl px-4 py-2 focus:outline-none focus:border-purple-500 ${errors.endTime ? 'border-red-500' : 'border-neutral-700'}`}
                            />
                            {errors.endTime && <p className="text-red-400 text-xs">{errors.endTime}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-neutral-400 mb-2">Days</label>
                        <div className="flex flex-wrap gap-2">
                            {days.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    onClick={() => toggleDay(day)}
                                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${formData.days.includes(day)
                                        ? 'bg-purple-600 text-white'
                                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                                        }`}
                                >
                                    {day.slice(0, 3)}
                                </button>
                            ))}
                        </div>
                        {errors.days && <p className="text-red-400 text-xs mt-1">{errors.days}</p>}
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
                            {loading ? 'Adding...' : 'Add Timing'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
