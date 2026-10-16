
import { supabase } from '../../../shared/api/supabaseClient'
import type {
  MediaCollection,
  MediaItem,
  MediaType,
  StorageSummary,
} from '../../../types/media'
import { getSafeErrorContext, logger } from '../../../shared/lib/logger'

const logSupabaseError = (operation: string, error: unknown): void => {
  logger.error('supabase.request.failed', {
    operation,
    ...getSafeErrorContext(error),
  })
}

const runSupabaseRequest = async <T>(
  operation: string,
  request: PromiseLike<T>,
): Promise<T> => {
  try {
    return await request
  } catch (error) {
    logSupabaseError(operation, error)
    throw error
  }
}

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
  const { data, error } = await runSupabaseRequest(
    'media.list',
    supabase
      .from('media_items')
      .select(
        'id, title, type, size, created_at, file_path, preview_path, duration_seconds, tags',
      )
      .order('created_at', { ascending: false }),
  )

  if (error) {
    logSupabaseError('media.list', error)
    throw new Error(
      `Не удалось получить медиафайлы из Supabase: ${error.message}`,
    )
  }

  if (!data) {
    logger.warn('media.list.empty_response', { operation: 'media.list' })
    throw new Error('Supabase не вернул данные для media_items.')
  }

  const items = await Promise.all(
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
        const { data: urlData, error: urlError } = await runSupabaseRequest(
          'storage.create_signed_url',
          supabase.storage
            .from('media-files')
            .createSignedUrl(storagePath, 3600),
        )

        if (urlError) {
          logger.warn('media.signed_url.failed', {
            operation: 'storage.create_signed_url',
            ...getSafeErrorContext(urlError),
          })
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

  logger.info('media.list.succeeded', {
    operation: 'media.list',
    count: items.length,
  })
  return items
}

const updateMediaTitle = async (
  mediaId: string,
  title: string,
): Promise<void> => {
  const trimmedTitle = title.trim()

  if (!trimmedTitle) {
    logger.warn('media.rename.rejected', {
      operation: 'media.rename',
      reason: 'empty_title',
    })
    throw new Error('Название не может быть пустым.')
  }

  const { data, error } = await runSupabaseRequest(
    'media.rename',
    supabase
      .from('media_items')
      .update({ title: trimmedTitle })
      .eq('id', mediaId)
      .select('id')
      .maybeSingle(),
  )

  if (error) {
    logSupabaseError('media.rename', error)
    throw new Error(`Не удалось сохранить название: ${error.message}`)
  }

  if (!data) {
    logger.warn('media.rename.not_found', { operation: 'media.rename' })
    throw new Error('Файл не найден или у вас нет прав на его изменение.')
  }

  logger.info('media.rename.succeeded', { operation: 'media.rename' })
}

const deleteMediaItem = async (mediaId: string): Promise<void> => {
  const { data: media, error: mediaError } = await runSupabaseRequest(
    'media.delete.lookup',
    supabase
      .from('media_items')
      .select('file_path, preview_path')
      .eq('id', mediaId)
      .maybeSingle(),
  )

  if (mediaError) {
    logSupabaseError('media.delete.lookup', mediaError)
    throw new Error(
      `Не удалось получить данные файла для удаления: ${mediaError.message}`,
    )
  }

  if (!media) {
    logger.warn('media.delete.not_found', {
      operation: 'media.delete.lookup',
    })
    throw new Error('Файл не найден или у вас нет прав на его удаление.')
  }

  const paths = [
    ...new Set(
      [media.file_path, media.preview_path].filter(
        (path): path is string => Boolean(path),
      ),
    ),
  ]

  const { error: storageError } = await runSupabaseRequest(
    'media.delete.storage',
    supabase.storage.from('media-files').remove(paths),
  )

  if (storageError) {
    logSupabaseError('media.delete.storage', storageError)
    throw new Error(
      `Не удалось удалить файл из хранилища: ${storageError.message}`,
    )
  }

  const { data: deletedMedia, error: deleteError } = await runSupabaseRequest(
    'media.delete.metadata',
    supabase
      .from('media_items')
      .delete()
      .eq('id', mediaId)
      .select('id')
      .maybeSingle(),
  )

  if (deleteError) {
    logSupabaseError('media.delete.metadata', deleteError)
    throw new Error(
      `Файл удалён из хранилища, но запись в базе данных осталась: ${deleteError.message}`,
    )
  }

  if (!deletedMedia) {
    logger.warn('media.delete.metadata_missing', {
      operation: 'media.delete.metadata',
    })
    throw new Error(
      'Файл удалён из хранилища, но запись в базе данных не удалена. Обновите список и проверьте доступ.',
    )
  }

  logger.info('media.delete.succeeded', { operation: 'media.delete' })
}

export const mediaApi = {
  getMediaItems,
  updateMediaTitle,
  deleteMediaItem,

  // Получение коллекций из Supabase вместе со связанными файлами.
  async getCollections(): Promise<MediaCollection[]> {
    const { data, error } = await runSupabaseRequest(
      'collections.list',
      supabase
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
        .order('created_at', { ascending: false }),
    )

    if (error) {
      logSupabaseError('collections.list', error)
      throw new Error(`Не удалось загрузить коллекции: ${error.message}`)
    }

    const collections = ((data ?? []) as unknown as SupabaseCollectionRow[]).map(
      toFrontendCollection,
    )
    logger.info('collections.list.succeeded', {
      operation: 'collections.list',
      count: collections.length,
    })
    return collections
  },

  // Создание коллекции. owner_id устанавливается через auth.uid().
  async createCollection(
    payload: CreateCollectionPayload,
  ): Promise<MediaCollection> {
    const name = payload.name.trim()

    if (!name) {
      logger.warn('collections.create.rejected', {
        operation: 'collections.create',
        reason: 'empty_name',
      })
      throw new Error('Название коллекции не может быть пустым.')
    }

    const { data, error } = await runSupabaseRequest(
      'collections.create',
      supabase
        .from('collections')
        .insert({
          name,
          description: payload.description?.trim() ?? '',
        })
        .select('id, name, description, created_at')
        .single(),
    )

    if (error) {
      logSupabaseError('collections.create', error)
      throw new Error(`Не удалось создать коллекцию: ${error.message}`)
    }

    logger.info('collections.create.succeeded', {
      operation: 'collections.create',
    })
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
    const { error } = await runSupabaseRequest(
      'collections.item.add',
      supabase.from('collection_items').insert({
        collection_id: collectionId,
        media_item_id: mediaId,
      }),
    )

    if (error) {
      if (error.code === '23505') {
        logger.warn('collections.item.add.duplicate', {
          operation: 'collections.item.add',
          errorCode: error.code,
        })
        throw new Error('Этот файл уже добавлен в коллекцию.')
      }

      logSupabaseError('collections.item.add', error)
      throw new Error(
        `Не удалось добавить файл в коллекцию: ${error.message}`,
      )
    }

    const { data, error: collectionError } = await runSupabaseRequest(
      'collections.item.add.refresh',
      supabase
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
        .single(),
    )

    if (collectionError) {
      logSupabaseError('collections.item.add.refresh', collectionError)
      throw new Error(
        `Файл добавлен, но не удалось обновить коллекцию: ${collectionError.message}`,
      )
    }

    const collection = toFrontendCollection(
      data as unknown as SupabaseCollectionRow,
    )
    logger.info('collections.item.add.succeeded', {
      operation: 'collections.item.add',
    })
    return collection
  },

  // Удаление файла из коллекции без удаления оригинального файла.
  async removeMediaFromCollection(
    collectionId: string,
    mediaId: string,
  ): Promise<MediaCollection> {
    const { data, error } = await runSupabaseRequest(
      'collections.item.remove',
      supabase
        .from('collection_items')
        .delete()
        .eq('collection_id', collectionId)
        .eq('media_item_id', mediaId)
        .select('collection_id'),
    )

    if (error) {
      logSupabaseError('collections.item.remove', error)
      throw new Error(
        `Не удалось удалить файл из коллекции: ${error.message}`,
      )
    }

    if (!data?.length) {
      logger.warn('collections.item.remove.not_found', {
        operation: 'collections.item.remove',
      })
      throw new Error(
        'Связь не найдена или у вас нет прав на её удаление.',
      )
    }

    const { data: collection, error: collectionError } =
      await runSupabaseRequest(
        'collections.item.remove.refresh',
        supabase
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
          .single(),
      )

    if (collectionError) {
      logSupabaseError('collections.item.remove.refresh', collectionError)
      throw new Error(
        `Файл удалён из коллекции, но не удалось обновить список: ${collectionError.message}`,
      )
    }

    const updatedCollection = toFrontendCollection(
      collection as unknown as SupabaseCollectionRow,
    )
    logger.info('collections.item.remove.succeeded', {
      operation: 'collections.item.remove',
    })
    return updatedCollection
  },

  // Удаление коллекции. Связи удаляются через ON DELETE CASCADE.
  async deleteCollection(collectionId: string): Promise<void> {
    const { data, error } = await runSupabaseRequest(
      'collections.delete',
      supabase
        .from('collections')
        .delete()
        .eq('id', collectionId)
        .select('id'),
    )

    if (error) {
      logSupabaseError('collections.delete', error)
      throw new Error(`Не удалось удалить коллекцию: ${error.message}`)
    }

    if (!data?.length) {
      logger.warn('collections.delete.not_found', {
        operation: 'collections.delete',
      })
      throw new Error(
        'Коллекция не найдена или у вас нет прав на её удаление.',
      )
    }

    logger.info('collections.delete.succeeded', {
      operation: 'collections.delete',
    })
  },
  async getStorageSummary(): Promise<StorageSummary> {
    const { data, error } = await runSupabaseRequest(
      'storage.summary',
      supabase.from('media_items').select('size'),
    )

    if (error) {
      logSupabaseError('storage.summary', error)
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

    logger.info('storage.summary.succeeded', {
      operation: 'storage.summary',
    })
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
    const { data, error } = await runSupabaseRequest(
      'library.summary',
      supabase
        .from('media_items')
        .select('created_at')
        .order('created_at', { ascending: false }),
    )

    if (error) {
      logSupabaseError('library.summary', error)
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

    logger.info('library.summary.succeeded', {
      operation: 'library.summary',
    })
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
} = await runSupabaseRequest('media.upload.auth', supabase.auth.getUser())

if (userError) {
  logSupabaseError('media.upload.auth', userError)
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
  logger.warn('media.upload.unauthenticated', {
    operation: 'media.upload.auth',
  })
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
    logger.warn('media.upload.rejected', {
      operation: 'media.upload.validate',
      reason: 'unsupported_type',
    })
    throw new Error('Поддерживаются только изображения, видео и аудио.')
  }

  // 3. Проверяем размер файла.
  if (file.size === 0) {
    logger.warn('media.upload.rejected', {
      operation: 'media.upload.validate',
      reason: 'empty_file',
    })
    throw new Error('Выбран пустой файл.')
  }

  if (file.size > 50 * 1024 * 1024) {
    logger.warn('media.upload.rejected', {
      operation: 'media.upload.validate',
      reason: 'file_too_large',
    })
    throw new Error('Размер файла не должен превышать 50 МБ.')
  }

  // 4. Создаём уникальный путь внутри папки пользователя.
  const extension = file.name.includes('.')
    ? file.name.slice(file.name.lastIndexOf('.'))
    : ''

  const filePath = `${user.id}/${crypto.randomUUID()}${extension}`

  // 5. Загружаем файл в приватный Storage.
  const { error: uploadError } = await runSupabaseRequest(
    'media.upload.storage',
    supabase.storage.from('media-files').upload(filePath, file, {
      contentType: file.type,
      upsert: false,
    }),
  )

  if (uploadError) {
    logSupabaseError('media.upload.storage', uploadError)
    throw new Error(`Не удалось загрузить файл: ${uploadError.message}`)
  }

  // 6. Сохраняем метаданные в PostgreSQL.
  const { error: insertError } = await runSupabaseRequest(
    'media.upload.metadata',
    supabase.from('media_items').insert({
      owner_id: user.id,
      title: file.name,
      type,
      size: file.size,
      file_path: filePath,
      preview_path: null,
      duration_seconds: null,
      tags: [],
    }),
  )

  if (insertError) {
    logSupabaseError('media.upload.metadata', insertError)
    // Если метаданные не сохранились, удаляем загруженный объект.
    let cleanupError: unknown

    try {
      const { error } = await supabase.storage
        .from('media-files')
        .remove([filePath])
      cleanupError = error
    } catch (error) {
      cleanupError = error
    }

    if (cleanupError) {
      logSupabaseError('media.upload.cleanup', cleanupError)
    }

    throw new Error(
      `Файл загружен, но метаданные не сохранены: ${insertError.message}`,
    )
  }

  logger.info('media.upload.succeeded', {
    operation: 'media.upload',
    mediaType: type,
  })
}
