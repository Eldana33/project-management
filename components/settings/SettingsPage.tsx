"use client";

import { useState, useEffect } from 'react'
import { User, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [password, setPassword] = useState('')
  
  const [isSaved, setIsSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = localStorage.getItem('nexus_user')
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      setName(parsed.name)
      setRole(parsed.role)
    }
  }, [])

  const handleSave = async () => {
    setError('')
    setIsSaved(false)

    if (password && password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    try {
      const res = await fetch('/api/members/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          name,
          role,
          password: password || undefined, // Only send if typed
        })
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to save')
      }

      const updatedUser = await res.json()
      
      // Update local storage so the rest of the app sees the new name
      localStorage.setItem('nexus_user', JSON.stringify(updatedUser))
      setUser(updatedUser)
      
      setIsSaved(true)
      setPassword('') // Clear password field
      setTimeout(() => setIsSaved(false), 2000)
      
      // Refresh the page to update the layout sidebar if name changed
      router.refresh()
      window.location.reload()

    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!user) return <div className="p-8 text-zinc-500">Loading settings...</div>

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h1>
        <p className="text-sm text-zinc-500 mt-1">Manage your account details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Sidebar */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium bg-zinc-100 text-[#2a2f7a] rounded-md">
            <User size={16} /> Profile
          </button>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-2 space-y-6">
          
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">{error}</div>}

          {/* Profile Section */}
          <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold text-zinc-900">Profile Information</h2>
              <p className="text-sm text-zinc-500">Update your account details.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-xl bg-[#2a2f7a] text-white flex items-center justify-center text-2xl font-bold shadow-sm">
                  {name.charAt(0) || '?'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700 mb-1">Job Role</label>
                  <input type="text" value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]" />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-100 mt-4">
                <label className="block text-sm font-medium text-zinc-700 mb-1">Change Password</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Leave blank to keep current password"
                  className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]" 
                />
                <p className="text-xs text-zinc-500 mt-1">Must be at least 8 characters long.</p>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button 
              onClick={handleSave}
              className="bg-[#2a2f7a] text-white font-medium px-6 py-2 rounded-md hover:bg-[#1f235c] transition-colors flex items-center gap-2"
            >
              <Save size={16} /> 
              {isSaved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}