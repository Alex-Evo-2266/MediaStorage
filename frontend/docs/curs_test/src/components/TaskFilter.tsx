import { FILTER_LABELS, type TaskFilter } from '../types'

const FILTERS: TaskFilter[] = ['all', 'new', 'in_progress', 'done']

interface TaskFilterProps {
  value: TaskFilter
  onChange: (filter: TaskFilter) => void
}

export function TaskFilterBar({ value, onChange }: TaskFilterProps) {
  return (
    <div className="filters" role="tablist" aria-label="Фильтр задач">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          role="tab"
          aria-selected={value === filter}
          className={value === filter ? 'chip chip--active' : 'chip'}
          onClick={() => onChange(filter)}
        >
          {FILTER_LABELS[filter]}
        </button>
      ))}
    </div>
  )
}
