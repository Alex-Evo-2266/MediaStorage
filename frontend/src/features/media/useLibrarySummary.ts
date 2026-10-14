import { useEffect, useState } from 'react'
import { mediaApi } from '../../entities/media/api/mediaApi'

export function useLibrarySummary() {
  const [summary, setSummary] = useState<{ totalFiles: number; updatedAt: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const librarySummary = await mediaApi.getLibrarySummary()
        if (isMounted) {
          setSummary(librarySummary)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Не удалось загрузить сводку библиотеки')
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
