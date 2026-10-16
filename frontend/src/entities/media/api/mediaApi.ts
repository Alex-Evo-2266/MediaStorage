
import { supabase } from '../../../shared/api/supabaseClient'
import type {
  MediaCollection,
  MediaItem,
  MediaType,
  StorageSummary,
} from '../../../types/media'

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

interface SupabaseCollectionRow {
  id: string
  name: string
  description: string
  created_at: string
  collection_items: {
    media_item_id: string
  }[]
}

const toFrontendMediaItem = (row: SupabaseMediaItemRow): MediaItem => ({
  id: row.id,
  title: row.title,
  type: row.type,
  size: row.size,
  createdAt: row.created_at,
  previewUrl: '',
  duration:
    row.duration_seconds == null
      ? undefined
      : String(row.duration_seconds),
  tags: Array.isArray(row.tags) ? row.tags : [],
})

const toFrontendCollection = (
  row: SupabaseCollectionRow,
): MediaCollection => ({
  id: row.id,
  name: row.name,
  description: row.description,
  mediaIds: (row.collection_items ?? []).map(
    (item) => item.media_item_id,
  ),
})

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

      // Для аудио используется оригинал.
      // Для изображений и видео — превью, если оно существует.
      const storagePath =
        item.type === 'audio'
          ? item.file_path
          : item.preview_path || item.file_path

      let previewUrl = ''

      if (
        storagePath &&
        ['image', 'video', 'audio'].includes(item.type)
      ) {
        const { data: urlData, error: urlError } = await supabase.storage
          .from('media-files')
          .createSignedUrl(storagePath, 3600)

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

const updateMediaTitle = async (
  mediaId: string,
  title: string,
): Promise<void> => {
  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    throw new Error('Название не может быть пустым.')
  }

  const { data, error } = await supabase
    .from('media_items')
    .update({ title: trimmedTitle })
    .eq('id', mediaId)
    .select('id')
    .maybeSingle()

  if (error) {
    throw new Error(`Не удалось сохранить название: ${error.message}`)
  }

  if (!data) {
    throw new Error('Файл не найден или у вас нет прав на его изменение.')
  }
}

const deleteMediaItem = async (mediaId: string): Promise<void> => {
  const { data: media, error: mediaError } = await supabase
    .from('media_items')
    .select('file_path, preview_path')
    .eq('id', mediaId)
    .maybeSingle()

  if (mediaError) {
    throw new Error(
      `Не удалось получить данные файла для удаления: ${mediaError.message}`,
    )
  }

  if (!media) {
    throw new Error('Файл не найден или у вас нет прав на его удаление.')
  }

  const paths = [
    ...new Set(
      [media.file_path, media.preview_path].filter(
        (path): path is string => Boolean(path),
      ),
    ),
  ]

  const { error: storageError } = await supabase.storage
    .from('media-files')
    .remove(paths)

  if (storageError) {
    throw new Error(
      `Не удалось удалить файл из хранилища: ${storageError.message}`,
    )
  }

  const { data: deletedMedia, error: deleteError } = await supabase
    .from('media_items')
    .delete()
    .eq('id', mediaId)
    .select('id')
    .maybeSingle()

  if (deleteError) {
    throw new Error(
      `Файл удалён из хранилища, но запись в базе данных осталась: ${deleteError.message}`,
    )
  }

  if (!deletedMedia) {
    throw new Error(
      'Файл удалён из хранилища, но запись в базе данных не удалена. Обновите список и проверьте доступ.',
    )
  }
}

