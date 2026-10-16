import { useEffect, useMemo, useState } from 'react'
import { mediaApi } from '../../entities/media/api/mediaApi'
import type { MediaItem } from '../../types/media'

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const media = await mediaApi.getMediaItems()
        if (isMounted) {
          setItems(media)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить медиафайлы')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredItems = useMemo(() => items, [items])

  const renameItem = async (mediaId: string, title: string) => {
    await mediaApi.updateMediaTitle(mediaId, title)
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === mediaId ? { ...item, title: title.trim() } : item,
      ),
    )
  }

  const deleteItem = async (mediaId: string) => {
    await mediaApi.deleteMediaItem(mediaId)
    setItems((currentItems) => currentItems.filter((item) => item.id !== mediaId))
  }

  return {
    items: filteredItems,
    loading,
    error,
    renameItem,
    deleteItem,
  }
}
