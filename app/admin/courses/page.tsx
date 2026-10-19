'use client'

import { useState, useMemo, lazy, Suspense } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Plus,
    Search,
    Filter,
    Edit2,
    Trash2,
    RotateCcw,
    Trash,
    Eye
} from 'lucide-react'
import {
    getCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    getCategories,
    getDeletedCourses,
    restoreCourse,
    permanentDeleteCourse
} from '@/app/admin/actions'
import { useAdminData, useAdminMutation } from '@/hooks/useAdminData'

// Lazy load heavy components
const CourseForm = lazy(() => import('@/components/admin/CourseForm'))

export default function AdminCourses() {
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState<any>(null)
    const [showTrash, setShowTrash] = useState(false)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')

    // Use React Query for caching
    const { data: courses = [], isLoading: loadingCourses } = useAdminData(
        ['courses'],
        getCourses
    )

    const { data: deletedCourses = [] } = useAdminData(
        ['deletedCourses'],
        getDeletedCourses
    )

    const { data: categories = [] } = useAdminData(
        ['categories'],
        getCategories
    )

    const loading = loadingCourses

    // Mutations with automatic cache invalidation
    const restoreMutation = useAdminMutation(restoreCourse, {
        invalidateKeys: [['courses'], ['deletedCourses']],
    })

    const deleteMutation = useAdminMutation(permanentDeleteCourse, {
        invalidateKeys: [['courses'], ['deletedCourses']],
    })

    const addMutation = useAdminMutation(addCourse, {
        invalidateKeys: [['courses']],
        onSuccess: () => setIsFormOpen(false),
    })

    const updateMutation = useAdminMutation(
        ({ id, data }: { id: string; data: any }) => updateCourse(id, data),
        {
            invalidateKeys: [['courses']],
            onSuccess: () => setEditingCourse(null),
        }
    )

    const softDeleteMutation = useAdminMutation(deleteCourse, {
        invalidateKeys: [['courses'], ['deletedCourses']],
    })

    const handleRestore = async (id: string) => {
        try {
            await restoreMutation.mutateAsync(id)
        } catch (error) {
            alert('Error restoring course')
        }
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('This will permanently delete the course. This action cannot be undone. Continue?')) return
        try {
            await deleteMutation.mutateAsync(id)
        } catch (error) {
            alert('Error deleting course permanently')
        }
    }

    const handleAddCourse = async (formData: any) => {
        try {
            await addMutation.mutateAsync(formData)
        } catch (error) {
            alert('Error adding course')
        }
    }

    const handleUpdateCourse = async (formData: any) => {
        try {
            await updateMutation.mutateAsync({ id: editingCourse.id, data: formData })
        } catch (error) {
            alert('Error updating course')
        }
    }

    const handleDeleteCourse = async (id: string) => {
        if (!confirm('Are you sure you want to move this course to trash?')) return

        try {
            await softDeleteMutation.mutateAsync(id)
        } catch (error) {
            alert('Error deleting course')
        }
    }

    // Memoize filtered data to prevent unnecessary recalculations
    const displayCourses = useMemo(
        () => (showTrash ? deletedCourses : courses),
        [showTrash, deletedCourses, courses]
    )

    const filteredCourses = useMemo(() => {
        return displayCourses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase()) ||
                course.teacher?.user?.name?.toLowerCase().includes(search.toLowerCase())
            const matchesCategory = selectedCategory === 'all' || course.categoryId === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [displayCourses, search, selectedCategory])

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold">{showTrash ? 'Trash - Courses' : 'Courses'}</h1>
                    <p className="text-neutral-400">
                        {showTrash ? 'Manage deleted courses' : 'Manage your course catalog'}
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
                            Add New Course
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
                        placeholder="Search courses by title or teacher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 px-6 py-3 rounded-xl hover:bg-neutral-800 transition-colors focus:outline-none focus:border-purple-500"
                >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            {/* Courses Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-800/50 border-b border-neutral-800 text-neutral-400 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">Course</th>
                                <th className="px-6 py-4 font-medium">Category</th>
                                <th className="px-6 py-4 font-medium">Price</th>
                                <th className="px-6 py-4 font-medium">Students</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        Loading courses...
                                    </td>
                                </tr>
                            ) : filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-neutral-500">
                                        {showTrash ? 'Trash is empty' : 'No courses found.'}
                                    </td>
                                </tr>
                            ) : filteredCourses.map((course) => (
                                <tr key={course.id} className="hover:bg-neutral-800/30 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-neutral-800 overflow-hidden flex-shrink-0">
                                                <img src={course.imageUrl} alt="" className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{course.title}</p>
                                                <p className="text-sm text-neutral-500">{course.teacher?.user?.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs font-medium w-fit">
                                                {course.category?.name}
                                            </span>
                                            {course.subcategoryDetails && (
                                                <span className="text-xs text-neutral-500 ml-1">
                                                    ↳ {course.subcategoryDetails.name}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium">₹{course.price}</td>
                                    <td className="px-6 py-4 text-neutral-400">0</td>
                                    <td className="px-6 py-4">
                                        {showTrash ? (
                                            <span className="text-red-400 text-sm">Deleted</span>
                                        ) : (
                                            <span className="flex items-center gap-2 text-green-400 text-sm">
                                                <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
                                                Published
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {showTrash ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRestore(course.id)}
                                                        className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"
                                                        title="Restore Course"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handlePermanentDelete(course.id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                                                        title="Delete Permanently"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <Link
                                                        href={`/${course.category?.slug}/${course.slug}`}
                                                        target="_blank"
                                                        className="p-2 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-all"
                                                        title="View Public Page"
                                                    >
                                                        <Eye size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => setEditingCourse(course)}
                                                        className="p-2 hover:bg-neutral-700 rounded-lg text-neutral-400 hover:text-white transition-all"
                                                    >
                                                        <Edit2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCourse(course.id)}
                                                        className="p-2 hover:bg-red-500/10 rounded-lg text-neutral-400 hover:text-red-400 transition-all"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {(isFormOpen || editingCourse) && (
                <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>}>
                    <CourseForm
                        initialData={editingCourse}
                        onClose={() => {
                            setIsFormOpen(false)
                            setEditingCourse(null)
                        }}
                        onSubmit={editingCourse ? handleUpdateCourse : handleAddCourse}
                    />
                </Suspense>
            )}
        </AdminLayout>
    )
}