export const mediaApi = {
  getMediaItems,
  updateMediaTitle,
  deleteMediaItem,

  // Получение коллекций из Supabase вместе со связанными файлами.
  async getCollections(): Promise<MediaCollection[]> {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        id,
        name,
        description,
        created_at,
        collection_items (
          media_item_id
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Не удалось загрузить коллекции: ${error.message}`)
    }

    return ((data ?? []) as unknown as SupabaseCollectionRow[]).map(
      toFrontendCollection,
    )
  },

  // Создание коллекции. owner_id устанавливается через auth.uid().
  async createCollection(
    payload: CreateCollectionPayload,
  ): Promise<MediaCollection> {
    const name = payload.name.trim()

    if (!name) {
      throw new Error('Название коллекции не может быть пустым.')
    }

    const { data, error } = await supabase
      .from('collections')
      .insert({
        name,
        description: payload.description?.trim() ?? '',
      })
      .select('id, name, description, created_at')
      .single()

    if (error) {
      throw new Error(`Не удалось создать коллекцию: ${error.message}`)
    }

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      mediaIds: [],
    }
  },

  // Добавление файла в коллекцию.
  async addMediaToCollection(
    collectionId: string,
    mediaId: string,
  ): Promise<MediaCollection> {
    const { error } = await supabase
      .from('collection_items')
      .insert({
        collection_id: collectionId,
        media_item_id: mediaId,
      })

    if (error) {
      if (error.code === '23505') {
        throw new Error('Этот файл уже добавлен в коллекцию.')
      }

      throw new Error(
        `Не удалось добавить файл в коллекцию: ${error.message}`,
      )
    }

    const { data, error: collectionError } = await supabase
      .from('collections')
      .select(`
        id,
        name,
        description,
        created_at,
        collection_items (
          media_item_id
        )
      `)
      .eq('id', collectionId)
      .single()

    if (collectionError) {
      throw new Error(
        `Файл добавлен, но не удалось обновить коллекцию: ${collectionError.message}`,
      )
    }

    return toFrontendCollection(
      data as unknown as SupabaseCollectionRow,
    )
  },

  // Удаление файла из коллекции без удаления оригинального файла.
  async removeMediaFromCollection(
    collectionId: string,
    mediaId: string,
  ): Promise<MediaCollection> {
    const { data, error } = await supabase
      .from('collection_items')
      .delete()
      .eq('collection_id', collectionId)
      .eq('media_item_id', mediaId)
      .select('collection_id')

    if (error) {
      throw new Error(
        `Не удалось удалить файл из коллекции: ${error.message}`,
      )
    }

    if (!data?.length) {
      throw new Error(
        'Связь не найдена или у вас нет прав на её удаление.',
      )
    }

    const { data: collection, error: collectionError } = await supabase
      .from('collections')
      .select(`
        id,
        name,
        description,
        created_at,
        collection_items (
          media_item_id
        )
      `)
      .eq('id', collectionId)
      .single()

    if (collectionError) {
      throw new Error(
        `Файл удалён из коллекции, но не удалось обновить список: ${collectionError.message}`,
      )
    }

    return toFrontendCollection(
      collection as unknown as SupabaseCollectionRow,
    )
  },

  // Удаление коллекции. Связи удаляются через ON DELETE CASCADE.
  async deleteCollection(collectionId: string): Promise<void> {
    const { data, error } = await supabase
      .from('collections')
      .delete()
      .eq('id', collectionId)
      .select('id')

    if (error) {
      throw new Error(`Не удалось удалить коллекцию: ${error.message}`)
    }

    if (!data?.length) {
      throw new Error(
        'Коллекция не найдена или у вас нет прав на её удаление.',
      )
    }
  },
async getStorageSummary(): Promise<StorageSummary> {
  const { data, error } = await supabase
    .from('media_items')
    .select('size')

  if (error) {
    throw new Error(
      `Не удалось получить информацию о хранилище: ${error.message}`,
    )
  }

  const usedBytes = (data ?? []).reduce(
    (total, item) => total + Number(item.size || 0),
    0,
  )

  const bytesPerGb = 1024 ** 3
  const totalGb = 1 // Временная квота для интерфейса
  const usedGb = usedBytes / bytesPerGb
  const freeGb = Math.max(0, totalGb - usedGb)
  const percentage = Math.min(100, (usedGb / totalGb) * 100)

  return {
    usedGb,
    totalGb,
    freeGb,
    percentage,
  }
},

  async getLibrarySummary(): Promise<{
    totalFiles: number
    updatedAt: string
  }> {
    const { data, error } = await supabase
      .from('media_items')
      .select('created_at')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(
        `Не удалось получить статистику библиотеки: ${error.message}`,
      )
    }

    const totalFiles = data.length
    const latestCreatedAt = data[0]?.created_at

    const updatedAt = latestCreatedAt
      ? new Date(latestCreatedAt).toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Нет файлов'

    return {
      totalFiles,
      updatedAt,
    }
  },
}

export async function uploadMediaFile(file: File): Promise<void> {
  // 1. Проверяем авторизацию.
// 1. Проверяем авторизацию.
const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser()

if (userError) {
  const message = userError.message.toLowerCase()

  if (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('failed to connect')
  ) {
    throw new Error(
      'Не удалось связаться с сервером. Проверьте подключение к интернету и попробуйте снова.',
    )
  }

  if (
    message.includes('jwt') ||
    message.includes('token') ||
    message.includes('session') ||
    message.includes('unauthorized')
  ) {
    throw new Error(
      'Сессия истекла. Войдите в систему повторно.',
    )
  }

  throw new Error(
    `Не удалось проверить авторизацию: ${userError.message}`,
  )
}

if (!user) {
  throw new Error('Для загрузки файлов необходимо войти в систему.')
}

  // 2. Определяем тип медиа.
  let type: 'image' | 'video' | 'audio'

  if (file.type.startsWith('image/')) {
    type = 'image'
  } else if (file.type.startsWith('video/')) {
    type = 'video'
  } else if (file.type.startsWith('audio/')) {
    type = 'audio'
  } else {
    throw new Error('Поддерживаются только изображения, видео и аудио.')
  }

  // 3. Проверяем размер файла.
  if (file.size === 0) {
    throw new Error('Выбран пустой файл.')
  }

  if (file.size > 50 * 1024 * 1024) {
    throw new Error('Размер файла не должен превышать 50 МБ.')
  }

  // 4. Создаём уникальный путь внутри папки пользователя.
  const extension = file.name.includes('.')
    ? file.name.slice(file.name.lastIndexOf('.'))
    : ''

  const filePath = `${user.id}/${crypto.randomUUID()}${extension}`

  // 5. Загружаем файл в приватный Storage.
  const { error: uploadError } = await supabase.storage
    .from('media-files')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    throw new Error(`Не удалось загрузить файл: ${uploadError.message}`)
  }

  // 6. Сохраняем метаданные в PostgreSQL.
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
    })

  if (insertError) {
    // Если метаданные не сохранились, удаляем загруженный объект.
    const { error: cleanupError } = await supabase.storage
      .from('media-files')
      .remove([filePath])

    if (cleanupError) {
      console.error(
        'Не удалось удалить файл после ошибки сохранения метаданных:',
        cleanupError.message,
      )
    }

    throw new Error(
      `Файл загружен, но метаданные не сохранены: ${insertError.message}`,
    )
  }
}
