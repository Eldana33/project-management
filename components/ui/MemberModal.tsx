"use client";

import { useState } from 'react'
import { useStore } from '../../app/store'
import { X } from 'lucide-react'

interface MemberModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MemberModal({ isOpen, onClose }: MemberModalProps) {
  const { setMembers } = useStore()
  
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Frontend')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !username.trim() || password.length < 8) {
      alert("Please fill all fields. Password must be at least 8 characters.")
      return
    }

    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-teal-500']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newMemberData = {
      name: name.trim(),
      username: username.trim().toLowerCase(),
      password,
      role,
      avatarColor: randomColor,
    }

    try {
      // Use the signup API we built earlier!
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMemberData)
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || "Failed to save member")
      }

      const savedMember = await res.json()
      setMembers((prev) => [...prev, savedMember])
      
      setName('')
      setUsername('')
      setPassword('')
      onClose()
    } catch (error: any) {
      console.error(error)
      alert(`Database Error: ${error.message}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        
        <div className="flex justify-between items-center p-5 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Add Team Member</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
            <input 
              type="text" required value={name} onChange={(e) => setName(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              placeholder="e.g., Alem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Username</label>
            <input 
              type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              placeholder="e.g., alem"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Password</label>
            <input 
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Role</label>
            <select 
              value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
            >
              <option value="Frontend">Frontend Developer</option>
              <option value="Backend">Backend Developer</option>
              <option value="Design">Designer</option>
              <option value="QA">QA Tester</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-[#2a2f7a] text-white font-medium py-2 rounded-md hover:bg-[#1f235c] transition-colors">
            Add Member
          </button>
        </form>
      </div>
    </div>
  )
}