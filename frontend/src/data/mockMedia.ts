import type { MediaCollection, MediaItem } from '../types/media'

export const mockMedia: MediaItem[] = [
  {
    id: 'm1',
    title: 'Сосновый лес',
    type: 'image',
    size: 2468000,
    createdAt: '2026-10-01',
    previewUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
    tags: ['природа', 'лес'],
  },
  {
    id: 'm2',
    title: 'Закат на озере',
    type: 'image',
    size: 3890000,
    createdAt: '2026-10-02',
    previewUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    tags: ['закат', 'озеро'],
  },
  {
    id: 'm3',
    title: 'Городской ролик',
    type: 'video',
    size: 8730000,
    createdAt: '2026-10-03',
    previewUrl: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=900&q=80',
    duration: '00:42',
    tags: ['город', 'дорожное движение'],
  },
  {
    id: 'm4',
    title: 'Подкаст вечер',
    type: 'audio',
    size: 4520000,
    createdAt: '2026-10-04',
    previewUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80',
    duration: '02:18',
    tags: ['аудио', 'подкаст'],
  },
  {
    id: 'm5',
    title: 'Пляжный день',
    type: 'image',
    size: 1980000,
    createdAt: '2026-10-05',
    previewUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
    tags: ['пляж', 'отдых'],
  },
  {
    id: 'm6',
    title: 'Домашний клип',
    type: 'video',
    size: 15600000,
    createdAt: '2026-10-06',
    previewUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
    duration: '01:11',
    tags: ['дом', 'видео'],
  },
]

export const mockCollections: MediaCollection[] = [
  {
    id: 'c1',
    name: 'Путешествия',
    description: 'Фото и видео поездок по разным городам',
    mediaIds: ['m1', 'm2', 'm3'],
  },
  {
    id: 'c2',
    name: 'Аудио архив',
    description: 'Подкасты и записи для отдыха',
    mediaIds: ['m4'],
  },
  {
    id: 'c3',
    name: 'Домашняя библиотека',
    description: 'Личные кадры и семейные моменты',
    mediaIds: ['m5', 'm6'],
  },
]
