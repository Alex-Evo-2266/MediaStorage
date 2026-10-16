import { useState, type FormEvent } from 'react'
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskDraft } from '../types'

interface TaskFormProps {
  task?: Task
  onSubmit: (draft: TaskDraft) => void
  onCancel: () => void
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [status, setStatus] = useState(task?.status ?? 'new')
  const [error, setError] = useState('')

  const isEditing = Boolean(task)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!title.trim()) {
      setError('Укажите название задачи. Без названия сохранить нельзя.')
      return
    }

    onSubmit({
      title,
      description,
      status,
    })
  }

  return (
    <div className="overlay" role="presentation" onClick={onCancel}>
      <form
        className="dialog dialog--form"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
        noValidate
      >
        <h2>{isEditing ? 'Редактирование задачи' : 'Новая задача'}</h2>

        <label className="field">
          <span>Название</span>
          <input
            type="text"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error) {
                setError('')
              }
            }}
            placeholder="Например, подготовить отчёт"
            autoFocus
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'title-error' : undefined}
          />
        </label>

        {error ? (
          <p id="title-error" className="field-error" role="alert">
            {error}
          </p>
        ) : null}

        <label className="field">
          <span>Описание</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Необязательные детали"
            rows={4}
          />
        </label>

        <label className="field">
          <span>Статус</span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as TaskDraft['status'])
            }
          >
            {TASK_STATUSES.map((value) => (
              <option key={value} value={value}>
                {STATUS_LABELS[value]}
              </option>
            ))}
          </select>
        </label>

        <div className="dialog__actions">
          <button type="button" className="button button--ghost" onClick={onCancel}>
            Отмена
          </button>
          <button type="submit" className="button button--primary">
            {isEditing ? 'Сохранить' : 'Добавить'}
          </button>
        </div>
      </form>
    </div>
  )
}
