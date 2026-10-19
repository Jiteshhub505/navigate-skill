'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { categorySchema, CategoryFormData } from '@/lib/validations/category'


interface CategoryFormProps {
    initialData?: any
    onClose: () => void
    onSubmit: (data: any) => void
}

export default function CategoryForm({ initialData, onClose, onSubmit }: CategoryFormProps) {
    const [uploading, setUploading] = useState(false)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formData, setFormData] = useState<CategoryFormData>(initialData || {
        name: '',
        slug: '',
        description: '',
        imageUrl: ''
    })

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

        const result = categorySchema.safeParse(formData)
        if (!result.success) {
            const formattedErrors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                formattedErrors[issue.path[0] as string] = issue.message
            })
            setErrors(formattedErrors)
            return
        }

        onSubmit(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Category' : 'Add New Category'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Category Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.name ? 'border-red-500' : 'border-neutral-700'}`}
                            placeholder="e.g. Web Development"
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
                            placeholder="web-development"
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
                            placeholder="Brief description of the category..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Category Image</label>
                        <div className="flex flex-col gap-4">
                            {(imagePreview || formData.imageUrl) ? (
                                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700 group">
                                    <img src={imagePreview || formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    {uploading && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <Loader2 size={24} className="text-white animate-spin" />
                                        </div>
                                    )}
                                    {!uploading && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData({ ...formData, imageUrl: '' })
                                                setImagePreview(null)
                                            }}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer ${uploading ? 'border-purple-500 bg-purple-500/5 cursor-wait' : 'border-neutral-700'}`}>
                                    {uploading ? (
                                        <Loader2 size={24} className="text-purple-500 mb-2 animate-spin" />
                                    ) : (
                                        <Upload size={24} className="text-neutral-500 mb-2" />
                                    )}
                                    <span className="text-sm text-neutral-500">{uploading ? 'Uploading...' : 'Click to upload category image'}</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        disabled={uploading}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                                try {
                                                    // Set local preview immediately
                                                    const objectUrl = URL.createObjectURL(file)
                                                    setImagePreview(objectUrl)

                                                    setUploading(true)
                                                    const { uploadImage, deleteImage } = await import('@/lib/supabase/storage')
                                                    const { compressImage } = await import('@/lib/utils')

                                                    // If we have an old image, delete it
                                                    if (formData.imageUrl) {
                                                        await deleteImage(formData.imageUrl, 'category')
                                                    }

                                                    const compressedFile = await compressImage(file)
                                                    const url = await uploadImage(compressedFile, 'category')
                                                    setFormData({ ...formData, imageUrl: url })
                                                    setImagePreview(null) // Clear local preview after successful upload
                                                } catch (error) {
                                                    alert('Upload failed')
                                                    setImagePreview(null)
                                                } finally {
                                                    setUploading(false)
                                                }
                                            }
                                        }}
                                    />
                                </label>
                            )}
                        </div>
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
                            disabled={uploading}
                            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {uploading && <Loader2 size={18} className="animate-spin" />}
                            {uploading ? 'Uploading...' : initialData ? 'Update Category' : 'Create Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
