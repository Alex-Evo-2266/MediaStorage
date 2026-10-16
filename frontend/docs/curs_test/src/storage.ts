import type { Task } from './types'

const STORAGE_KEY = 'task-list'

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter(isTask)
  } catch {
    return []
  }
}

export function saveTasks(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
}

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const task = value as Partial<Task>
  return (
    typeof task.id === 'string' &&
    typeof task.title === 'string' &&
    typeof task.description === 'string' &&
    typeof task.createdAt === 'string' &&
    (task.status === 'new' ||
      task.status === 'in_progress' ||
      task.status === 'done')
  )
}
