import { useMemo, useState } from 'react'
import type { MediaItem } from '../../types/media'

export type MediaFilter = 'all' | 'recent' | 'favorite' | 'image' | 'video' | 'audio'

export function useLibraryFilters(items: MediaItem[]) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<MediaFilter>('all')

  const filteredItems = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    let nextItems = [...items]

    if (filter !== 'all') {
      if (filter === 'image' || filter === 'video' || filter === 'audio') {
        nextItems = nextItems.filter((item) => item.type === filter)
      }
    }

    if (normalized) {
      nextItems = nextItems.filter((item) => item.title.toLowerCase().includes(normalized))
    }

    return nextItems
  }, [filter, items, query])

  return {
    query,
    setQuery,
    filter,
    setFilter,
    filteredItems,
  }
}
