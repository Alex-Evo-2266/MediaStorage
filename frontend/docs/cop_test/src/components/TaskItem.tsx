import type { Task, TaskStatus } from '../types'

type TaskItemProps = {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: TaskStatus) => void
}

const statusLabelMap: Record<TaskStatus, string> = {
  new: 'Новая',
  'in-progress': 'В работе',
  done: 'Выполнена',
}

const statusClassMap: Record<TaskStatus, string> = {
  new: 'status-new',
  'in-progress': 'status-progress',
  done: 'status-done',
}

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  return (
    <article className="task-card">
      <div className="task-header">
        <div>
          <h3>{task.title}</h3>
          <p className="task-date">Создано: {formatDate(task.createdAt)}</p>
        </div>

        <span className={`task-status ${statusClassMap[task.status]}`}>
          {statusLabelMap[task.status]}
        </span>
      </div>

      {task.description ? <p className="task-description">{task.description}</p> : null}

      <div className="task-controls">
        <label className="status-select-wrap">
          <span>Статус</span>
          <select
            value={task.status}
            onChange={(event) => onStatusChange(task.id, event.target.value as TaskStatus)}
            aria-label={`Изменить статус задачи ${task.title}`}
          >
            <option value="new">Новая</option>
            <option value="in-progress">В работе</option>
            <option value="done">Выполнена</option>
          </select>
        </label>

        <div className="task-actions">
          <button type="button" className="secondary-button" onClick={() => onEdit(task)}>
            Редактировать
          </button>
          <button type="button" className="danger-button" onClick={() => onDelete(task.id)}>
            Удалить
          </button>
        </div>
      </div>
    </article>
  )
}
