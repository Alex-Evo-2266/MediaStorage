import type { Task, TaskStatusFilter } from '../types'
import TaskItem from './TaskItem'

type TaskListProps = {
  tasks: Task[]
  activeFilter: TaskStatusFilter
  onFilterChange: (filter: TaskStatusFilter) => void
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onStatusChange: (taskId: string, status: Task['status']) => void
  onAddFirstTask: () => void
}

const filterOptions: Array<{ value: TaskStatusFilter; label: string }> = [
  { value: 'all', label: 'Все' },
  { value: 'new', label: 'Новые' },
  { value: 'in-progress', label: 'В работе' },
  { value: 'done', label: 'Выполненные' },
]

export default function TaskList({
  tasks,
  activeFilter,
  onFilterChange,
  onEdit,
  onDelete,
  onStatusChange,
  onAddFirstTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <section className="empty-state">
        <h2>Список задач пуст</h2>
        <p>Добавьте первую задачу, чтобы начать планирование.</p>
        <button type="button" className="primary-button" onClick={onAddFirstTask}>
          Добавить первую задачу
        </button>
      </section>
    )
  }

  return (
    <section className="task-list-section">
      <div className="toolbar">
        <div>
          <h2>Задачи</h2>
        </div>

        <div className="filter-group" aria-label="Фильтр задач">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={activeFilter === option.value ? 'filter-button active' : 'filter-button'}
              onClick={() => onFilterChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </section>
  )
}
