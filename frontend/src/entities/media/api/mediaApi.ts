import { mockCollections, mockMedia } from '../../../data/mockMedia'
import type { MediaCollection, MediaItem, StorageSummary } from '../../../types/media'

const wait = <T,>(value: T, delay = 150): Promise<T> =>
  new Promise((resolve) => {
    window.setTimeout(() => resolve(value), delay)
  })

export const mediaApi = {
  async getMediaItems(): Promise<MediaItem[]> {
    return wait(mockMedia.map((item) => ({ ...item })))
  },

  async getCollections(): Promise<MediaCollection[]> {
    return wait(mockCollections.map((collection) => ({ ...collection, mediaIds: [...collection.mediaIds] })))
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
