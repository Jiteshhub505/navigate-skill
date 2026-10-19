'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { getCategories } from '@/app/admin/actions'

interface SubcategoryFormProps {
    initialData?: any
    onClose: () => void
    onSubmit: (data: any) => void
}

export default function SubcategoryForm({ initialData, onClose, onSubmit }: SubcategoryFormProps) {
    const [categories, setCategories] = useState<any[]>([])
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        categoryId: initialData?.categoryId || ''
    })

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories()
                setCategories(data || [])
            } catch (error) {
                console.error('Error fetching categories:', error)
            }
        }
        fetchCategories()
    }, [])

    // Auto-generate slug from name
    useEffect(() => {
        if (!initialData && formData.name) {
            const slug = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            setFormData((prev: any) => ({ ...prev, slug }))
        }
    }, [formData.name, initialData])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        if (!formData.name) {
            setErrors(prev => ({ ...prev, name: 'Name is required' }))
            return
        }
        if (!formData.slug) {
            setErrors(prev => ({ ...prev, slug: 'Slug is required' }))
            return
        }
        if (!formData.categoryId) {
            setErrors(prev => ({ ...prev, categoryId: 'Category is required' }))
            return
        }

        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Parent Category</label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.categoryId ? 'border-red-500' : 'border-neutral-700'}`}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.categoryId && <p className="text-red-400 text-xs">{errors.categoryId}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Subcategory Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.name ? 'border-red-500' : 'border-neutral-700'}`}
                            placeholder="e.g. Frontend Frameworks"
                        />
                        {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Slug</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.slug ? 'border-red-500' : 'border-neutral-700'}`}
                            placeholder="frontend-frameworks"
                        />
                        {errors.slug && <p className="text-red-400 text-xs">{errors.slug}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Description</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                            placeholder="Brief description of the subcategory..."
                        />
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
                            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {initialData ? 'Update Subcategory' : 'Create Subcategory'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
