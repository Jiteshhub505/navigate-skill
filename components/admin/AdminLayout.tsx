'use client'

import Link from 'next/link'
import {
    LayoutDashboard,
    BookOpen,
    ShoppingBag,
    Users,
    LogOut,
    Menu,
    X,
    Tag,
    Sparkles
} from 'lucide-react'
import { useState } from 'react'

import { usePathname } from 'next/navigation'

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: ShoppingBag, label: 'Orders', href: '/admin/orders' },
    { icon: BookOpen, label: 'Courses', href: '/admin/courses' },
    { icon: Sparkles, label: 'Yoga Leads', href: '/admin/yoga-leads' },
    { icon: Users, label: 'Students', href: '/admin/users' },
    { icon: Users, label: 'Teachers', href: '/admin/teachers' },
    { icon: Tag, label: 'Coupons', href: '/admin/coupons' },
]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const pathname = usePathname()

    return (
        <div className="min-h-screen bg-neutral-950 text-white flex">
            {/* Sidebar */}
            <aside
                className={`bg-neutral-900 border-r border-neutral-800 transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'
                    } flex flex-col`}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen && (
                        <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                            Admin Panel
                        </span>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                    {sidebarItems.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 p-3 rounded-xl transition-all group ${
                                    isActive
                                        ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                                        : 'hover:bg-neutral-800 text-neutral-300 hover:text-white'
                                }`}
                            >
                                <item.icon
                                    className={`transition-colors shrink-0 ${
                                        isActive ? 'text-purple-400' : 'text-neutral-400 group-hover:text-purple-400'
                                    }`}
                                    size={20}
                                />
                                {isSidebarOpen && (
                                    <span className={`font-medium text-sm ${isActive ? 'text-purple-200 font-semibold' : ''}`}>
                                        {item.label}
                                    </span>
                                )}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-neutral-800">
                    <button
                        onClick={async () => {
                            const { createClient } = await import('@/lib/supabase/client')
                            const supabase = createClient()
                            await supabase.auth.signOut()
                            window.location.href = '/login'
                        }}
                        className="flex items-center gap-4 p-3 w-full hover:bg-red-500/10 text-red-400 rounded-xl transition-all group"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="h-16 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-lg font-medium text-neutral-200">Dashboard</h1>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold">
                            A
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
