"use client";

import { useState, useEffect } from 'react'
import { LayoutDashboard, Users, KanbanSquare, Settings, LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const allNav = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'board',     label: 'Task Board',     icon: KanbanSquare },
  { id: 'team',      label: 'Team Directory', icon: Users, adminOnly: true }, // Added adminOnly flag
  { id: 'settings',  label: 'Settings',  icon: Settings },
]

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  
  const [user, setUser] = useState<{ name: string, role: string } | null>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push('/login')
    }
  }, [router])

    const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem('nexus_user')
      router.push('/login')
    }
  }

  // Filter navigation based on role
  const isAdmin = user?.role === 'Project Manager'
  const visibleNav = allNav.filter(item => !item.adminOnly || isAdmin)

  return (
    <div className="flex h-screen bg-[#f8f9fa] text-zinc-900 font-sans">
      <aside className="w-64 bg-zinc-950 text-zinc-400 flex flex-col pt-6 border-r border-zinc-800">
        
        <div className="flex items-center px-6 mb-8">
          <div className="bg-white p-2 rounded-lg w-full flex justify-center">
             <Image src="/nexus-logo.png" alt="Nexus Technology" width={140} height={40} style={{ width: 'auto', height: '40px' }} className="object-contain" />
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          <div className="px-3 pb-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Workspace</div>
          {visibleNav.map(({ id, label, icon: Icon }) => {
            const isActive = pathname === (id === 'dashboard' ? '/' : `/${id}`)
            return (
              <Link key={id} href={id === 'dashboard' ? '/' : `/${id}`} className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? 'bg-zinc-800 text-[#5c63d4]' : 'hover:bg-zinc-900 hover:text-zinc-200'}`}>
                <Icon size={18} className={isActive ? 'text-[#5c63d4]' : ''} />
                {label}
              </Link>
            )
          })}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-zinc-200 bg-white flex items-center justify-between px-8">
          
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Nexus Technology</span>
            <span>/</span>
            <span className="font-semibold text-zinc-900">
              {pathname === '/' ? 'Overview' : pathname.replace('/', '').charAt(0).toUpperCase() + pathname.slice(2)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-zinc-900 leading-tight">{user?.name || 'Loading...'}</div>
              <div className="text-xs text-zinc-500">{user?.role || ''}</div>
            </div>
            <div className="w-9 h-9 rounded-md bg-[#2a2f7a] text-white grid place-items-center text-sm font-bold shadow-sm">
              {user?.name?.charAt(0) || '?'}
            </div>
            <button onClick={handleLogout} className="ml-2 p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors" title="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}