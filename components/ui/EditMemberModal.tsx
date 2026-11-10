"use client";

import { useState, useEffect } from 'react'
import { useStore } from '../../app/store'
import { Member } from '../../types'
import { X } from 'lucide-react'

interface EditMemberModalProps {
  isOpen: boolean
  onClose: () => void
  member: Member | null
}

export default function EditMemberModal({ isOpen, onClose, member }: EditMemberModalProps) {
  const { setMembers } = useStore()
  
  const [name, setName] = useState('')
  const [role, setRole] = useState('')

  useEffect(() => {
    if (member) {
      setName(member.name)
      setRole(member.role)
    }
  }, [member])

  if (!isOpen || !member) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    try {
      const res = await fetch(`/api/members?id=${member.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role })
      })
      
      if (!res.ok) throw new Error("Failed to update member")
      
      const savedMember = await res.json()
      setMembers((prev) => prev.map(m => m.id === member.id ? savedMember : m))
      onClose()
    } catch (error) {
      console.error(error)
      alert("Failed to update member.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        
        <div className="flex justify-between items-center p-5 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Edit Team Member</h2>
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
              <option value="Project Manager">Project Manager</option>
              <option value="Intern">Intern</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-[#2a2f7a] text-white font-medium py-2 rounded-md hover:bg-[#1f235c] transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}