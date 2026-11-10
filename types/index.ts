export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'med' | 'high'

export interface Member {
  id: string
  name: string
  role: string
  avatarColor: string
}

export interface Milestone {
  id: string
  title: string
  dueDate: string
}

export interface Task {
  id: string
  title: string
  description: string
  assigneeId: string
  milestoneId: string
  status: TaskStatus
  priority: Priority
  dueDate: string
}