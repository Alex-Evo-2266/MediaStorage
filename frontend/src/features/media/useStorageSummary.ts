import { useEffect, useState } from 'react'
import { mediaApi } from '../../entities/media/api/mediaApi'
import type { StorageSummary } from '../../types/media'

export function useStorageSummary() {
  const [summary, setSummary] = useState<StorageSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const storageSummary = await mediaApi.getStorageSummary()
        if (isMounted) {
          setSummary(storageSummary)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить сведения о хранилище')
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
    summary,
    loading,
    error,
  }
}
