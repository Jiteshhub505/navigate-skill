'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import CategoryForm from '@/components/admin/CategoryForm'
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Image as ImageIcon,
    RotateCcw,
    Trash
} from 'lucide-react'
import {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    getDeletedCategories,
    restoreCategory,
    permanentDeleteCategory
} from '@/app/admin/actions'

export default function AdminCategories() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCategory, setEditingCategory] = useState<any>(null)
    const [categories, setCategories] = useState<any[]>([])
    const [deletedCategories, setDeletedCategories] = useState<any[]>([])
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
                getCategories(),
                getDeletedCategories()
            ])
            setCategories(data || [])
            setDeletedCategories(deletedData || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreCategory(id)
            fetchData()
        } catch (error) {
            alert('Error restoring category')
        }
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('This will permanently delete the category. This action cannot be undone. Continue?')) return
        try {
            const result = await permanentDeleteCategory(id)
            if (result?.error) {
                alert(result.error)
                return
            }
            fetchData()
        } catch (error) {
            alert('Error deleting category permanently')
        }
    }

    const handleAddCategory = async (formData: any) => {
        try {
            const result = await addCategory(formData)
            if (result?.error) {
                alert(result.error)
                return
            }
            fetchData()
            setIsFormOpen(false)
        } catch (error) {
            alert('Error adding category')
        }
    }

    const handleUpdateCategory = async (formData: any) => {
        try {
            const result = await updateCategory(editingCategory.id, formData)
            if (result?.error) {
                alert(result.error)
                return
            }
            fetchData()
            setEditingCategory(null)
        } catch (error) {
            alert('Error updating category')
        }
    }

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to move this category to trash?')) return

        try {
            await deleteCategory(id)
            fetchData()
        } catch (error) {
            alert('Error deleting category')
        }
    }

    const displayCategories = showTrash ? deletedCategories : categories
    const filteredCategories = displayCategories.filter(cat =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.description?.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{showTrash ? 'Trash - Categories' : 'Categories'}</h1>
                    <p className="text-neutral-400">
                        {showTrash ? 'Manage deleted categories' : 'Manage course categories and their images'}
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
                            Add New Category
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
                        placeholder="Search categories by name or description..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        Loading categories...
                    </div>
                ) : filteredCategories.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        {showTrash ? 'Trash is empty' : 'No categories found.'}
                    </div>
                ) : filteredCategories.map((cat) => (
                    <div key={cat.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group">
                        <div className="relative h-40 bg-neutral-800">
                            {cat.imageUrl ? (
                                <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-neutral-700">
                                    <ImageIcon size={48} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                {showTrash ? (
                                    <>
                                        <button
                                            onClick={() => handleRestore(cat.id)}
                                            className="p-3 bg-green-500/20 hover:bg-green-500/40 rounded-full text-green-400 transition-colors backdrop-blur-md"
                                            title="Restore"
                                        >
                                            <RotateCcw size={20} />
                                        </button>
                                        <button
                                            onClick={() => handlePermanentDelete(cat.id)}
                                            className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-colors backdrop-blur-md"
                                            title="Delete Permanently"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setEditingCategory(cat)}
                                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="p-3 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-colors backdrop-blur-md"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-1">{cat.name}</h3>
                            <p className="text-sm text-neutral-500 mb-4">{cat.slug}</p>
                            <p className="text-sm text-neutral-400 line-clamp-2">{cat.description || 'No description provided.'}</p>
                        </div>
                    </div>
                ))}
            </div>

            {(isFormOpen || editingCategory) && (
                <CategoryForm
                    initialData={editingCategory}
                    onClose={() => {
                        setIsFormOpen(false)
                        setEditingCategory(null)
                    }}
                    onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
                />
            )}
        </AdminLayout>
    )
}
