import { mockCollections, mockMedia } from '../../../data/mockMedia'
import { supabase } from '../../../shared/api/supabaseClient'
import type { MediaCollection, MediaItem, MediaType, StorageSummary } from '../../../types/media'

interface SupabaseMediaItemRow {
  id: string
  title: string
  type: MediaType
  size: number
  created_at: string
  file_path: string
  preview_path: string | null
  duration_seconds: number | null
  tags: string[]
}

const toFrontendMediaItem = (row: SupabaseMediaItemRow): MediaItem => ({
  id: row.id,
  title: row.title,
  type: row.type,
  size: row.size,
  createdAt: row.created_at,
  previewUrl: row.preview_path ?? '',
  duration: row.duration_seconds === null ? undefined : String(row.duration_seconds),
  tags: Array.isArray(row.tags) ? row.tags : [],
})

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



export const getMediaItems = async (): Promise<MediaItem[]> => {
  const { data, error } = await supabase
    .from('media_items')
    .select(
      'id, title, type, size, created_at, file_path, preview_path, duration_seconds, tags',
    )
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(
      `Не удалось получить медиафайлы из Supabase: ${error.message}`,
    )
  }

  if (!data) {
    throw new Error('Supabase не вернул данные для media_items.')
  }

  return Promise.all(
    data.map(async (row) => {
      const item = row as SupabaseMediaItemRow
      const filePath = item.preview_path || item.file_path
      let previewUrl = ''

      // Получаем подписанную ссылку для изображений и видео.
      if (
        filePath &&
        (item.type === 'image' || item.type === 'video')
      ) {
        const { data: urlData, error: urlError } = await supabase.storage
          .from('media-files')
          .createSignedUrl(filePath, 3600)

        if (urlError) {
          console.error(
            `Не удалось получить ссылку для ${item.title}:`,
            urlError.message,
          )
        } else {
          previewUrl = urlData.signedUrl
        }
      }

      return {
        ...toFrontendMediaItem(item),
        previewUrl,
      }
    }),
  )
}



export const mediaApi = {
  getMediaItems : getMediaItems,

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


export async function uploadMediaFile(file: File): Promise<void> {
  // 1. Проверяем авторизацию
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error('Для загрузки файлов необходимо войти в систему.');
  }

  // 2. Определяем тип медиа
  let type: 'image' | 'video' | 'audio';

  if (file.type.startsWith('image/')) {
    type = 'image';
  } else if (file.type.startsWith('video/')) {
    type = 'video';
  } else if (file.type.startsWith('audio/')) {
    type = 'audio';
  } else {
    throw new Error('Поддерживаются только изображения, видео и аудио.');
  }

  // 3. Ограничиваем размер файла 50 МБ для первого теста
  if (file.size === 0) {
    throw new Error('Выбран пустой файл.');
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error('Размер файла не должен превышать 50 МБ.');
  }

  // 4. Создаём уникальный путь внутри папки пользователя
  const extension = file.name.includes('.')
    ? file.name.slice(file.name.lastIndexOf('.'))
    : '';

  const filePath = `${user.id}/${crypto.randomUUID()}${extension}`;

  // 5. Загружаем файл в приватный Storage
  const { error: uploadError } = await supabase.storage
    .from('media-files')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Не удалось загрузить файл: ${uploadError.message}`);
  }

  // 6. Сохраняем метаданные в PostgreSQL
  const { error: insertError } = await supabase
    .from('media_items')
    .insert({
      owner_id: user.id,
      title: file.name,
      type,
      size: file.size,
      file_path: filePath,
      preview_path: null,
      duration_seconds: null,
      tags: [],
    });

  if (insertError) {
    // Если метаданные не сохранились, удаляем загруженный объект
    const { error: cleanupError } = await supabase.storage
      .from('media-files')
      .remove([filePath]);

    if (cleanupError) {
      console.error(
        'Не удалось удалить файл после ошибки сохранения метаданных:',
        cleanupError.message,
      );
    }

    throw new Error(
      `Файл загружен, но метаданные не сохранены: ${insertError.message}`,
    );
  }
}

