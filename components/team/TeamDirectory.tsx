"use client";

import { useState } from 'react'
import { useStore } from '../../app/store'
import { CheckCircle2, Plus, Trash2, Activity, Edit } from 'lucide-react'
import MemberModal from '../ui/MemberModal'
import EditMemberModal from '../ui/EditMemberModal'
import { Member } from '../../types'

export default function TeamDirectory() {
  const { members, tasks, setMembers, setTasks } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null)

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName}?`)) return;
    
    try {
      const res = await fetch(`/api/members?id=${memberId}`, { method: 'DELETE' })
      
      if (!res.ok) throw new Error("Database rejected the delete")
      
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
      setTasks((prevTasks) => 
        prevTasks.map((task) => {
          if (task.assigneeId === memberId) {
            return { ...task, assigneeId: undefined } 
          }
          return task
        })
      )
    } catch (error) {
      console.error(error)
      alert("Failed to delete member from database.")
    }
  }

  const openEditModal = (member: Member) => {
    setMemberToEdit(member)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Team Directory</h1>
          <p className="text-sm text-zinc-500 mt-1">View all members of the Nexus engineering team.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2a2f7a] text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-[#1f235c] transition-colors flex items-center gap-2"
        >
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const memberTasks = tasks.filter((t) => t.assigneeId === member.id)
          const completedTasks = memberTasks.filter((t) => t.status === 'done').length
          const activeTasks = memberTasks.filter((t) => t.status !== 'done').length
          const workloadPercentage = Math.min((activeTasks / 5) * 100, 100)

          return (
            <div key={member.id} className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden flex flex-col relative group">
              
              <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openEditModal(member)}
                  className="text-zinc-300 hover:text-[#2a2f7a] transition-colors"
                  title="Edit Member"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDeleteMember(member.id, member.name)}
                  className="text-zinc-300 hover:text-red-500 transition-colors"
                  title="Remove Member"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-6 border-b border-zinc-100 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full ${member.avatarColor} text-white flex items-center justify-center text-lg font-bold shadow-sm`}>
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900">{member.name}</h3>
                  <p className="text-sm text-zinc-500">{member.role}</p>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>{completedTasks} tasks completed</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Activity size={16} className="text-[#2a2f7a]" />
                  <span>{activeTasks} active tasks</span>
                </div>
              </div>
              
              <div className="bg-zinc-50 p-4 border-t border-zinc-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Workload</span>
                  <span className={`text-xs font-bold ${activeTasks > 3 ? 'text-red-600' : 'text-zinc-900'}`}>
                    {activeTasks > 3 ? 'High' : 'Normal'}
                  </span>
                </div>
                <div className="w-full bg-zinc-200 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${activeTasks > 3 ? 'bg-red-500' : 'bg-[#2a2f7a]'}`}
                    style={{ width: `${workloadPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <MemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <EditMemberModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} member={memberToEdit} />
    </div>
  )
}