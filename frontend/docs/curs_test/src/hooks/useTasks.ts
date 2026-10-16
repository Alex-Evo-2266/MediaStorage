import { useCallback, useEffect, useState } from 'react'
import { loadTasks, saveTasks } from '../storage'
import type { Task, TaskDraft, TaskStatus } from '../types'

function createId(): string {
  return crypto.randomUUID()
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks())

  useEffect(() => {
    saveTasks(tasks)
  }, [tasks])

  const addTask = useCallback((draft: TaskDraft) => {
    const task: Task = {
      id: createId(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: draft.status,
      createdAt: new Date().toISOString(),
    }

    setTasks((current) => [task, ...current])
  }, [])

  const updateTask = useCallback((id: string, draft: TaskDraft) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? {
              ...task,
              title: draft.title.trim(),
              description: draft.description.trim(),
              status: draft.status,
            }
          : task,
      ),
    )
  }, [])

  const changeStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, status } : task)),
    )
  }, [])

  const deleteTask = useCallback((id: string) => {
    setTasks((current) => current.filter((task) => task.id !== id))
  }, [])

  return { tasks, addTask, updateTask, changeStatus, deleteTask }
}
