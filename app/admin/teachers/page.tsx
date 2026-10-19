'use client'

import { useState, useMemo, lazy, Suspense } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Plus, Trash2, User, Mail, Award, Search, Edit2, RotateCcw, Trash } from 'lucide-react'
import TeacherCard from '@/components/features/teachers/TeacherCard'
import {
    getTeachers,
    deleteTeacher,
    getUsers,
    addTeacher,
    updateTeacher,
    getDeletedTeachers,
    restoreTeacher,
    permanentDeleteTeacher
} from '../actions'
import { useAdminData, useAdminMutation } from '@/hooks/useAdminData'

// Lazy load the form
const TeacherForm = lazy(() => import('@/components/admin/TeacherForm'))

export default function TeachersPage() {
    const [search, setSearch] = useState('')
    const [expertiseFilter, setExpertiseFilter] = useState('all')
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingTeacher, setEditingTeacher] = useState<any>(null)
    const [showTrash, setShowTrash] = useState(false)

    // Use React Query for caching
    const { data: teachers = [], isLoading: loading } = useAdminData(['teachers'], getTeachers)
    const { data: deletedTeachers = [] } = useAdminData(['deletedTeachers'], getDeletedTeachers)

    // Mutations
    const addMutation = useAdminMutation(addTeacher, {
        invalidateKeys: [['teachers']],
        onSuccess: () => setIsFormOpen(false),
    })

    const updateMutation = useAdminMutation(
        ({ id, data }: { id: string; data: any }) => updateTeacher(id, data),
        {
            invalidateKeys: [['teachers']],
            onSuccess: () => {
                setEditingTeacher(null)
                setIsFormOpen(false)
            },
        }
    )

    const restoreMutation = useAdminMutation(restoreTeacher, {
        invalidateKeys: [['teachers'], ['deletedTeachers']],
    })

    const deleteMutation = useAdminMutation(permanentDeleteTeacher, {
        invalidateKeys: [['teachers'], ['deletedTeachers']],
    })

    const softDeleteMutation = useAdminMutation(deleteTeacher, {
        invalidateKeys: [['teachers'], ['deletedTeachers']],
    })

    const handleAddTeacher = async (formData: any) => {
        try {
            await addMutation.mutateAsync(formData)
        } catch (error) {
            alert('Error adding teacher')
        }
    }

    const handleUpdateTeacher = async (formData: any) => {
        try {
            await updateMutation.mutateAsync({ id: editingTeacher.id, data: formData })
        } catch (error) {
            alert('Error updating teacher')
        }
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreMutation.mutateAsync(id)
        } catch (error) {
            alert('Error restoring teacher')
        }
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('This will permanently delete the teacher profile. Continue?')) return
        try {
            await deleteMutation.mutateAsync(id)
        } catch (error) {
            alert('Error deleting teacher permanently')
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to move this teacher profile to trash?')) {
            await softDeleteMutation.mutateAsync(id)
        }
    }

    // Memoize expensive computations
    const allExpertise = useMemo(
        () => Array.from(new Set(teachers.flatMap(t => t.expertise || []))),
        [teachers]
    )

    const displayTeachers = useMemo(
        () => (showTrash ? deletedTeachers : teachers),
        [showTrash, deletedTeachers, teachers]
    )

    const filteredTeachers = useMemo(() => {
        return displayTeachers.filter(teacher => {
            const matchesSearch = (teacher.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                teacher.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
                teacher.bio?.toLowerCase().includes(search.toLowerCase()))
            const matchesExpertise = expertiseFilter === 'all' || (Array.isArray(teacher.expertise) && teacher.expertise.includes(expertiseFilter))
            return matchesSearch && matchesExpertise
        })
    }, [displayTeachers, search, expertiseFilter])

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{showTrash ? 'Trash - Teachers' : 'Teachers'}</h1>
                    <p className="text-neutral-400">
                        {showTrash ? 'Manage deleted instructor profiles' : 'Manage instructor profiles'}
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
                            onClick={() => {
                                setEditingTeacher(null)
                                setIsFormOpen(true)
                            }}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors font-bold"
                        >
                            <Plus size={20} />
                            Add Teacher
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
                        placeholder="Search teachers by name, email or bio..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <select
                    value={expertiseFilter}
                    onChange={(e) => setExpertiseFilter(e.target.value)}
                    className="bg-neutral-900 border border-neutral-800 px-6 py-3 rounded-xl hover:bg-neutral-800 transition-colors focus:outline-none focus:border-purple-500"
                >
                    <option value="all">All Expertise</option>
                    {allExpertise.map((exp, idx) => (
                        <option key={`${exp}-${idx}`} value={String(exp)}>{String(exp)}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        Loading teachers...
                    </div>
                ) : filteredTeachers.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-neutral-500">
                        {showTrash ? 'Trash is empty' : 'No teachers found.'}
                    </div>
                ) : filteredTeachers.map((teacher) => (
                    <TeacherCard
                        key={teacher.id}
                        teacher={teacher}
                        showTrash={showTrash}
                        onEdit={setEditingTeacher}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                        onPermanentDelete={handlePermanentDelete}
                    />
                ))}
            </div>


            {(isFormOpen || editingTeacher) && (
                <Suspense fallback={<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div></div>}>
                    <TeacherForm
                        initialData={editingTeacher}
                        onClose={() => {
                            setIsFormOpen(false)
                            setEditingTeacher(null)
                        }}
                        onSubmit={editingTeacher ? handleUpdateTeacher : handleAddTeacher}
                    />
                </Suspense>
            )}
        </AdminLayout>
    )
}
