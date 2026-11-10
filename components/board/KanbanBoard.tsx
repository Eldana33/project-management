"use client";

import { useState } from 'react'
import { useStore } from '../../app/store'
import { Task, TaskStatus } from '../../types'
import TaskCard from './TaskCard'
import TaskModal from '../ui/TaskModal'
import EditTaskModal from '../ui/EditTaskModal'
import { Plus } from 'lucide-react'
import {
  DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor,
  useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const columns: { id: TaskStatus; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'done', label: 'Done' },
]

function SortableTaskCard({ task, member, onEdit, onDelete }: { task: Task, member: any, onEdit: any, onDelete: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ 
    id: task.id, data: { type: 'Task', task }
  })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }
  return (
    <div ref={setNodeRef} style={style}>
      <div {...attributes} {...listeners}>
        <TaskCard task={task} member={member} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </div>
  )
}

function BoardColumn({ col, tasks, members, onAddTask, onEditTask, onDeleteTask }: any) {
  const { setNodeRef } = useSortable({ id: col.id, data: { type: 'Column', col } })
  return (
    <div ref={setNodeRef} className="bg-zinc-100/50 rounded-xl p-3 flex flex-col gap-3 h-full border border-zinc-200/60 min-h-[500px]">
      <div className="flex justify-between items-center px-1 mb-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-zinc-700 text-sm">{col.label}</h3>
          <span className="bg-zinc-200 text-zinc-600 text-xs font-bold px-2 py-0.5 rounded-full">{tasks.length}</span>
        </div>
        <button onClick={() => onAddTask(col.id)} className="text-zinc-400 hover:text-zinc-700 bg-zinc-200/50 hover:bg-zinc-200 p-1 rounded-md transition-colors">
          <Plus size={16} />
        </button>
      </div>
      <SortableContext items={tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 flex-1">
          {tasks.map((task: any) => {
            const assignee = members.find((m: any) => m.id === task.assigneeId)
            return <SortableTaskCard key={task.id} task={task} member={assignee} onEdit={onEditTask} onDelete={onDeleteTask} />
          })}
          {tasks.length === 0 && (
            <div className="text-center p-6 border-2 border-dashed border-zinc-200 rounded-lg text-zinc-400 text-sm flex-1 flex items-center justify-center">
              Drop tasks here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default function KanbanBoard() {
  const { tasks, setTasks, members } = useStore()
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStatus, setModalStatus] = useState<TaskStatus>('todo')

  // State for Edit Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  const openAddModal = (status: TaskStatus) => {
    setModalStatus(status)
    setIsModalOpen(true)
  }

  const openEditModal = (task: Task) => {
    setTaskToEdit(task)
    setIsEditModalOpen(true)
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm("Delete this task?")) return;
    setTasks((prev) => prev.filter(t => t.id !== taskId))
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return
    const activeId = active.id
    const overId = over.id
    if (activeId === overId) return
    const isActiveTask = active.data.current?.type === 'Task'
    const isOverTask = over.data.current?.type === 'Task'

    if (!isActiveTask) return

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const overIndex = tasks.findIndex((t) => t.id === overId)
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newStatus = tasks[overIndex].status
          const updatedTasks = [...tasks]
          updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], status: newStatus }
          return arrayMove(updatedTasks, activeIndex, overIndex)
        }
        return arrayMove(tasks, activeIndex, overIndex)
      })
    }

    const isOverColumn = over.data.current?.type === 'Column'
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId)
        const updatedTasks = [...tasks]
        updatedTasks[activeIndex] = { ...updatedTasks[activeIndex], status: overId as TaskStatus }
        return updatedTasks
      })
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return
    const activeId = active.id
    const overId = over.id
    if (activeId === overId) return
    
    let finalTask: Task | undefined

    setTasks((tasks) => {
      const activeIndex = tasks.findIndex((t) => t.id === activeId)
      const overIndex = tasks.findIndex((t) => t.id === overId)
      
      let updatedTasks = tasks
      if (tasks[activeIndex].status === tasks[overIndex]?.status) {
        updatedTasks = arrayMove(tasks, activeIndex, overIndex)
      }
      finalTask = updatedTasks[activeIndex]
      return updatedTasks
    })

    if (finalTask && finalTask.status !== event.active.data.current?.task.status) {
       await fetch(`/api/tasks/${finalTask.id}`, {
         method: 'PATCH',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ status: finalTask.status })
       })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Task Board</h1>
        <p className="text-sm text-zinc-500 mt-1">Drag and drop tasks to update their status.</p>
      </div>
      
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.id)
            return <BoardColumn key={col.id} col={col} tasks={columnTasks} members={members} onAddTask={openAddModal} onEditTask={openEditModal} onDeleteTask={handleDeleteTask} />
          })}
        </div>
        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} member={members.find((m) => m.id === activeTask.assigneeId)} /> : null}
        </DragOverlay>
      </DndContext>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} defaultStatus={modalStatus} />
      <EditTaskModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} task={taskToEdit} />
    </div>
  )
}