export type MediaType = 'image' | 'video' | 'audio'

export interface MediaItem {
  id: string
  title: string
  type: MediaType
  size: number
  createdAt: string
  previewUrl: string
  duration?: string
  tags: string[]
}

export interface MediaCollection {
  id: string
  name: string
  description: string
  mediaIds: string[]
}

export type AppView = 'library' | 'collections' | 'upload'
