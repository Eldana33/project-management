"use client";

import { useState } from 'react'
import { Task, Member } from '../../types'
import { Calendar, MoreHorizontal, Trash2, Edit } from 'lucide-react'

interface TaskCardProps {
  task: Task
  member?: Member
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
}

export default function TaskCard({ task, member, onEdit, onDelete }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const priorityColors = {
    high: 'bg-red-100 text-red-700 border-red-200',
    med: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-blue-100 text-blue-700 border-blue-200',
  }

  return (
    <div className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing relative group">
      
      {/* Top row: Priority & Actions */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm border ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        {/* THREE DOTS MENU */}
        <div className="relative">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
            className="text-zinc-400 hover:text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          >
            <MoreHorizontal size={16} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-6 bg-white border border-zinc-200 shadow-lg rounded-md py-1 z-50 w-32">
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit?.(task) }}
                className="w-full text-left px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-100 flex items-center gap-2"
              >
                <Edit size={12} /> Edit Task
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowMenu(false); onDelete?.(task.id) }}
                className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <Trash2 size={12} /> Delete Task
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-zinc-900 leading-snug mb-1">{task.title}</h4>
        <p className="text-xs text-zinc-500 line-clamp-2">{task.description}</p>
      </div>

      {/* Footer: Date & Assignee */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
          <Calendar size={14} />
          <span>{task.dueDate}</span>
        </div>
        
        {member ? (
          <div className={`w-6 h-6 rounded-full ${member.avatarColor} text-white flex items-center justify-center text-[10px] font-bold shadow-sm`} title={member.name}>
            {member.name.charAt(0)}
          </div>
        ) : (
          <div className="w-6 h-6 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center text-[10px] font-bold shadow-sm" title="Unassigned">
            ?
          </div>
        )}
      </div>
    </div>
  )
}