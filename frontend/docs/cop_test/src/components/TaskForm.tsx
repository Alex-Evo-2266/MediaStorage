import type { ChangeEvent, FormEvent } from 'react'

import type { TaskFormValues, TaskStatus } from '../types'

type TaskFormProps = {
  values: TaskFormValues
  error: string
  isOpen: boolean
  submitLabel: string
  onChange: <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}

const statusOptions: Array<{ value: TaskStatus; label: string }> = [
  { value: 'new', label: 'Новая' },
  { value: 'in-progress', label: 'В работе' },
  { value: 'done', label: 'Выполнена' },
]

export default function TaskForm({
  values,
  error,
  isOpen,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: TaskFormProps) {
  if (!isOpen) {
    return null
  }

  const handleTextChange =
    (field: 'title' | 'description') => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(field, event.target.value)
    }

  return (
    <section className="task-form-panel">
      <div className="panel-header">
        <h2>Форма задачи</h2>
      </div>

      <form className="task-form" onSubmit={onSubmit}>
        <label className="field">
          <span>Название</span>
          <input
            type="text"
            value={values.title}
            onChange={handleTextChange('title')}
            placeholder="Например: Купить продукты"
            aria-label="Название задачи"
          />
        </label>

        <label className="field">
          <span>Описание</span>
          <textarea
            value={values.description}
            onChange={handleTextChange('description')}
            placeholder="Добавьте подробности по задаче"
            rows={4}
            aria-label="Описание задачи"
          />
        </label>

        <label className="field">
          <span>Статус</span>
          <select
            value={values.status}
            onChange={(event) => onChange('status', event.target.value as TaskStatus)}
            aria-label="Статус задачи"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="form-actions">
          <button type="submit" className="primary-button">
            {submitLabel}
          </button>
          <button type="button" className="secondary-button" onClick={onCancel}>
            Отмена
          </button>
        </div>
      </form>
    </section>
  )
}
