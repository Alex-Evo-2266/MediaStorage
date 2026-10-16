import type { Task, TaskStatus } from '../types'
import { TaskItem } from './TaskItem'

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

export function TaskList({ tasks, onEdit, onDelete, onStatusChange }: TaskListProps) {
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <li key={task.id}>
          <TaskItem
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </li>
      ))}
    </ul>
  )
}
