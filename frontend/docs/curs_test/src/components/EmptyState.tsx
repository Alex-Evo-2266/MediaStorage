interface EmptyStateProps {
  hasTasks: boolean
  onAdd: () => void
}

export function EmptyState({ hasTasks, onAdd }: EmptyStateProps) {
  if (!hasTasks) {
    return (
      <section className="empty" aria-live="polite">
        <h2>Пока нет задач</h2>
        <p>Добавьте первую задачу, чтобы начать работу со списком.</p>
        <button type="button" className="button button--primary" onClick={onAdd}>
          Добавить первую задачу
        </button>
      </section>
    )
  }

  return (
    <section className="empty" aria-live="polite">
      <h2>Ничего не найдено</h2>
      <p>В выбранном статусе задач нет. Попробуйте другой фильтр.</p>
    </section>
  )
}
