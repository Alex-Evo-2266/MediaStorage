import { useEffect, useMemo, useState } from 'react'

import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import type { Task, TaskFormValues, TaskStatus, TaskStatusFilter } from './types'
import './App.css'

const STORAGE_KEY = 'task-manager-items'

const createEmptyForm = (): TaskFormValues => ({
  title: '',
  description: '',
  status: 'new',
})

const defaultTasks: Task[] = [
  {
    id: 'sample-1',
    title: 'Подготовить план на день',
    description: 'Составить список приоритетов и распределить задачи по времени.',
    status: 'in-progress',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Проверить почту',
    description: 'Ответить на важные письма и удалить лишние уведомления.',
    status: 'new',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem(STORAGE_KEY)

    if (!savedTasks) {
      return defaultTasks
    }

    try {
      const parsed = JSON.parse(savedTasks) as Task[]
      return parsed.length > 0 ? parsed : []
    } catch {
      return defaultTasks
    }
  })

  const [filter, setFilter] = useState<TaskStatusFilter>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formValues, setFormValues] = useState<TaskFormValues>(createEmptyForm())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const filteredTasks = useMemo(() => {
    if (filter === 'all') {
      return tasks
    }

    return tasks.filter((task) => task.status === filter)
  }, [filter, tasks])

  const openCreateForm = () => {
    setEditingId(null)
    setFormValues(createEmptyForm())
    setSubmitError('')
    setIsFormOpen(true)
  }

  const openEditForm = (task: Task) => {
    setEditingId(task.id)
    setFormValues({
      title: task.title,
      description: task.description,
      status: task.status,
    })
    setSubmitError('')
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setSubmitError('')
    setFormValues(createEmptyForm())
  }

  const handleFieldChange = <K extends keyof TaskFormValues>(field: K, value: TaskFormValues[K]) => {
    setFormValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedTitle = formValues.title.trim()

    if (!trimmedTitle) {
      setSubmitError('Название задачи не может быть пустым. Укажите корректное название.')
      return
    }

    if (editingId) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingId
            ? { ...task, title: trimmedTitle, description: formValues.description.trim(), status: formValues.status }
            : task,
        ),
      )
    } else {
      const nextTask: Task = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        description: formValues.description.trim(),
        status: formValues.status,
        createdAt: new Date().toISOString(),
      }

      setTasks((current) => [nextTask, ...current])
    }

    closeForm()
  }

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId)

    if (!taskToDelete) {
      return
    }

    const isConfirmed = window.confirm(`Удалить задачу «${taskToDelete.title}»?`)

    if (!isConfirmed) {
      return
    }

    setTasks((current) => current.filter((task) => task.id !== taskId))
  }

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    setTasks((current) =>
      current.map((task) => (task.id === taskId ? { ...task, status } : task)),
    )
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Менеджер задач</p>
          <h1>Список задач</h1>
        </div>

        <button type="button" className="primary-button" onClick={openCreateForm}>
          + Добавить задачу
        </button>
      </header>

      <TaskForm
        values={formValues}
        error={submitError}
        isOpen={isFormOpen}
        submitLabel={editingId ? 'Сохранить изменения' : 'Добавить задачу'}
        onChange={handleFieldChange}
        onSubmit={handleSubmit}
        onCancel={closeForm}
      />

      <TaskList
        tasks={filteredTasks}
        activeFilter={filter}
        onFilterChange={setFilter}
        onEdit={openEditForm}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
        onAddFirstTask={openCreateForm}
      />
    </main>
  )
}

export default App
