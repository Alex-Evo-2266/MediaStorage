import { mockCollections, mockMedia } from '../../../data/mockMedia'
import type { MediaCollection, MediaItem, StorageSummary } from '../../../types/media'

const wait = <T,>(value: T, delay = 150): Promise<T> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(value), delay)
  })

const cloneCollections = (collections: MediaCollection[]): MediaCollection[] =>
  collections.map((collection) => ({ ...collection, mediaIds: [...collection.mediaIds] }))

export interface CreateCollectionPayload {
  name: string
  description?: string
}

export const mediaApi = {
  async getMediaItems(): Promise<MediaItem[]> {
    return wait(mockMedia.map((item) => ({ ...item })))
  },

  async getCollections(): Promise<MediaCollection[]> {
    return wait(cloneCollections(mockCollections))
  },

  async createCollection(payload: CreateCollectionPayload): Promise<MediaCollection> {
    const trimmedName = payload.name.trim()
    const nextCollection: MediaCollection = {
      id: `c-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
      name: trimmedName || 'Новая коллекция',
      description: payload.description?.trim() || 'Подборка файлов',
      mediaIds: [],
    }

    mockCollections.push(nextCollection)
    return wait({ ...nextCollection, mediaIds: [...nextCollection.mediaIds] })
  },

  async addMediaToCollection(collectionId: string, mediaId: string): Promise<MediaCollection> {
    const target = mockCollections.find((collection) => collection.id === collectionId)

    if (!target) {
      throw new Error('Коллекция не найдена')
    }

    if (!target.mediaIds.includes(mediaId)) {
      target.mediaIds.push(mediaId)
    }

    return wait({ ...target, mediaIds: [...target.mediaIds] })
  },

  async removeMediaFromCollection(collectionId: string, mediaId: string): Promise<MediaCollection> {
    const target = mockCollections.find((collection) => collection.id === collectionId)

    if (!target) {
      throw new Error('Коллекция не найдена')
    }

    target.mediaIds = target.mediaIds.filter((id) => id !== mediaId)
    return wait({ ...target, mediaIds: [...target.mediaIds] })
  },

  async deleteCollection(collectionId: string): Promise<void> {
    const collectionIndex = mockCollections.findIndex((collection) => collection.id === collectionId)

    if (collectionIndex === -1) {
      throw new Error('Коллекция не найдена')
    }

    mockCollections.splice(collectionIndex, 1)
    return wait(undefined)
  },

  async getStorageSummary(): Promise<StorageSummary> {
    const usedGb = 320
    const totalGb = 1024

    return wait({
      usedGb,
      totalGb,
      freeGb: totalGb - usedGb,
      percentage: Math.round((usedGb / totalGb) * 100),
    })
  },

  async getLibrarySummary(): Promise<{ totalFiles: number; updatedAt: string }> {
    return wait({
      totalFiles: mockMedia.length,
      updatedAt: 'сегодня в 09:42',
    })
  },
}
