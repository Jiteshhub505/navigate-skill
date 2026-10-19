'use client'

import { useEffect, useState } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { getYogaLeads, deleteYogaLead } from '../actions'
import { Search, Trash2, Sparkles, Phone, MessageSquare, Calendar, Download } from 'lucide-react'

export default function YogaLeadsPage() {
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [batchFilter, setBatchFilter] = useState('all')

    useEffect(() => {
        fetchLeads()
    }, [])

    async function fetchLeads() {
        try {
            setLoading(true)
            const data = await getYogaLeads()
            setLeads(data || [])
        } catch (error) {
            console.error('Error fetching yoga leads:', error)
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (confirm('Are you sure you want to permanently delete this lead?')) {
            try {
                await deleteYogaLead(id)
                fetchLeads()
            } catch (error) {
                alert('Error deleting lead')
            }
        }
    }

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = (
            lead.name?.toLowerCase().includes(search.toLowerCase()) ||
            lead.phone?.toLowerCase().includes(search.toLowerCase()) ||
            lead.slot?.toLowerCase().includes(search.toLowerCase())
        )
        const matchesBatch = batchFilter === 'all' || lead.batch?.toLowerCase() === batchFilter.toLowerCase()
        return matchesSearch && matchesBatch
    })

    function exportToCSV() {
        if (filteredLeads.length === 0) return

        // Define CSV headers
        const headers = ["ID", "Name", "Phone", "Batch", "Time Slot", "Requirements", "Submitted At"]

        // Format rows (escaping double quotes and commas)
        const rows = filteredLeads.map(lead => [
            lead.id,
            `"${lead.name.replace(/"/g, '""')}"`,
            `"${lead.phone}"`,
            `"${lead.batch}"`,
            `"${lead.slot}"`,
            `"${(lead.requirement || '').replace(/"/g, '""')}"`,
            `"${new Date(lead.submittedAt).toLocaleString('en-IN')}"`
        ])

        // Combine headers and rows
        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n")

        // Create Blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `yoga_trial_leads_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Stats calculations
    const totalCount = leads.length
    const morningCount = leads.filter(l => l.batch?.toLowerCase() === 'morning').length
    const afternoonCount = leads.filter(l => l.batch?.toLowerCase() === 'afternoon').length
    const eveningCount = leads.filter(l => l.batch?.toLowerCase() === 'evening').length

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Sparkles className="text-purple-400" size={24} />
                        Yoga Trial Leads
                    </h1>
                    <p className="text-neutral-400">
                        Manage leads submitted via the conversational trial booking chatbot
                    </p>
                </div>
                <button
                    onClick={exportToCSV}
                    disabled={filteredLeads.length === 0}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/10 hover:shadow-purple-600/20 cursor-pointer disabled:cursor-not-allowed shrink-0"
                >
                    <Download size={18} />
                    Export to Excel (CSV)
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: 'Total Leads', value: totalCount, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                    { label: 'Morning Batches', value: morningCount, color: 'text-orange-400', bg: 'bg-orange-500/10' },
                    { label: 'Afternoon Batches', value: afternoonCount, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                    { label: 'Evening Batches', value: eveningCount, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
                ].map((stat) => (
                    <div key={stat.label} className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl">
                        <p className="text-neutral-400 text-sm font-medium">{stat.label}</p>
                        <div className="flex items-baseline justify-between mt-2">
                            <h3 className="text-3xl font-extrabold">{stat.value}</h3>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${stat.bg} ${stat.color}`}>
                                Active
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search leads by name, phone or slot..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                </div>
                <div className="flex gap-4">
                    <select
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-xl hover:bg-neutral-800 transition-colors focus:outline-none focus:border-purple-500"
                    >
                        <option value="all">All Batches</option>
                        <option value="morning">Morning</option>
                        <option value="afternoon">Afternoon</option>
                        <option value="evening">Evening</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-800/50 border-b border-neutral-800 text-neutral-400 text-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium">Name</th>
                                <th className="px-6 py-4 font-medium">Phone Number</th>
                                <th className="px-6 py-4 font-medium">Batch</th>
                                <th className="px-6 py-4 font-medium">Time Slot</th>
                                <th className="px-6 py-4 font-medium">Requirements</th>
                                <th className="px-6 py-4 font-medium">Submitted At</th>
                                <th className="px-6 py-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                                        Loading leads...
                                    </td>
                                </tr>
                            ) : filteredLeads.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-neutral-500">
                                        No yoga leads found.
                                    </td>
                                </tr>
                            ) : filteredLeads.map((lead) => {
                                const waUrl = `https://wa.me/91${lead.phone}?text=${encodeURIComponent(
                                    `Hi ${lead.name}, thank you for booking a trial yoga class with NavigateSkills Academy! We have noted your preference for the ${lead.batch} batch (${lead.slot}).`
                                )}`

                                return (
                                    <tr key={lead.id} className="hover:bg-neutral-800/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-white">{lead.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-300">
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-neutral-500" />
                                                <span>+91 {lead.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                                                lead.batch?.toLowerCase() === 'morning' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                lead.batch?.toLowerCase() === 'afternoon' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                            }`}>
                                                {lead.batch}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-neutral-300 font-medium">
                                            {lead.slot}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400 text-sm max-w-xs truncate" title={lead.requirement || 'None'}>
                                            {lead.requirement ? (
                                                <div className="flex items-center gap-1.5 text-neutral-300">
                                                    <MessageSquare size={13} className="text-purple-400 shrink-0" />
                                                    <span className="truncate">{lead.requirement}</span>
                                                </div>
                                            ) : (
                                                <span className="text-neutral-600">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-neutral-400 text-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-neutral-500" />
                                                <span>{new Date(lead.submittedAt).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2.5">
                                                <a
                                                    href={waUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/25 transition-all flex items-center justify-center"
                                                    title="Message on WhatsApp"
                                                >
                                                    <MessageSquare size={18} />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(lead.id)}
                                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/25 transition-all flex items-center justify-center"
                                                    title="Delete Lead"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}
