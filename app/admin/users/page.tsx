'use client'

import { Check, X, Trash2, Shield, UserCheck, Plus, Search, Filter, RotateCcw, Trash } from 'lucide-react'
import {
    getUsers,
    approveUser,
    deleteUser,
    getDeletedUsers,
    restoreUser,
    permanentDeleteUser
} from '../actions'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([])
    const [deletedUsers, setDeletedUsers] = useState<any[]>([])
    const [showTrash, setShowTrash] = useState(false)
    const [loading, setLoading] = useState(true)
    const [currentAdminId, setCurrentAdminId] = useState<string | null>(null)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const supabase = createClient()

    useEffect(() => {
        fetchData()
        getCurrentUser()
    }, [])

    async function getCurrentUser() {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const allUsers = await getUsers()
            const dbUser = allUsers.find((u: any) => u.email === user.email)
            if (dbUser) setCurrentAdminId(dbUser.id)
        }
    }

    async function fetchData() {
        try {
            setLoading(true)
            const [data, deletedData] = await Promise.all([
                getUsers(),
                getDeletedUsers()
            ])
            setUsers(data || [])
            setDeletedUsers(deletedData || [])
        } catch (error) {
            console.error('Error fetching users:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleApprove(userId: string) {
        if (!currentAdminId) return
        await approveUser(userId, currentAdminId)
        fetchData()
    }

    const handleRestore = async (id: string) => {
        try {
            await restoreUser(id)
            fetchData()
        } catch (error) {
            alert('Error restoring user')
        }
    }

    const handlePermanentDelete = async (id: string) => {
        if (!confirm('This will permanently delete the user account. Continue?')) return
        try {
            await permanentDeleteUser(id)
            fetchData()
        } catch (error) {
            alert('Error deleting user permanently')
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to move this user to trash?')) {
            await deleteUser(id)
            fetchData()
        }
    }

    const displayUsers = showTrash ? deletedUsers : users
    const filteredUsers = displayUsers.filter(user => {
        const matchesSearch = (user.name?.toLowerCase().includes(search.toLowerCase()) ||
            user.email?.toLowerCase().includes(search.toLowerCase()))
        const matchesRole = roleFilter === 'all' || user.role === roleFilter
        const matchesStatus = statusFilter === 'all' || user.approvalStatus === statusFilter
        return matchesSearch && matchesRole && matchesStatus
    })

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{showTrash ? 'Trash - Users' : 'Users'}</h1>
                    <p className="text-neutral-400">
                        {showTrash ? 'Manage deleted user accounts' : 'Manage user accounts and approvals'}
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
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-colors focus:outline-none focus:border-purple-500"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="student">Student</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-colors focus:outline-none focus:border-purple-500"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-800/50 border-b border-neutral-800 text-neutral-400 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Email</th>
                                <th className="px-6 py-4 font-medium">Role</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                        {showTrash ? 'Trash is empty' : 'No users found.'}
                                    </td>
                                </tr>
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-white">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-neutral-400">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                            user.role === 'teacher' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                'bg-neutral-800 text-neutral-400 border-neutral-700'
                                            }`}>
                                            {user.role === 'admin' && <Shield size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {showTrash ? (
                                            <span className="text-red-400 text-sm">Deleted</span>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${user.approvalStatus === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                user.approvalStatus === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                }`}>
                                                {user.approvalStatus === 'approved' && <Check size={12} />}
                                                {user.approvalStatus}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            {showTrash ? (
                                                <>
                                                    <button
                                                        onClick={() => handleRestore(user.id)}
                                                        className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-all"
                                                        title="Restore"
                                                    >
                                                        <RotateCcw size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handlePermanentDelete(user.id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-all"
                                                        title="Delete Permanently"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {user.approvalStatus === 'pending' && (
                                                        <button
                                                            onClick={() => handleApprove(user.id)}
                                                            className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
                                                            title="Approve User"
                                                        >
                                                            <UserCheck size={18} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                                        title="Delete User"
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
        </AdminLayout>
    )
}
