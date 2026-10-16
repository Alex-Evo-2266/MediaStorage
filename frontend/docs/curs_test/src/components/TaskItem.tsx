import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskStatus } from '../types'

interface TaskItemProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
  onStatusChange: (id: string, status: TaskStatus) => void
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function TaskItem({ task, onEdit, onDelete, onStatusChange }: TaskItemProps) {
  return (
    <article className="task-card">
      <div className="task-card__top">
        <span className={`badge badge--${task.status}`}>{STATUS_LABELS[task.status]}</span>
        <time className="task-card__date" dateTime={task.createdAt}>
          {formatDate(task.createdAt)}
        </time>
      </div>

      <h3 className="task-card__title">{task.title}</h3>
      {task.description ? <p className="task-card__description">{task.description}</p> : null}

      <div className="task-card__footer">
        <label className="status-select">
          <span className="visually-hidden">Статус задачи</span>
          <select
            value={task.status}
            onChange={(event) =>
              onStatusChange(task.id, event.target.value as TaskStatus)
            }
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </label>

        <div className="task-card__actions">
          <button type="button" className="button button--ghost" onClick={() => onEdit(task)}>
            Изменить
          </button>
          <button
            type="button"
            className="button button--danger-ghost"
            onClick={() => onDelete(task)}
          >
            Удалить
          </button>
        </div>
      </div>
    </article>
  )
}
