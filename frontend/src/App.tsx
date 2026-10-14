import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  IconButton,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import { FolderOutlined, MoreHoriz } from '@mui/icons-material'
import { SidebarNavigation } from './components/navigation/SidebarNavigation'
import { TopBar } from './components/navigation/TopBar'
import { useMediaCollections } from './features/media/useMediaCollections'
import { useMediaLibrary } from './features/media/useMediaLibrary'
import { useStorageSummary } from './features/media/useStorageSummary'
import { LibraryPage } from './pages/LibraryPage'
import type { AppView } from './types/media'
import { UploadFilesCard } from './widgets/media/UploadFilesCard'

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
