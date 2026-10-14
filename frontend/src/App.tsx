import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  CssBaseline,
  IconButton,
  Stack,
  ThemeProvider,
  Typography,
  createTheme,
} from '@mui/material'
import { FolderOutlined, MoreHoriz } from '@mui/icons-material'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SidebarNavigation } from './components/navigation/SidebarNavigation'
import { TopBar } from './components/navigation/TopBar'
import { useMediaCollections } from './features/media/useMediaCollections'
import { useMediaLibrary } from './features/media/useMediaLibrary'
import { useStorageSummary } from './features/media/useStorageSummary'
import { CollectionsPage } from './pages/CollectionsPage'
import { LibraryPage } from './pages/LibraryPage'
import { UploadPage } from './pages/UploadPage'
import type { AppView, MediaItem } from './types/media'
import { SelectedMediaPanel } from './widgets/media/SelectedMediaPanel'
import { SelectedMediaPreview } from './widgets/media/SelectedMediaPreview'
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

const viewToPath: Record<AppView, string> = {
  library: '/library',
  images: '/images',
  videos: '/videos',
  audio: '/audio',
  collections: '/collections',
  upload: '/upload',
}

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { items: mediaItems, loading: mediaLoading } = useMediaLibrary()
  const { items: collections, loading: collectionsLoading } = useMediaCollections()
  const { summary: storageSummary } = useStorageSummary()

  useEffect(() => {
    if (!mediaItems.length) {
      setSelectedItemId(null)
      return
    }

    if (!selectedItemId || !mediaItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(mediaItems[0].id)
    }
  }, [mediaItems, selectedItemId])

  const activeView = useMemo<AppView>(() => {
    switch (location.pathname) {
      case '/':
      case '/library':
        return 'library'
      case '/images':
        return 'images'
      case '/videos':
        return 'videos'
      case '/audio':
        return 'audio'
      case '/collections':
        return 'collections'
      case '/upload':
        return 'upload'
      default:
        return 'library'
    }
  }, [location.pathname])

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

  const title = useMemo(() => {
    if (activeView === 'images') return 'Фото'
    if (activeView === 'videos') return 'Видео'
    if (activeView === 'audio') return 'Музыка'
    if (activeView === 'collections') return 'Коллекции'
    if (activeView === 'upload') return 'Добавление файлов'
    return 'Медиатека'
  }, [activeView])

  const selectedItem = mediaItems.find((item) => item.id === selectedItemId) ?? null
  const selectedIndex = selectedItem ? mediaItems.findIndex((item) => item.id === selectedItem.id) : -1

  const handleSelectItem = (item: MediaItem) => {
    setSelectedItemId(item.id)
    setIsPreviewOpen(false)
  }

  const handleViewChange = (view: AppView) => {
    navigate(viewToPath[view])
  }

  const handlePrevious =
    selectedIndex > 0 ? () => setSelectedItemId(mediaItems[selectedIndex - 1].id) : undefined
  const handleNext =
    selectedIndex >= 0 && selectedIndex < mediaItems.length - 1
      ? () => setSelectedItemId(mediaItems[selectedIndex + 1].id)
      : undefined

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#edf1f5', color: '#1d2430', p: { xs: 0, md: 1 }, overflow: 'hidden' }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ minHeight: '100vh', height: '100vh' }}>
          <SidebarNavigation
            activeView={activeView}
            onViewChange={handleViewChange}
            storageSummary={storageSummary}
            totalCollections={collections.length}
            mediaCounts={mediaCounts}
          />

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, overflow: 'hidden' }}>
            <TopBar title={title} searchValue={searchValue} onSearchChange={setSearchValue} />

            <Box sx={{ p: { xs: 2, md: 3 }, flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
              <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3} sx={{ minHeight: '100%', alignItems: 'flex-start' }}>
                <Box sx={{ flex: 1, minWidth: 0, minHeight: 0 }}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/library" replace />} />
                    <Route
                      path="/library"
                      element={
                        <LibraryPage
                          items={filteredMedia}
                          loading={mediaLoading}
                          selectedItemId={selectedItemId}
                          onSelectItem={handleSelectItem}
                        />
                      }
                    />
                    <Route
                      path="/images"
                      element={
                        <LibraryPage
                          items={filteredMedia.filter((item) => item.type === 'image')}
                          view="image"
                          loading={mediaLoading}
                          selectedItemId={selectedItemId}
                          onSelectItem={handleSelectItem}
                        />
                      }
                    />
                    <Route
                      path="/videos"
                      element={
                        <LibraryPage
                          items={filteredMedia.filter((item) => item.type === 'video')}
                          view="video"
                          loading={mediaLoading}
                          selectedItemId={selectedItemId}
                          onSelectItem={handleSelectItem}
                        />
                      }
                    />
                    <Route
                      path="/audio"
                      element={
                        <LibraryPage
                          items={filteredMedia.filter((item) => item.type === 'audio')}
                          view="audio"
                          loading={mediaLoading}
                          selectedItemId={selectedItemId}
                          onSelectItem={handleSelectItem}
                        />
                      }
                    />
                    <Route path="/collections" element={<CollectionsPage collections={collections} />} />
                    <Route path="/upload" element={<UploadPage />} />
                  </Routes>
                </Box>

                <Stack spacing={2.5} sx={{ width: { xs: '100%', xl: 330 }, flexShrink: 0, minHeight: 0 }}>
                  <UploadFilesCard />
                  <SelectedMediaPanel item={selectedItem} onOpenPreview={() => setIsPreviewOpen(true)} />

                  <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0' }}>
                    <CardContent sx={{ p: 2.25 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Коллекции
                        </Typography>
                        <Typography variant="caption" color="text.secondary">Все {collections.length}</Typography>
                      </Stack>

                      {!collectionsLoading && collections.map((collection) => (
                        <Box
                          key={collection.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 2,
                            bgcolor: '#f2f5f8',
                            px: 1.2,
                            py: 1.2,
                            mb: 1,
                          }}
                        >
                          <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: 1.4,
                                bgcolor: '#dfeaff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <FolderOutlined sx={{ fontSize: 16, color: '#2b5ae7' }} />
                            </Box>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>{collection.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {collection.mediaIds.length} файлов
                              </Typography>
                            </Box>
                          </Stack>
                          <IconButton size="small">
                            <MoreHoriz fontSize="small" />
                          </IconButton>
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

      <SelectedMediaPreview
        item={selectedItem}
        open={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </ThemeProvider>
  )
}

export default App
