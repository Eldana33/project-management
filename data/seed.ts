import type { Member, Milestone, Task } from '../types'

export const members: Member[] = [
  { id: 'm1', name: 'Sara Bekele',  role: 'Frontend',  avatarColor: 'bg-blue-500' },
  { id: 'm2', name: 'Dawit Tesfaye', role: 'Backend',   avatarColor: 'bg-green-500' },
  { id: 'm3', name: 'Liya Haile',   role: 'Design',    avatarColor: 'bg-purple-500' },
  { id: 'm4', name: 'Yonas Girma',  role: 'QA',        avatarColor: 'bg-orange-500' },
]

export const milestones: Milestone[] = [
  { id: 'ms1', title: 'Auth & Login',       dueDate: '2026-11-20' },
  { id: 'ms2', title: 'Dashboard v1',       dueDate: '2026-12-05' },
  { id: 'ms3', title: 'Task Board',         dueDate: '2026-12-18' },
]

export const tasks: Task[] = [
  { id: 't1',  title: 'Design login screen',         description: 'Figma mockups for login + signup.',   assigneeId: 'm3', milestoneId: 'ms1', status: 'done',        priority: 'high', dueDate: '2026-11-12' },
  { id: 't2',  title: 'Build auth API',              description: 'JWT login and refresh tokens.',       assigneeId: 'm2', milestoneId: 'ms1', status: 'done',        priority: 'high', dueDate: '2026-11-15' },
  { id: 't3',  title: 'Wire login form',             description: 'Connect form to auth API.',           assigneeId: 'm1', milestoneId: 'ms1', status: 'in_progress', priority: 'high', dueDate: '2026-11-18' },
  { id: 't4',  title: 'KPI card components',         description: 'Reusable stat cards for dashboard.',  assigneeId: 'm1', milestoneId: 'ms2', status: 'in_progress', priority: 'med',  dueDate: '2026-11-28' },
  { id: 't5',  title: 'Team workload widget',        description: 'Per-member task counts.',             assigneeId: 'm1', milestoneId: 'ms2', status: 'todo',        priority: 'med',  dueDate: '2026-12-01' },
  { id: 't6',  title: 'Charts for task status',      description: 'Pie + bar chart of statuses.',        assigneeId: 'm2', milestoneId: 'ms2', status: 'todo',        priority: 'low',  dueDate: '2026-12-03' },
  { id: 't7',  title: 'Kanban drag-drop prototype',  description: 'dnd-kit proof of concept.',           assigneeId: 'm1', milestoneId: 'ms3', status: 'in_progress', priority: 'high', dueDate: '2026-12-10' },
  { id: 't8',  title: 'Task detail slide-over',      description: 'Panel to edit a task.',               assigneeId: 'm4', milestoneId: 'ms3', status: 'todo',        priority: 'med',  dueDate: '2026-12-14' },
  { id: 't9',  title: 'QA pass on dashboard',        description: 'Cross-browser + responsive check.',   assigneeId: 'm4', milestoneId: 'ms2', status: 'todo',        priority: 'low',  dueDate: '2026-12-06' },
  { id: 't10', title: 'Empty-state illustrations',   description: 'For lists with no data.',             assigneeId: 'm3', milestoneId: 'ms3', status: 'done',        priority: 'low',  dueDate: '2026-12-08' },
]