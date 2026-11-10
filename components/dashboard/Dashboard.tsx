"use client";

import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, ListTodo, AlertTriangle } from 'lucide-react'
import { useStore } from '../../app/store'

export default function Dashboard() {
  const { tasks, members, milestones } = useStore()
  const [user, setUser] = useState<{ id: string, name: string, role: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('nexus_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  // If no user loaded yet, show nothing or a loader
  if (!user) return <div className="p-8 text-zinc-500">Loading dashboard...</div>

  const isAdmin = user.role === 'Project Manager'
  
  // Filter tasks by the user's UUID (not their name!)
  const myTasks = isAdmin ? tasks : tasks.filter(t => t.assigneeId === user.id)

  const totalTasks = myTasks.length
  const inProgress = myTasks.filter((t) => t.status === 'in_progress').length
  const done = myTasks.filter((t) => t.status === 'done').length
  const todo = myTasks.filter((t) => t.status === 'todo').length

  const kpis = [
    { label: 'Total Tasks', value: totalTasks, icon: ListTodo },
    { label: 'In Progress', value: inProgress, icon: Clock },
    { label: 'Completed', value: done, icon: CheckCircle2 },
    { label: 'To Do', value: todo, icon: AlertTriangle },
  ]

  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Welcome back, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isAdmin ? "Here is the overview of the Nexus engineering team." : "Here is a snapshot of your assigned tasks."}
          </p>
        </div>
        <div className="text-sm text-zinc-500 font-medium bg-white px-3 py-1.5 rounded-md border border-zinc-200 shadow-sm">
          {dateString}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between text-zinc-500">
              <span className="text-sm font-semibold">{kpi.label}</span>
              <kpi.icon size={16} />
            </div>
            <div className="text-3xl font-bold text-zinc-900">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Only show these widgets to the Admin */}
      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="font-semibold text-zinc-900">Team Workload</h2>
              <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded">Active Tasks</span>
            </div>
            <div className="p-2">
              {members.map((member) => {
                const activeTasks = tasks.filter((t) => t.assigneeId === member.id && t.status !== 'done').length;
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 hover:bg-zinc-50 rounded-md transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${member.avatarColor} text-white flex items-center justify-center text-xs font-bold`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">{member.name}</div>
                        <div className="text-xs text-zinc-500">{member.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-zinc-700">{activeTasks}</span>
                       <span className="text-xs text-zinc-500">tasks</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm flex flex-col">
            <div className="p-5 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="font-semibold text-zinc-900">Milestone Progress</h2>
              <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2 py-1 rounded">Target Dates</span>
            </div>
            <div className="p-5 space-y-6">
              {milestones.map((milestone) => {
                const milestoneTasks = tasks.filter(t => t.milestoneId === milestone.id);
                const completed = milestoneTasks.filter(t => t.status === 'done').length;
                const total = milestoneTasks.length;
                const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
                return (
                  <div key={milestone.id}>
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <div className="text-sm font-semibold text-zinc-900">{milestone.title}</div>
                        <div className="text-xs text-zinc-500">Due {milestone.dueDate}</div>
                      </div>
                      <div className="text-sm font-bold text-zinc-900">{percentage}%</div>
                    </div>
                    <div className="w-full bg-zinc-100 rounded-full h-2">
                      <div className="bg-[#2a2f7a] h-2 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}