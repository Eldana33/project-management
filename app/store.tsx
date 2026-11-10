"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Task, Member, Milestone } from '../types'

interface StoreContextType {
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  members: Member[]
  setMembers: React.Dispatch<React.SetStateAction<Member[]>>
  milestones: Milestone[]
  isLoading: boolean
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch real data from the database
    async function fetchData() {
      try {
        const res = await fetch('/api/data')
        const data = await res.json()
        
        setTasks(data.tasks || [])
        setMembers(data.members || [])
        setMilestones(data.milestones || [])
      } catch (error) {
        console.error("Failed to load data", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <StoreContext.Provider value={{ tasks, setTasks, members, setMembers, milestones, isLoading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}