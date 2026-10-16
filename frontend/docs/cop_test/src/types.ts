export type TaskStatus = 'new' | 'in-progress' | 'done'
export type TaskStatusFilter = 'all' | TaskStatus

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  createdAt: string
}

export interface TaskFormValues {
  title: string
  description: string
  status: TaskStatus
}
