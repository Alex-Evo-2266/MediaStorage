import { useCallback, useEffect, useRef, useState } from 'react'
import { mediaApi } from '../../entities/media/api/mediaApi'
import type { MediaItem } from '../../types/media'

export function useMediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const requestIdRef = useRef(0)
  const isMountedRef = useRef(false)

  const refresh = useCallback(async () => {
    if (!isMountedRef.current) return

    const requestId = ++requestIdRef.current
    setLoading(true)
    setError(null)

    try {
      const media = await mediaApi.getMediaItems()
      if (requestId === requestIdRef.current) {
        setItems(media)
      }
    } catch (err) {
      if (requestId === requestIdRef.current) {
        setError(err instanceof Error ? err.message : 'Не удалось загрузить медиафайлы')
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let isActive = true
    isMountedRef.current = true
    void Promise.resolve().then(() => {
      if (isActive) return refresh()
    })

    return () => {
      isActive = false
      isMountedRef.current = false
      requestIdRef.current += 1
    }
  }, [refresh])

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
    items,
    loading,
    error,
    refresh,
    renameItem,
    deleteItem,
  }
}
