import { useMemo, useState } from 'react'
import { ConfirmDialog } from './components/ConfirmDialog'
import { EmptyState } from './components/EmptyState'
import { Header } from './components/Header'
import { TaskFilterBar } from './components/TaskFilter'
import { TaskForm } from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { useTasks } from './hooks/useTasks'
import type { Task, TaskDraft, TaskFilter } from './types'

export default function App() {
  const { tasks, addTask, updateTask, changeStatus, deleteTask } = useTasks()
  const [filter, setFilter] = useState<TaskFilter>('all')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [taskToDelete, setTaskToDelete] = useState<Task | undefined>()

  const visibleTasks = useMemo(() => {
    if (filter === 'all') {
      return tasks
    }
    return tasks.filter((task) => task.status === filter)
  }, [filter, tasks])

  function openCreateForm() {
    setEditingTask(undefined)
    setIsFormOpen(true)
  }

  function openEditForm(task: Task) {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingTask(undefined)
  }

  function handleSubmit(draft: TaskDraft) {
    if (editingTask) {
      updateTask(editingTask.id, draft)
    } else {
      addTask(draft)
    }
    closeForm()
  }

  return (
    <div className="app">
      <Header onAdd={openCreateForm} />
      <TaskFilterBar value={filter} onChange={setFilter} />

      {visibleTasks.length === 0 ? (
        <EmptyState hasTasks={tasks.length > 0} onAdd={openCreateForm} />
      ) : (
        <TaskList
          tasks={visibleTasks}
          onEdit={openEditForm}
          onDelete={setTaskToDelete}
          onStatusChange={changeStatus}
        />
      )}

      {isFormOpen ? (
        <TaskForm task={editingTask} onSubmit={handleSubmit} onCancel={closeForm} />
      ) : null}

      {taskToDelete ? (
        <ConfirmDialog
          title="Удалить задачу?"
          message={`Задача «${taskToDelete.title}» будет удалена без возможности восстановления.`}
          onCancel={() => setTaskToDelete(undefined)}
          onConfirm={() => {
            deleteTask(taskToDelete.id)
            setTaskToDelete(undefined)
          }}
        />
      ) : null}
    </div>
  )
}
