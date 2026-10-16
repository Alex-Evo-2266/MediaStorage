import { useCallback, useEffect, useState } from 'react'
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
          setError(
            err instanceof Error
              ? err.message
              : 'Не удалось загрузить коллекции',
          )
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

  const createCollection = useCallback(
    async (
      name: string,
      description = '',
    ): Promise<MediaCollection | null> => {
      try {
        setError(null)

        const nextCollection = await mediaApi.createCollection({
          name,
          description,
        })

        setItems((current) => [...current, nextCollection])

        return nextCollection
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Не удалось создать коллекцию',
        )

        return null
      }
    },
    [],
  )

  const addMediaToCollection = useCallback(
    async (
      collectionId: string,
      mediaId: string,
    ): Promise<MediaCollection | null> => {
      try {
        setError(null)

        const nextCollection = await mediaApi.addMediaToCollection(
          collectionId,
          mediaId,
        )

        setItems((current) =>
          current.map((collection) =>
            collection.id === collectionId
              ? nextCollection
              : collection,
          ),
        )

        return nextCollection
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Не удалось добавить файл в коллекцию',
        )

        return null
      }
    },
    [],
  )

  const removeMediaFromCollection = useCallback(
    async (
      collectionId: string,
      mediaId: string,
    ): Promise<MediaCollection | null> => {
      try {
        setError(null)

        const nextCollection = await mediaApi.removeMediaFromCollection(
          collectionId,
          mediaId,
        )

        setItems((current) =>
          current.map((collection) =>
            collection.id === collectionId
              ? nextCollection
              : collection,
          ),
        )

        return nextCollection
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Не удалось удалить файл из коллекции',
        )

        return null
      }
    },
    [],
  )

  const deleteCollection = useCallback(
    async (collectionId: string): Promise<boolean> => {
      try {
        setError(null)

        await mediaApi.deleteCollection(collectionId)

        setItems((current) =>
          current.filter((collection) => collection.id !== collectionId),
        )

        return true
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Не удалось удалить коллекцию',
        )

        return false
      }
    },
    [],
  )

  return {
    items,
    loading,
    error,
    createCollection,
    addMediaToCollection,
    removeMediaFromCollection,
    deleteCollection,
  }
}