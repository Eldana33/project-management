"use client";

import { useState, useEffect } from 'react'
import { useStore } from '../../app/store'
import { Task } from '../../types'
import { X } from 'lucide-react'

interface EditTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: Task | null
}

export default function EditTaskModal({ isOpen, onClose, task }: EditTaskModalProps) {
  const { members, milestones, setTasks } = useStore()
  
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [milestoneId, setMilestoneId] = useState('')
  const [priority, setPriority] = useState<'low' | 'med' | 'high'>('med')
  const [dueDate, setDueDate] = useState('')

  // When the task prop changes, load its data into the form
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setAssigneeId(task.assigneeId || '')
      setMilestoneId(task.milestoneId || '')
      setPriority(task.priority)
      setDueDate(task.dueDate)
    }
  }, [task])

  if (!isOpen || !task) return null

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const updatedData = {
      title: title.trim(),
      description: description.trim() || null,
      assigneeId: assigneeId || null,
      milestoneId: milestoneId || null,
      priority,
      status: task.status, // <--- Send the current status
      dueDate: dueDate || '2026-12-31',
    }

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })
      
      if (!res.ok) {
        const errData = await res.json();
        console.error("Backend error:", errData);
        throw new Error(errData.error || "Failed to update");
      }
      
      const savedTask = await res.json()
      setTasks((prev) => prev.map(t => t.id === task.id ? savedTask : t))
      onClose()
    } catch (error) {
      console.error(error)
      alert("Failed to update task. Check the terminal for details.")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        
        <div className="flex justify-between items-center p-5 border-b border-zinc-100">
          <h2 className="text-lg font-bold text-zinc-900">Edit Task</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Task Title</label>
            <input 
              type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
            <textarea 
              value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a] resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Assignee</label>
              <select 
                value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              >
                <option value="">Unassigned</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Priority</label>
              <select 
                value={priority} onChange={(e) => setPriority(e.target.value as any)}
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
                value={milestoneId} onChange={(e) => setMilestoneId(e.target.value)}
                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              >
                {milestones.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Due Date</label>
              <input 
                type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-zinc-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2a2f7a]"
              />
            </div>
          </div>

          <div className="pt-2">
            <button type="submit" className="w-full bg-[#2a2f7a] text-white font-medium py-2 rounded-md hover:bg-[#1f235c] transition-colors">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}