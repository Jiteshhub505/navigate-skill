'use client'

import { useState, useEffect } from 'react'
import { X, Save, Loader2, Upload, Plus, Linkedin, Twitter, Globe, Award } from 'lucide-react'

interface TeacherFormProps {
    initialData?: any
    onClose: () => void
    onSubmit: (data: any) => Promise<void>
}

export default function TeacherForm({ initialData, onClose, onSubmit }: TeacherFormProps) {
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        expertise: [] as string[],
        experience: '',
        qualifications: [] as string[],
        profileImageUrl: '',
        socialLinks: {
            linkedin: '',
            twitter: '',
            website: '',
            instagram: '',
            youtube: '',
            facebook: ''
        },
        isActive: true
    })

    const [newExpertise, setNewExpertise] = useState('')
    const [newQualification, setNewQualification] = useState('')

    useEffect(() => {
        if (!imageFile) {
            setImagePreview(null)
            return
        }

        const objectUrl = URL.createObjectURL(imageFile)
        setImagePreview(objectUrl)

        return () => URL.revokeObjectURL(objectUrl)
    }, [imageFile])

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                name: initialData.user?.name || '',
                email: initialData.user?.email || '',
                phone: initialData.user?.phone || '',
                experience: initialData.experience?.toString() || '',
                expertise: initialData.expertise || [],
                qualifications: initialData.qualifications || [],
                socialLinks: {
                    linkedin: initialData.socialLinks?.linkedin || '',
                    twitter: initialData.socialLinks?.twitter || '',
                    website: initialData.socialLinks?.website || '',
                    instagram: initialData.socialLinks?.instagram || '',
                    youtube: initialData.socialLinks?.youtube || '',
                    facebook: initialData.socialLinks?.facebook || '',
                },
                isActive: initialData.isActive ?? true
            })
        }
    }, [initialData])

    const handleAddExpertise = () => {
        if (newExpertise.trim()) {
            setFormData({
                ...formData,
                expertise: [...formData.expertise, newExpertise.trim()]
            })
            setNewExpertise('')
        }
    }

    const removeExpertise = (index: number) => {
        const updated = [...formData.expertise]
        updated.splice(index, 1)
        setFormData({ ...formData, expertise: updated })
    }

    const handleAddQualification = () => {
        if (newQualification.trim()) {
            setFormData({
                ...formData,
                qualifications: [...formData.qualifications, newQualification.trim()]
            })
            setNewQualification('')
        }
    }

    const removeQualification = (index: number) => {
        const updated = [...formData.qualifications]
        updated.splice(index, 1)
        setFormData({ ...formData, qualifications: updated })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            let profileImageUrl = formData.profileImageUrl

            if (imageFile) {
                const { uploadImage, deleteImage } = await import('@/lib/supabase/storage')
                const { compressImage } = await import('@/lib/utils')

                const compressedFile = await compressImage(imageFile)
                profileImageUrl = await uploadImage(compressedFile, 'course')
            }

            await onSubmit({
                ...formData,
                profileImageUrl,
                experience: formData.experience ? parseInt(formData.experience) : null
            })
        } catch (error) {
            console.error('Error saving teacher:', error)
            alert('Failed to save teacher')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-3xl overflow-hidden">
                <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Teacher' : 'Add New Teacher'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[85vh] overflow-y-auto custom-scrollbar">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Full Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                disabled={!!initialData}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Phone Number</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                                placeholder="+91 00000 00000"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Experience (Years)</label>
                            <input
                                type="number"
                                value={formData.experience}
                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Profile Image</label>
                            <div className="flex items-center gap-4">
                                {(imagePreview || formData.profileImageUrl) && (
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
                                        <img
                                            src={imagePreview || formData.profileImageUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-neutral-700 rounded-xl py-2 px-4 hover:border-purple-500 hover:bg-purple-500/5 transition-all cursor-pointer text-sm text-neutral-400">
                                    <Upload size={16} />
                                    {imageFile ? imageFile.name : 'Upload Photo'}
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
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-sm text-neutral-400">Bio</label>
                        <textarea
                            rows={3}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 focus:outline-none focus:border-purple-500 transition-all text-white resize-none"
                            placeholder="Tell us about the teacher..."
                        />
                    </div>

                    {/* Expertise & Qualifications */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Expertise</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newExpertise}
                                    onChange={(e) => setNewExpertise(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExpertise())}
                                    placeholder="Add expertise..."
                                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl py-2 px-4 focus:outline-none focus:border-purple-500 transition-all text-white text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddExpertise}
                                    className="p-2 bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.expertise.map((item, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-lg text-xs text-neutral-300">
                                        {item}
                                        <button type="button" onClick={() => removeExpertise(i)} className="hover:text-red-400 ml-1">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-neutral-400">Qualifications</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={newQualification}
                                    onChange={(e) => setNewQualification(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQualification())}
                                    placeholder="Add qualification..."
                                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl py-2 px-4 focus:outline-none focus:border-purple-500 transition-all text-white text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddQualification}
                                    className="p-2 bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                                >
                                    <Award size={18} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.qualifications.map((item, i) => (
                                    <span key={i} className="flex items-center gap-1 bg-neutral-800 border border-neutral-700 px-3 py-1 rounded-lg text-xs text-neutral-300">
                                        {item}
                                        <button type="button" onClick={() => removeQualification(i)} className="hover:text-red-400 ml-1">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <label className="text-sm text-neutral-400 block">Social Links</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    type="url"
                                    placeholder="LinkedIn Profile URL"
                                    value={formData.socialLinks.linkedin}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                                    })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    type="url"
                                    placeholder="Twitter Profile URL"
                                    value={formData.socialLinks.twitter}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                                    })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white text-sm"
                                />
                            </div>
                            <div className="relative">
                                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                                <input
                                    type="url"
                                    placeholder="Personal Website URL"
                                    value={formData.socialLinks.website}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, website: e.target.value }
                                    })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white text-sm"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">IG</div>
                                <input
                                    type="url"
                                    placeholder="Instagram Profile URL"
                                    value={formData.socialLinks.instagram}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                                    })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white text-sm"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">YT</div>
                                <input
                                    type="url"
                                    placeholder="YouTube Channel URL"
                                    value={formData.socialLinks.youtube}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, youtube: e.target.value }
                                    })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white text-sm"
                                />
                            </div>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-xs">FB</div>
                                <input
                                    type="url"
                                    placeholder="Facebook Profile URL"
                                    value={formData.socialLinks.facebook}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                                    })}
                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all text-white text-sm"
                                />
                            </div>
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
                        <label htmlFor="isActive" className="text-sm text-neutral-300">Active Teacher</label>
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
                            {loading ? 'Saving...' : initialData ? 'Update Teacher' : 'Add Teacher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
