'use client'

import { useState, useEffect } from 'react'
import { X, Upload, Plus, Check, Loader2, Trash2 } from 'lucide-react'
import { getCategories, getTeachers, getDurations, getTimings, getSubcategories } from '@/app/admin/actions'
import { courseSchema, CourseFormData } from '@/lib/validations/course'
import type { CourseWithRelations, Category, Teacher, Duration, Timing, CoursePricingWithDuration, CourseTimingWithTiming } from '@/types/index'
import { handleError } from '@/lib/errors'

interface CourseFormProps {
    initialData?: CourseWithRelations | null
    onClose: () => void
    onSubmit: (data: CourseFormData) => Promise<void>
}

export default function CourseForm({ initialData, onClose, onSubmit }: CourseFormProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [durations, setDurations] = useState<Duration[]>([])
    const [timings, setTimings] = useState<Timing[]>([])
    const [subcategories, setSubcategories] = useState<any[]>([])

    const [uploading, setUploading] = useState(false)
    const [uploadingGallery, setUploadingGallery] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const [formData, setFormData] = useState<CourseFormData>(() => {
        if (!initialData) {
            return {
                title: '',
                slug: '',
                description: '',
                longDescription: '',
                categoryId: '',
                subcategory: '',
                subcategoryId: '',
                imageUrl: '',
                galleryImages: [],
                teacherId: '',
                timingIds: [],
                features: [],
                level: 'Beginner',
                maxStudents: '',
                pricings: [
                    { durationId: '', originalPrice: '', discountedPrice: '' }
                ]
            } as CourseFormData
        }

        return {
            ...initialData,
            subcategoryId: initialData.subcategoryId || '',
            maxStudents: initialData.maxStudents ? initialData.maxStudents.toString() : '',
            timingIds: initialData.timingIds || initialData.courseTimings?.map((ct: CourseTimingWithTiming) => ct.timingId) || [],
            galleryImages: initialData.galleryImages || [],
            features: initialData.features || [],
            pricings: initialData.coursePricings?.map((p: CoursePricingWithDuration) => ({
                durationId: p.durationId,
                originalPrice: p.originalPrice.toString(),
                discountedPrice: p.discountedPrice.toString()
            })) || [{ durationId: '', originalPrice: '', discountedPrice: '' }]
        } as CourseFormData
    })

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null)
            return
        }

        const objectUrl = URL.createObjectURL(imageFile)
        setImagePreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [imageFile])

    // Auto-generate slug from title
    useEffect(() => {
        if (!initialData && formData.title) {
            const slug = formData.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            setFormData((prev) => ({ ...prev, slug }))
        }
    }, [formData.title, initialData])

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            const [cats, teacs, durs, tims, subs] = await Promise.all([
                getCategories(),
                getTeachers(),
                getDurations(),
                getTimings(),
                getSubcategories()
            ])
            setCategories((cats as any) || [])
            setTeachers((teacs as any) || [])
            setDurations((durs as any) || [])
            setTimings((tims as any) || [])
            setSubcategories((subs as any) || [])
        } catch (error) {
            const errorResponse = handleError(error)
            console.error('Error fetching form data:', errorResponse)
        }
    }

    const addPricingRow = () => {
        setFormData({
            ...formData,
            pricings: [...formData.pricings, { durationId: '', originalPrice: '', discountedPrice: '' }]
        })
    }

    const removePricingRow = (index: number) => {
        if (formData.pricings.length <= 1) return
        const newPricings = [...formData.pricings]
        newPricings.splice(index, 1)
        setFormData({ ...formData, pricings: newPricings })
    }

    const updatePricingRow = (index: number, field: string, value: string) => {
        const newPricings = [...formData.pricings]
        newPricings[index] = { ...newPricings[index], [field]: value }
        setFormData({ ...formData, pricings: newPricings })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})

        // Validate with Zod
        const validationData = {
            ...formData,
            imageUrl: imageFile ? 'pending-upload' : formData.imageUrl
        }
        const result = courseSchema.safeParse(validationData)
        if (!result.success) {
            const formattedErrors: Record<string, string> = {}
            result.error.issues.forEach((issue) => {
                const path = issue.path.join('.')
                formattedErrors[path] = issue.message
            })
            setErrors(formattedErrors)
            console.log('Validation errors:', formattedErrors)

            // Scroll to top to show error message
            const formContainer = document.querySelector('.overflow-y-auto')
            if (formContainer) {
                formContainer.scrollTop = 0
            }
            return
        }

        setUploading(true)
        try {
            let imageUrl = formData.imageUrl

            if (imageFile) {
                const { uploadImage, deleteImage } = await import('@/lib/supabase/storage')
                const { compressImage } = await import('@/lib/utils')

                // If we are updating and have an old image, delete it
                if (initialData?.imageUrl) {
                    await deleteImage(initialData.imageUrl, 'course')
                }

                const compressedFile = await compressImage(imageFile)
                imageUrl = await uploadImage(compressedFile, 'course')
            }

            await onSubmit({ ...formData, imageUrl })
        } catch (error) {
            const errorResponse = handleError(error)
            console.error('Submission error:', errorResponse)
            alert(`Error submitting form: ${errorResponse.message}`)
        } finally {
            setUploading(false)
        }
    }

    const toggleTiming = (timingId: string) => {
        const currentTimings = formData.timingIds || []
        if (currentTimings.includes(timingId)) {
            setFormData({ ...formData, timingIds: currentTimings.filter((id: string) => id !== timingId) })
        } else {
            setFormData({ ...formData, timingIds: [...currentTimings, timingId] })
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between sticky top-0 bg-neutral-900 z-10">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Course' : 'Add New Course'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">
                    {Object.keys(errors).length > 0 && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-full">
                                <X size={16} />
                            </div>
                            <div>
                                <p className="font-bold">Please fix the errors below</p>
                                <p className="text-sm opacity-80">Some required fields are missing or invalid.</p>
                            </div>
                        </div>
                    )}
                    {/* Basic Info Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Course Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.title ? 'border-red-500' : 'border-neutral-700'}`}
                                    placeholder="e.g. Modern React Mastery"
                                />
                                {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Slug (URL Path)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.slug ? 'border-red-500' : 'border-neutral-700'}`}
                                    placeholder="modern-react-mastery"
                                />
                                {errors.slug && <p className="text-red-400 text-xs">{errors.slug}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.categoryId ? 'border-red-500' : 'border-neutral-700'}`}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <p className="text-red-400 text-xs">{errors.categoryId}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Subcategory</label>
                                <select
                                    value={formData.subcategoryId}
                                    onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                                    className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.subcategoryId ? 'border-red-500' : 'border-neutral-700'}`}
                                    disabled={!formData.categoryId}
                                >
                                    <option value="">Select Subcategory</option>
                                    {subcategories
                                        .filter(sub => sub.categoryId === formData.categoryId)
                                        .map((sub) => (
                                            <option key={sub.id} value={sub.id}>{sub.name}</option>
                                        ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Media Section */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Course Media</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Main Banner Image</label>
                                <div className="flex flex-col gap-4">
                                    {(imagePreview || formData.imageUrl) ? (
                                        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700 group">
                                            <img src={imagePreview || formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageFile(null)
                                                    setFormData({ ...formData, imageUrl: '' })
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer ${errors.imageUrl ? 'border-red-500 bg-red-500/5' : 'border-neutral-700'}`}>
                                            <Upload size={24} className={errors.imageUrl ? 'text-red-500' : 'text-neutral-500 mb-2'} />
                                            <span className={`text-sm ${errors.imageUrl ? 'text-red-500' : 'text-neutral-500'}`}>
                                                Click to upload banner
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) setImageFile(file)
                                                }}
                                            />
                                        </label>
                                    )}
                                    {errors.imageUrl && <p className="text-red-400 text-xs">{errors.imageUrl}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Gallery Images</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {formData.galleryImages?.map((img: string, i: number) => (
                                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-800 border border-neutral-700 group">
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => setFormData({
                                                    ...formData,
                                                    galleryImages: formData.galleryImages?.filter((_: string, idx: number) => idx !== i)
                                                })}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                    <label className={`flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer ${uploadingGallery ? 'border-purple-500 bg-purple-500/5 cursor-wait' : 'border-neutral-700'}`}>
                                        {uploadingGallery ? (
                                            <Loader2 size={20} className="text-purple-500 animate-spin" />
                                        ) : (
                                            <Plus size={20} className="text-neutral-500" />
                                        )}
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="hidden"
                                            disabled={uploadingGallery}
                                            onChange={async (e) => {
                                                const files = Array.from(e.target.files || [])
                                                if (files.length > 0) {
                                                    try {
                                                        setUploadingGallery(true)
                                                        const { uploadImage } = await import('@/lib/supabase/storage')
                                                        const { compressImage } = await import('@/lib/utils')

                                                        const compressedFiles = await Promise.all(files.map(f => compressImage(f)))
                                                        const urls = await Promise.all(compressedFiles.map(f => uploadImage(f, 'course')))

                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            galleryImages: [...(prev.galleryImages || []), ...urls]
                                                        }))
                                                    } catch (error) {
                                                        alert('Gallery upload failed')
                                                    } finally {
                                                        setUploadingGallery(false)
                                                    }
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course Content */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Course Content</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Short Description</label>
                                <textarea
                                    required
                                    rows={2}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors resize-none ${errors.description ? 'border-red-500' : 'border-neutral-700'}`}
                                    placeholder="Brief overview..."
                                />
                                {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Long Description</label>
                                <textarea
                                    rows={5}
                                    value={formData.longDescription}
                                    onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                    placeholder="Detailed curriculum..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Pricing & Durations (₹)</h3>
                            <button
                                type="button"
                                onClick={addPricingRow}
                                className="text-xs bg-purple-600/20 text-purple-400 px-3 py-1.5 rounded-lg hover:bg-purple-600/30 transition-all flex items-center gap-1"
                            >
                                <Plus size={14} />
                                Add Duration
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.pricings.map((pricing, index: number) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-neutral-800/50 border border-neutral-800 rounded-2xl relative group">
                                    <div className="space-y-2">
                                        <label className="text-xs text-neutral-500">Duration</label>
                                        <select
                                            value={pricing.durationId}
                                            onChange={(e) => updatePricingRow(index, 'durationId', e.target.value)}
                                            className={`w-full bg-neutral-800 border rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors ${errors[`pricings.${index}.durationId`] ? 'border-red-500' : 'border-neutral-700'}`}
                                        >
                                            <option value="">Select Duration</option>
                                            {durations.map((d) => (
                                                <option key={d.id} value={d.id}>{d.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-neutral-500">Original Price (₹)</label>
                                        <input
                                            type="number"
                                            value={pricing.originalPrice}
                                            onChange={(e) => updatePricingRow(index, 'originalPrice', e.target.value)}
                                            className={`w-full bg-neutral-800 border rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors ${errors[`pricings.${index}.originalPrice`] ? 'border-red-500' : 'border-neutral-700'}`}
                                            placeholder="e.g. 5000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs text-neutral-500">Discounted Price (₹)</label>
                                        <input
                                            type="number"
                                            value={pricing.discountedPrice}
                                            onChange={(e) => updatePricingRow(index, 'discountedPrice', e.target.value)}
                                            className={`w-full bg-neutral-800 border rounded-xl p-2.5 text-sm focus:outline-none focus:border-purple-500 transition-colors ${errors[`pricings.${index}.discountedPrice`] ? 'border-red-500' : 'border-neutral-700'}`}
                                            placeholder="e.g. 2999"
                                        />
                                    </div>
                                    <div className="flex items-end pb-1">
                                        <button
                                            type="button"
                                            onClick={() => removePricingRow(index)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            disabled={formData.pricings.length <= 1}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                    {errors[`pricings.${index}.durationId`] && <p className="text-red-400 text-[10px] absolute bottom-1 left-4">Duration is required</p>}
                                </div>
                            ))}
                            {errors.pricings && <p className="text-red-400 text-xs">{errors.pricings}</p>}
                        </div>
                    </div>

                    {/* Logistics & Relations */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">Logistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Teacher</label>
                                <select
                                    value={formData.teacherId}
                                    onChange={(e) => setFormData({ ...formData, teacherId: e.target.value })}
                                    className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.teacherId ? 'border-red-500' : 'border-neutral-700'}`}
                                >
                                    <option value="">Select Teacher</option>
                                    {teachers.map((teacher) => (
                                        <option key={teacher.id} value={teacher.id}>
                                            {teacher.user?.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.teacherId && <p className="text-red-400 text-xs">{errors.teacherId}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Course Level</label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Max Students</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.maxStudents || ''}
                                    onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                                    className={`w-full bg-neutral-800 border rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors ${errors.maxStudents ? 'border-red-500' : 'border-neutral-700'}`}
                                    placeholder="Leave empty for unlimited"
                                />
                                {errors.maxStudents && <p className="text-red-400 text-xs">{errors.maxStudents}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Timings (Select multiple)</label>
                                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-2 bg-neutral-800 border border-neutral-700 rounded-xl">
                                    {timings.map((timing) => (
                                        <label key={timing.id} className="flex items-center gap-3 p-2 hover:bg-neutral-700 rounded-lg cursor-pointer transition-colors">
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.timingIds?.includes(timing.id)
                                                ? 'bg-purple-600 border-purple-600'
                                                : 'border-neutral-500'
                                                }`}>
                                                {formData.timingIds?.includes(timing.id) && <Check size={14} className="text-white" />}
                                            </div>
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={formData.timingIds?.includes(timing.id)}
                                                onChange={() => toggleTiming(timing.id)}
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{timing.name}</span>
                                                <span className="text-xs text-neutral-400">
                                                    {timing.startTime} - {timing.endTime} ({timing.days?.map((d: string) => d.slice(0, 3)).join(', ')})
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-neutral-400">Features (one per line)</label>
                                <textarea
                                    rows={4}
                                    value={formData.features?.join('\n')}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n').filter(f => f.trim()) })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                                    placeholder="Lifetime Access&#10;Certificate of Completion"
                                />
                            </div>
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
                            disabled={uploading || uploadingGallery}
                            className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed rounded-xl font-bold transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                        >
                            {uploading && <Loader2 size={18} className="animate-spin" />}
                            {uploading ? 'Saving...' : initialData ? 'Update Course' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

