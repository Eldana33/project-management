"use client";

import { useState } from 'react'
import { useStore } from '../../app/store'
import { TaskStatus } from '../../types'
import { X } from 'lucide-react'

interface TaskModalProps {
  isOpen: boolean
  onClose: () => void
  defaultStatus: TaskStatus
}

export default function TaskModal({ isOpen, onClose, defaultStatus }: TaskModalProps) {
  const { members, milestones, setTasks } = useStore()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('') 
  const [milestoneId, setMilestoneId] = useState(milestones[0]?.id || '')
  const [priority, setPriority] = useState<'low' | 'med' | 'high'>('med')
  const [dueDate, setDueDate] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const newTaskData = {
      title,
      description,
      assigneeId: assigneeId || null,
      milestoneId: milestoneId || null,
      status: defaultStatus,
      priority,
      dueDate: dueDate || '2026-12-31',
    }

    try {
      // 1. Send to Database
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTaskData)
      })
      
      if (!res.ok) throw new Error("Failed to save task")
      
      const savedTask = await res.json()

      // 2. Update UI with the real task from the DB (which has the real UUID)
      setTasks((prev) => [...prev, savedTask])
      
      // Reset form & close
      setTitle('')
      setDescription('')
      onClose()
    } catch (error) {
      console.error(error)
      alert("Failed to save task to database.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="flex justify-between items-center p-5 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Create New Task</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Task Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              placeholder="e.g., Fix login bug"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a] resize-none h-20"
              placeholder="Add some details..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Assignee</label>
              <select 
                value={assigneeId} 
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              >
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Priority</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              >
                <option value="low">Low</option>
                <option value="med">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Milestone</label>
              <select 
                value={milestoneId} 
                onChange={(e) => setMilestoneId(e.target.value)}
                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              >
                {milestones.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Due Date</label>
              <input 
                type="date" 
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              className="w-full bg-[#2a2f7a] text-white font-medium py-2 rounded-md hover:bg-[#1f235c] transition-colors"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}