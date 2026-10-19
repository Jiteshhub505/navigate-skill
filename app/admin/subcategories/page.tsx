'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import SubcategoryForm from '@/components/admin/SubcategoryForm'
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    RotateCcw,
    Trash,
    Layers
} from 'lucide-react'
import {
    getSubcategories,
    addSubcategory,
    updateSubcategory,
    deleteSubcategory,
    getDeletedSubcategories,
    restoreSubcategory,
    permanentDeleteSubcategory
} from '@/app/admin/actions'

export default function AdminSubcategories() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingSubcategory, setEditingSubcategory] = useState<any>(null)
    const [subcategories, setSubcategories] = useState<any[]>([])
    const [deletedSubcategories, setDeletedSubcategories] = useState<any[]>([])
    const [showTrash, setShowTrash] = useState(false)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

    async function fetchData() {
        try {
            setLoading(true)
            const [data, deletedData] = await Promise.all([
                getSubcategories(),
                getDeletedSubcategories()
            ])
            setSubcategories(data || [])
            setDeletedSubcategories(deletedData || [])
        } catch (error) {
            console.error('Error fetching subcategories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreSubcategory(id)
            fetchData()
        } catch (error) {
            alert('Error restoring subcategory')
        }
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('This will permanently delete the subcategory. This action cannot be undone. Continue?')) return
        try {
            const result = await permanentDeleteSubcategory(id)
            if (result?.error) {
                alert(result.error)
                return
            }
            fetchData()
        } catch (error) {
            alert('Error deleting subcategory permanently')
        }
    }

    const handleAddSubcategory = async (formData: any) => {
        try {
            const result = await addSubcategory(formData)
            if (result?.error) {
                alert(result.error)
                return
            }
            fetchData()
            setIsFormOpen(false)
        } catch (error) {
            alert('Error adding subcategory')
        }
    }

    const handleUpdateSubcategory = async (formData: any) => {
        try {
            const result = await updateSubcategory(editingSubcategory.id, formData)
            if (result?.error) {
                alert(result.error)
                return
            }
            fetchData()
            setEditingSubcategory(null)
        } catch (error) {
            alert('Error updating subcategory')
        }
    }

    const handleDeleteSubcategory = async (id: string) => {
        if (!confirm('Are you sure you want to move this subcategory to trash?')) return

        try {
            await deleteSubcategory(id)
            fetchData()
        } catch (error) {
            alert('Error deleting subcategory')
        }
    }

    const displaySubcategories = showTrash ? deletedSubcategories : subcategories
    const filteredSubcategories = displaySubcategories.filter(sub =>
        sub.name.toLowerCase().includes(search.toLowerCase()) ||
        sub.description?.toLowerCase().includes(search.toLowerCase()) ||
        sub.category?.name.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{showTrash ? 'Trash - Subcategories' : 'Subcategories'}</h1>
                    <p className="text-neutral-400">
                        {showTrash ? 'Manage deleted subcategories' : 'Manage course subcategories'}
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
                            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all"
                        >
                            <Plus size={20} />
                            Add New Subcategory
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
                        placeholder="Search subcategories by name, description or parent category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            {/* Subcategories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        Loading subcategories...
                    </div>
                ) : filteredSubcategories.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        {showTrash ? 'Trash is empty' : 'No subcategories found.'}
                    </div>
                ) : filteredSubcategories.map((sub) => (
                    <div key={sub.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group">
                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-neutral-800 rounded-xl">
                                    <Layers size={24} className="text-purple-500" />
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {showTrash ? (
                                        <>
                                            <button
                                                onClick={() => handleRestore(sub.id)}
                                                className="p-2 bg-green-500/20 hover:bg-green-500/40 rounded-lg text-green-400 transition-colors"
                                                title="Restore"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                            <button
                                                onClick={() => handlePermanentDelete(sub.id)}
                                                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors"
                                                title="Delete Permanently"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setEditingSubcategory(sub)}
                                                className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-white transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSubcategory(sub.id)}
                                                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold mb-1">{sub.name}</h3>
                            <p className="text-sm text-neutral-500 mb-2">{sub.slug}</p>

                            <div className="inline-block px-3 py-1 bg-neutral-800 rounded-lg text-xs text-neutral-400 mb-4">
                                {sub.category?.name || 'No Category'}
                            </div>

                            <p className="text-sm text-neutral-400 line-clamp-2">{sub.description || 'No description provided.'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {(isFormOpen || editingSubcategory) && (
                <SubcategoryForm
                    initialData={editingSubcategory}
                    onClose={() => {
                        setIsFormOpen(false)
                        setEditingSubcategory(null)
                    }}
                    onSubmit={editingSubcategory ? handleUpdateSubcategory : handleAddSubcategory}
                />
            )}
        </AdminLayout>
    )
}
