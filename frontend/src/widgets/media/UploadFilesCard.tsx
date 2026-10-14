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
import { CloudUploadOutlined, DeleteOutlined, FileCopyOutlined } from '@mui/icons-material'
import type { MediaType } from '../../types/media'

type UploadStatus = 'uploading' | 'success' | 'error'

interface PendingUploadItem {
  id: string
  name: string
  size: number
  type: MediaType
  status: UploadStatus
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
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension ?? '')) return 'image'
  if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension ?? '')) return 'video'
  if (['mp3', 'wav', 'ogg', 'm4a', 'aac'].includes(extension ?? '')) return 'audio'

  return null
}

const formatUploadSize = (size: number) => {
  if (size < 1024) return `${size} Б`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} КБ`
  return `${(size / (1024 * 1024)).toFixed(1)} МБ`
}

export function UploadFilesCard() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [items, setItems] = useState<PendingUploadItem[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [isDragActive, setIsDragActive] = useState(false)

  const addFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return

    const selectedFiles = Array.from(fileList)
    const validFiles: File[] = []
    const rejectedFiles: string[] = []

    for (const file of selectedFiles) {
      const detectedType = detectMediaType(file)
      if (!detectedType) {
        rejectedFiles.push(file.name)
        continue
      }

      if (file.size > MAX_UPLOAD_FILE_SIZE) {
        rejectedFiles.push(file.name)
        continue
      }

      validFiles.push(file)
    }

    if (validFiles.length === 0) {
      setErrorMessage(
        rejectedFiles.length > 0
          ? `Некорректные файлы: ${rejectedFiles.join(', ')}`
          : 'Не удалось добавить файлы. Проверьте тип и размер.',
      )
      setInfoMessage('')
      if (inputRef.current) inputRef.current.value = ''
      return
    }

    const nextItems = validFiles.map((file) => ({
      id: createUploadId(),
      name: file.name,
      size: file.size,
      type: detectMediaType(file) as MediaType,
      status: 'uploading' as const,
    }))

    setItems((prev) => [...nextItems, ...prev])
    setErrorMessage(
      rejectedFiles.length > 0
        ? `Некоторые файлы не добавлены: ${rejectedFiles.join(', ')}`
        : '',
    )
    setInfoMessage(`Добавлено ${nextItems.length} файл${nextItems.length > 1 ? 'а' : ''} в очередь.`)

    const ids = nextItems.map((item) => item.id)
    const uploadTarget = nextItems.map((item) => ({ id: item.id, name: item.name, type: item.type }))

    window.setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => (ids.includes(item.id) ? { ...item, status: 'success' } : item)),
      )
      setInfoMessage(`Файлы отправлены в заглушку: ${uploadTarget.map((item) => item.name).join(', ')}`)
      console.info('Stub upload target', uploadTarget)
    }, 800)

    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
    setInfoMessage('Файл удалён из очереди.')
  }

  const handleUploadStub = () => {
    if (items.length === 0) {
      setInfoMessage('Нет файлов для отправки.')
      return
    }

    setItems((prev) => prev.map((item) => ({ ...item, status: 'uploading' })))
    setInfoMessage('Отправка в заглушку...')

    window.setTimeout(() => {
      setItems((prev) => prev.map((item) => ({ ...item, status: 'success' })))
      setInfoMessage('Локальная отправка в заглушку завершена. Backend пока не подключён.')
      console.info('Stub upload target', items)
    }, 600)
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
        boxShadow: isDragActive ? '0 0 0 3px rgba(87, 121, 255, 0.12)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
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
          sx={{ borderRadius: 2, mb: 1.5, py: 1 }}
        >
          Выбрать файлы
          <input
            ref={inputRef}
            hidden
            type="file"
            accept="*/*"
            multiple
            onChange={(event) => addFiles(event.target.files)}
          />
        </Button>

        <Typography variant="caption" sx={{ color: '#4d5d73' }}>
          {isDragActive ? 'Отпустите файлы, чтобы загрузить их.' : 'Перетащите файлы в окно или выберите вручную.'}
        </Typography>

        {errorMessage ? (
          <Typography variant="caption" sx={{ mt: 1.5, display: 'block', color: '#d14343' }}>
            {errorMessage}
          </Typography>
        ) : null}

        {infoMessage ? (
          <Typography variant="caption" sx={{ mt: 1, display: 'block', color: '#3861d6' }}>
            {infoMessage}
          </Typography>
        ) : null}

        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          {items.length === 0 ? (
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: '#eef3ff', border: '1px dashed #c9d9fb' }}>
              <Typography variant="caption" sx={{ color: '#4d5d73' }}>
                Нет файлов для загрузки.
              </Typography>
            </Box>
          ) : (
            items.map((item) => (
              <Box key={item.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: '#f0f5ff', border: '1px solid #dfeafb' }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, flex: 1 }}>
                    <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: '#dbe7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FileCopyOutlined fontSize="small" sx={{ color: '#2354d7' }} />
                    </Box>
                    <Box sx={{ minWidth: 0, overflow: 'hidden' }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#4e5f77' }}>
                        {formatUploadSize(item.size)} · {item.type}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => handleRemoveItem(item.id)} aria-label={`Удалить ${item.name}`}>
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={item.status === 'uploading' ? 60 : item.status === 'success' ? 100 : 0}
                  sx={{ mt: 1.25, height: 6, borderRadius: 999, bgcolor: '#dfeafe' }}
                />

                <Typography variant="caption" sx={{ mt: 0.75, display: 'block', color: item.status === 'success' ? '#1f8d4d' : '#58687d' }}>
                  {item.status === 'uploading' ? 'Загрузка...' : item.status === 'success' ? 'Готово' : 'Ошибка'}
                </Typography>
              </Box>
            ))
          )}
        </Stack>

        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, borderRadius: 2, py: 1 }}
          disabled={items.length === 0}
          onClick={handleUploadStub}
        >
          Отправить в заглушку
        </Button>
      </CardContent>
    </Card>
  )
}
