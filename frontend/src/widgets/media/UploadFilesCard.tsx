import { useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material'
import {
  CloudUploadOutlined,
  DeleteOutlined,
  FileCopyOutlined,
} from '@mui/icons-material'
import type { MediaType } from '../../types/media'
import { uploadMediaFile } from '../../entities/media/api/mediaApi'

type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

interface PendingUploadItem {
  id: string
  name: string
  size: number
  type: MediaType
  status: UploadStatus
  file: File
  error?: string
}

const MAX_UPLOAD_FILE_SIZE = 50 * 1024 * 1024

const createUploadId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `upload-${Date.now()}-${Math.random().toString(16).slice(2)}`

const detectMediaType = (file: File): MediaType | null => {
  const mimeType = file.type.toLowerCase()

  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'

  const extension = file.name.split('.').pop()?.toLowerCase()

  if (
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(
      extension ?? '',
    )
  ) {
    return 'image'
  }

  if (
    ['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension ?? '')
  ) {
    return 'video'
  }

  if (
    ['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(extension ?? '')
  ) {
    return 'audio'
  }

  return null
}

const formatUploadSize = (size: number) => {
  if (size < 1024) return `${size} Б`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`

  return `${(size / (1024 * 1024)).toFixed(1)} МБ`
}

interface UploadFilesCardProps {
  onUploadComplete: () => Promise<void>
}

export function UploadFilesCard({ onUploadComplete }: UploadFilesCardProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isUploadingRef = useRef(false)

  const [items, setItems] = useState<PendingUploadItem[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    if (isUploadingRef.current) {
      setInfoMessage('Дождитесь завершения текущей загрузки.')
      return
    }

    const selectedFiles = Array.from(fileList)
    const validFiles: Array<{ file: File; type: MediaType }> = []
    const rejectedFiles: string[] = []

    for (const file of selectedFiles) {
      const type = detectMediaType(file)

      if (!type) {
        rejectedFiles.push(`${file.name}: неподдерживаемый формат`)
        continue
      }

      if (file.size === 0) {
        rejectedFiles.push(`${file.name}: файл пуст`)
        continue
      }

      if (file.size > MAX_UPLOAD_FILE_SIZE) {
        rejectedFiles.push(`${file.name}: размер превышает 50 МБ`)
        continue
      }

      validFiles.push({ file, type })
    }

    const nextItems: PendingUploadItem[] = validFiles.map(
      ({ file, type }) => ({
        id: createUploadId(),
        name: file.name,
        size: file.size,
        type,
        status: 'pending',
        file,
      }),
    )

    if (nextItems.length > 0) {
      setItems((prev) => [...nextItems, ...prev])
      setInfoMessage(
        `Добавлено файлов в очередь: ${nextItems.length}. Нажмите «Загрузить файлы».`,
      )
    } else {
      setInfoMessage('')
    }

    setErrorMessage(rejectedFiles.join('\n'))

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const handleRemoveItem = (id: string) => {
    if (isUploadingRef.current) return

    setItems((prev) => prev.filter((item) => item.id !== id))
    setErrorMessage('')
    setInfoMessage('Файл удалён из очереди.')
  }

  const handleUpload = async () => {
    if (isUploadingRef.current) return

    const pendingItems = items.filter(
      (item) => item.status === 'pending' || item.status === 'error',
    )

    if (pendingItems.length === 0) {
      setInfoMessage('Нет файлов для загрузки.')
      return
    }

    isUploadingRef.current = true
    setIsUploading(true)
    setErrorMessage('')
    setInfoMessage('Загрузка файлов в Supabase...')

    let successCount = 0
    let failedCount = 0

    try {
      for (const item of pendingItems) {
        setItems((prev) =>
          prev.map((current) =>
            current.id === item.id
              ? { ...current, status: 'uploading', error: undefined }
              : current,
          ),
        )

        try {
          await uploadMediaFile(item.file)

          successCount += 1

          setItems((prev) =>
            prev.map((current) =>
              current.id === item.id
                ? { ...current, status: 'success', error: undefined }
                : current,
            ),
          )
        } catch (error) {
          failedCount += 1

          const message =
            error instanceof Error
              ? error.message
              : 'Неизвестная ошибка загрузки.'

          setItems((prev) =>
            prev.map((current) =>
              current.id === item.id
                ? { ...current, status: 'error', error: message }
                : current,
            ),
          )
        }
      }

      setItems((currentItems) => {
        const errors = currentItems
          .filter((item) => item.status === 'error' && item.error)
          .map((item) => `${item.name}: ${item.error}`)

        setErrorMessage(errors.join('\n'))
        return currentItems
      })

      if (failedCount === 0) {
        setInfoMessage(`Успешно загружено файлов: ${successCount}.`)
      } else {
        setInfoMessage(
          `Загрузка завершена. Успешно: ${successCount}, с ошибками: ${failedCount}.`,
        )
      }

      if (successCount > 0) {
        await onUploadComplete()
      }
    } finally {
      isUploadingRef.current = false
      setIsUploading(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setIsDragActive(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <Card
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragActive(true)
      }}
      onDragLeave={(event) => {
        event.preventDefault()
        setIsDragActive(false)
      }}
      onDrop={handleDrop}
      sx={{
        borderRadius: 3,
        bgcolor: '#f7f9fb',
        border: `1px solid ${isDragActive ? '#a9bdf9' : '#e5eaf0'}`,
        boxShadow: isDragActive
          ? '0 0 0 3px rgba(87, 121, 255, 0.12)'
          : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Загрузить файлы
          </Typography>

          <CloudUploadOutlined
            fontSize="small"
            sx={{ color: 'text.disabled', opacity: 0.8 }}
            aria-hidden="true"
          />
        </Stack>

        <Button
          variant="contained"
          fullWidth
          component="label"
          disabled={isUploading}
          sx={{ borderRadius: 2, mb: 1.5, py: 1 }}
        >
          Выбрать файлы
          <input
            ref={inputRef}
            hidden
            type="file"
            accept="image/*,video/*,audio/*"
            multiple
            onChange={(event) => addFiles(event.target.files)}
          />
        </Button>

        <Typography variant="caption" sx={{ color: '#4d5d73' }}>
          {isDragActive
            ? 'Отпустите файлы, чтобы добавить их в очередь.'
            : 'Перетащите файлы в окно или выберите вручную. Максимальный размер — 50 МБ на файл.'}
        </Typography>

        {errorMessage && (
          <Typography
            variant="caption"
            sx={{
              mt: 1.5,
              display: 'block',
              color: '#d14343',
              whiteSpace: 'pre-line',
            }}
          >
            {errorMessage}
          </Typography>
        )}

        {infoMessage && (
          <Typography
            variant="caption"
            sx={{ mt: 1, display: 'block', color: '#3861d6' }}
          >
            {infoMessage}
          </Typography>
        )}

        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          {items.length === 0 ? (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                bgcolor: '#eef3ff',
                border: '1px dashed #c9d9fb',
              }}
            >
              <Typography variant="caption" sx={{ color: '#4d5d73' }}>
                Нет файлов для загрузки.
              </Typography>
            </Box>
          ) : (
            items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f0f5ff',
                  border: '1px solid #dfeafb',
                }}
              >
                <Stack
                  direction="row"
                  sx={{
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      minWidth: 0,
                      flex: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: 1.5,
                        bgcolor: '#dbe7ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <FileCopyOutlined
                        fontSize="small"
                        sx={{ color: '#2354d7' }}
                      />
                    </Box>

                    <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        sx={{ color: '#4e5f77' }}
                      >
                        {formatUploadSize(item.size)} · {item.type}
                      </Typography>
                    </Box>
                  </Box>

                  <IconButton
                    size="small"
                    disabled={isUploading}
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label={`Удалить ${item.name}`}
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={
                    item.status === 'success'
                      ? 100
                      : item.status === 'uploading'
                        ? 60
                        : 0
                  }
                  sx={{
                    mt: 1.25,
                    height: 6,
                    borderRadius: 999,
                    bgcolor: '#dfeafe',
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    mt: 0.75,
                    display: 'block',
                    color:
                      item.status === 'success'
                        ? '#1f8d4d'
                        : item.status === 'error'
                          ? '#d14343'
                          : '#58687d',
                  }}
                >
                  {item.status === 'pending'
                    ? 'Ожидает загрузки'
                    : item.status === 'uploading'
                      ? 'Загрузка...'
                      : item.status === 'success'
                        ? 'Загружено'
                        : `Ошибка${item.error ? `: ${item.error}` : ''}`}
                </Typography>
              </Box>
            ))
          )}
        </Stack>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, borderRadius: 2, py: 1 }}
          disabled={
            isUploading ||
            items.length === 0 ||
            items.every((item) => item.status === 'success')
          }
          onClick={handleUpload}
        >
          {isUploading ? 'Загрузка...' : 'Загрузить файлы'}
        </Button>
      </CardContent>
    </Card>
  )
}
