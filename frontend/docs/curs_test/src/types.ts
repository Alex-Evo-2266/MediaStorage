export type TaskStatus = 'new' | 'in_progress' | 'done'
export type TaskFilter = 'all' | TaskStatus

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  createdAt: string
}

export interface TaskDraft {
  title: string
  description: string
  status: TaskStatus
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
}

export const FILTER_LABELS: Record<TaskFilter, string> = {
  all: 'Все',
  new: 'Новые',
  in_progress: 'В работе',
  done: 'Выполненные',
}

export const TASK_STATUSES: TaskStatus[] = ['new', 'in_progress', 'done']
