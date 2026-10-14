import { useMemo, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  IconButton,
  LinearProgress,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import {
  CloudUploadOutlined,
  DeleteOutlined,
  FileCopyOutlined,
  FolderOutlined,
  MoreHoriz,
} from '@mui/icons-material'
import { SidebarNavigation } from './components/navigation/SidebarNavigation'
import { TopBar } from './components/navigation/TopBar'
import { useMediaCollections } from './features/media/useMediaCollections'
import { useMediaLibrary } from './features/media/useMediaLibrary'
import { useStorageSummary } from './features/media/useStorageSummary'
import { LibraryPage } from './pages/LibraryPage'
import type { AppView, MediaType } from './types/media'

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

function UploadFilesCard() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [items, setItems] = useState<PendingUploadItem[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

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

  return (
    <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0' }}>
      <CardContent sx={{ p: 2.25 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Загрузить файлы
          </Typography>
          <IconButton size="small" component="label" aria-label="Выбрать файлы">
            <CloudUploadOutlined fontSize="small" />
            <input
              ref={inputRef}
              hidden
              type="file"
              accept="image/*,video/*,audio/*"
              multiple
              onChange={(event) => addFiles(event.target.files)}
            />
          </IconButton>
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
            accept="image/*,video/*,audio/*"
            multiple
            onChange={(event) => addFiles(event.target.files)}
          />
        </Button>

        <Typography variant="caption" color="text.secondary">
          Перетащите файлы в окно или выберите вручную.
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
              <Typography variant="caption" color="text.secondary">
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
                      <Typography variant="caption" color="text.secondary">
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

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2d5ef5' },
    secondary: { main: '#6d7b91' },
    background: {
      default: '#edf1f5',
      paper: '#f7f9fb',
    },
    text: {
      primary: '#1d2430',
      secondary: '#677789',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: 10 },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
  },
})

function App() {
  const [activeView, setActiveView] = useState<AppView>('library')
  const [searchValue, setSearchValue] = useState('')

  const { items: mediaItems, loading: mediaLoading } = useMediaLibrary()
  const { items: collections, loading: collectionsLoading } = useMediaCollections()
  const { summary: storageSummary } = useStorageSummary()

  const mediaCounts = useMemo(
    () => ({
      image: mediaItems.filter((item) => item.type === 'image').length,
      video: mediaItems.filter((item) => item.type === 'video').length,
      audio: mediaItems.filter((item) => item.type === 'audio').length,
    }),
    [mediaItems],
  )

  const filteredMedia = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return mediaItems
    return mediaItems.filter((item) => item.title.toLowerCase().includes(query))
  }, [mediaItems, searchValue])

  const selectedItem = filteredMedia[4] ?? mediaItems[4] ?? mediaItems[0] ?? null

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#edf1f5', color: '#1d2430', p: { xs: 0, md: 1 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ minHeight: '100vh' }}>
          <SidebarNavigation
            activeView={activeView}
            onViewChange={setActiveView}
            storageSummary={storageSummary}
            totalCollections={collections.length}
            mediaCounts={mediaCounts}
          />

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <TopBar
              title={activeView === 'collections' ? 'Коллекции' : activeView === 'upload' ? 'Добавление файлов' : 'Медиатека'}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />

            <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
              <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3} sx={{ height: '100%' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <LibraryPage items={filteredMedia} loading={mediaLoading} />
                </Box>

                <Stack spacing={2.5} sx={{ width: { xs: '100%', xl: 330 } }}>
                  <UploadFilesCard />

                  <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0' }}>
                    <CardContent sx={{ p: 2.25 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Выбрано
                        </Typography>
                        <Chip label="фото" size="small" variant="outlined" />
                      </Stack>

                      {selectedItem ? (
                        <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5eaf0', mb: 2 }}>
                          <Box component="img" src={selectedItem.previewUrl} sx={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }} />
                        </Box>
                      ) : null}

                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {selectedItem ? selectedItem.title : 'Файл не выбран'}
                      </Typography>

                      <Stack spacing={0.8} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
                          <Typography variant="caption">Формат</Typography>
                          <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>
                            {selectedItem ? `${selectedItem.type.toUpperCase()} · ${selectedItem.tags.join(', ') || 'без меток'}` : '—'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
                          <Typography variant="caption">Размер</Typography>
                          <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>
                            {selectedItem ? `${(selectedItem.size / (1024 * 1024)).toFixed(1)} МБ` : '—'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
                          <Typography variant="caption">Добавлен</Typography>
                          <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>
                            {selectedItem ? selectedItem.createdAt : '—'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
                          <Typography variant="caption">Коллекция</Typography>
                          <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>
                            {selectedItem ? (selectedItem.tags[0] ? `#${selectedItem.tags[0]}` : 'без тега') : '—'}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                        <Button variant="contained" fullWidth sx={{ py: 1 }}>
                          Копировать ссылку
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0' }}>
                    <CardContent sx={{ p: 2.25 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Коллекции
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Все 24</Typography>
                      </Stack>

                      {!collectionsLoading && collections.map((collection) => (
                        <Box key={collection.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 2, bgcolor: '#f2f5f8', px: 1.2, py: 1.2, mb: 1 }}>
                          <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.4, bgcolor: '#dfeaff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FolderOutlined sx={{ fontSize: 16, color: '#2b5ae7' }} />
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{collection.name}</Typography>
                              <Typography variant="caption" color="text.secondary">{collection.mediaIds.length} файлов</Typography>
                            </Box>
                          </Stack>
                          <IconButton size="small"><MoreHoriz fontSize="small" /></IconButton>
                        </Box>
                      ))}
                    </CardContent>
                  </Card>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>
    </ThemeProvider>
  )
}

export default App
