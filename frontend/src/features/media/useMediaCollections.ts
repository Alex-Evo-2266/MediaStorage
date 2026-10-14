import { useEffect, useState } from 'react'
import { mediaApi } from '../../entities/media/api/mediaApi'
import type { MediaCollection } from '../../types/media'

export function useMediaCollections() {
  const [items, setItems] = useState<MediaCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const collections = await mediaApi.getCollections()
        if (isMounted) {
          setItems(collections)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить коллекции')
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

  return {
    items,
    loading,
    error,
  }
}
