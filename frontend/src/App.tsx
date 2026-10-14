import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  CssBaseline,
  Stack,
  ThemeProvider,
  createTheme,
} from '@mui/material'
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
import { SelectedMediaPreview } from './widgets/media/SelectedMediaPreview'

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
  const { items: collections } = useMediaCollections()
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
  const isMediaSectionPage = activeView === 'images' || activeView === 'videos' || activeView === 'audio'

  const handleSelectItem = (item: MediaItem) => {
    setSelectedItemId(item.id)
    setIsPreviewOpen(isMediaSectionPage)
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
              <Stack
                direction={{ xs: 'column', xl: 'row' }}
                spacing={3}
                sx={{ minHeight: '100%', alignItems: 'flex-start' }}
              >
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
