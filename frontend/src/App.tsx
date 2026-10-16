import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Alert,
  Button,
  CircularProgress,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Stack,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { SidebarNavigation } from './components/navigation/SidebarNavigation'
import { TopBar } from './components/navigation/TopBar'
import { useLibraryFilters } from './features/media/useLibraryFilters'
import { useMediaCollections } from './features/media/useMediaCollections'
import { useMediaLibrary } from './features/media/useMediaLibrary'
import { useStorageSummary } from './features/media/useStorageSummary'
import { CollectionsPage } from './pages/CollectionsPage'
import { LibraryOverviewPage } from './pages/LibraryOverviewPage'
import { LibraryPage } from './pages/LibraryPage'
import { UploadPage } from './pages/UploadPage'
import type { AppView, MediaItem } from './types/media'
import { SelectedMediaPreview } from './widgets/media/SelectedMediaPreview'
import { AuthPanel } from './features/auth/AuthPanel'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './shared/api/supabaseClient'
import { getSafeErrorContext, logger } from './shared/lib/logger'

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
  const [session, setSession] = useState<Session | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [sessionError, setSessionError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    let authStateChanged = false

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (event !== 'INITIAL_SESSION') {
        authStateChanged = true
      }
      if (!isMounted) return

      setSession(newSession)
      setSessionLoading(false)
      if (newSession) setSessionError(null)
    })

    void supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!isMounted || authStateChanged) return

        if (error) {
          logger.error('auth.session.restore.failed', {
            operation: 'auth.get_session',
            ...getSafeErrorContext(error),
          })
        }
        setSession(data.session)
        setSessionError(error?.message ?? null)
        setSessionLoading(false)
      })
      .catch((error: unknown) => {
        if (!isMounted || authStateChanged) return

        logger.error('auth.session.restore.failed', {
          operation: 'auth.get_session',
          ...getSafeErrorContext(error),
        })
        setSession(null)
        setSessionError(
          error instanceof Error ? error.message : 'Не удалось проверить сессию.',
        )
        setSessionLoading(false)
      })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {sessionLoading ? (
        <Box
          sx={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#101418',
          }}
        >
          <CircularProgress aria-label="Проверка авторизации" />
        </Box>
      ) : session ? (
        <AuthenticatedApp key={session.user.id} session={session} />
      ) : (
        <AuthPanel sessionError={sessionError} />
      )}
    </ThemeProvider>
  )
}

interface AuthenticatedAppProps {
  session: Session
}

function AuthenticatedApp({ session }: AuthenticatedAppProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [signingOut, setSigningOut] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isMediaMutationPending, setIsMediaMutationPending] = useState(false)
  const [mediaActionMessage, setMediaActionMessage] = useState<{ text: string; severity: 'success' | 'error' } | null>(null)
  const [selectionResetByDelete, setSelectionResetByDelete] = useState(false)

  const {
    items: mediaItems,
    loading: mediaLoading,
    error: mediaError,
    refresh: refreshMedia,
    renameItem,
    deleteItem,
  } = useMediaLibrary()
  const {
    items: collections,
    createCollection,
    addMediaToCollection,
    removeMediaFromCollection,
    deleteCollection,
  } = useMediaCollections()
  const { summary: storageSummary } = useStorageSummary()
  const { query: searchValue, setQuery: setSearchValue, filter, setFilter, filteredItems } = useLibraryFilters(mediaItems)

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

  const filteredMedia = filteredItems

  const title = useMemo(() => {
    if (activeView === 'images') return 'Фото'
    if (activeView === 'videos') return 'Видео'
    if (activeView === 'audio') return 'Музыка'
    if (activeView === 'collections') return 'Коллекции'
    if (activeView === 'upload') return 'Добавление файлов'
    return 'Медиатека'
  }, [activeView])

  const previewItems = useMemo(() => {
    if (activeView === 'images') return filteredMedia.filter((item) => item.type === 'image')
    if (activeView === 'videos') return filteredMedia.filter((item) => item.type === 'video')
    if (activeView === 'audio') return filteredMedia.filter((item) => item.type === 'audio')
    return filteredMedia
  }, [activeView, filteredMedia])

  const visibleSelectedItemId = selectionResetByDelete
    ? selectedItemId
    : previewItems.find((item) => item.id === selectedItemId)?.id ??
      previewItems[0]?.id ??
      null
  const selectedItem =
    previewItems.find((item) => item.id === visibleSelectedItemId) ?? null
  const selectedIndex = selectedItem ? previewItems.findIndex((item) => item.id === selectedItem.id) : -1

  const handleSelectItem = (item: MediaItem) => {
    setSelectionResetByDelete(false)
    setSelectedItemId(item.id)
    setIsPreviewOpen(true)
  }

  const handleOpenRename = () => {
    if (!selectedItem) return
    setRenameValue(selectedItem.title)
    setRenameDialogOpen(true)
  }

  const handleRename = async () => {
    if (!selectedItem || !renameValue.trim()) return
    setIsMediaMutationPending(true)
    try {
      await renameItem(selectedItem.id, renameValue)
      setRenameDialogOpen(false)
      setMediaActionMessage({ text: 'Название файла обновлено.', severity: 'success' })
    } catch (error) {
      setMediaActionMessage({
        text: error instanceof Error ? error.message : 'Не удалось изменить название файла.',
        severity: 'error',
      })
    } finally {
      setIsMediaMutationPending(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    const deletedItemId = selectedItem.id
    setIsMediaMutationPending(true)
    try {
      await deleteItem(deletedItemId)
      setDeleteDialogOpen(false)
      setSelectedItemId(null)
      setSelectionResetByDelete(true)
      setIsPreviewOpen(false)
      setMediaActionMessage({ text: 'Файл удалён.', severity: 'success' })
    } catch (error) {
      setMediaActionMessage({
        text: error instanceof Error ? error.message : 'Не удалось удалить файл.',
        severity: 'error',
      })
    } finally {
      setIsMediaMutationPending(false)
    }
  }

  const handleViewChange = (view: AppView) => {
    navigate(viewToPath[view])
  }

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      logger.info('auth.sign_out.succeeded', { operation: 'auth.sign_out' })
    } catch (error) {
      logger.error('auth.sign_out.failed', {
        operation: 'auth.sign_out',
        ...getSafeErrorContext(error),
      })
      setMediaActionMessage({
        text: error instanceof Error ? error.message : 'Не удалось выйти из аккаунта.',
        severity: 'error',
      })
    } finally {
      setSigningOut(false)
    }
  }

  const handlePrevious =
    selectedIndex > 0 ? () => setSelectedItemId(previewItems[selectedIndex - 1].id) : undefined
  const handleNext =
    selectedIndex >= 0 && selectedIndex < previewItems.length - 1
      ? () => setSelectedItemId(previewItems[selectedIndex + 1].id)
      : undefined

  return (
    <>
      <Box sx={{ minHeight: '100vh', bgcolor: '#edf1f5', color: '#1d2430', p: { xs: 0, md: 1 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ minHeight: '100vh', width: '100%' }}>
          <SidebarNavigation
            activeView={activeView}
            onViewChange={handleViewChange}
            storageSummary={storageSummary}
            totalCollections={collections.length}
            mediaCounts={mediaCounts}
          />

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0 }}>
            <TopBar
              title={title}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              userEmail={session.user.email ?? session.user.phone ?? 'Пользователь'}
              onSignOut={() => void handleSignOut()}
              signingOut={signingOut}
            />

            <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 }, flex: 1, minHeight: 0, overflowY: 'auto', overflowX: 'hidden' }}>
              {mediaError && (
                <Alert
                  severity="error"
                  sx={{ mb: 2 }}
                  action={
                    <Button
                      color="inherit"
                      size="small"
                      onClick={() => void refreshMedia()}
                    >
                      Повторить
                    </Button>
                  }
                >
                  {mediaError}
                </Alert>
              )}
              <Routes>
                <Route path="/" element={<Navigate to="/library" replace />} />
                <Route
                  path="/library"
                  element={
                    <LibraryOverviewPage
                      items={filteredMedia}
                      loading={mediaLoading}
                      selectedItemId={visibleSelectedItemId}
                      onSelectItem={handleSelectItem}
                      collections={collections}
                      onOpenPreview={() => setIsPreviewOpen(true)}
                      onRename={handleOpenRename}
                      onDelete={() => setDeleteDialogOpen(true)}
                      actionsDisabled={isMediaMutationPending}
                      onUploadComplete={refreshMedia}
                      filter={filter}
                      onFilterChange={setFilter}
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
                      selectedItemId={visibleSelectedItemId}
                      onSelectItem={handleSelectItem}
                      filter={filter}
                      onFilterChange={setFilter}
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
                      selectedItemId={visibleSelectedItemId}
                      onSelectItem={handleSelectItem}
                      filter={filter}
                      onFilterChange={setFilter}
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
                      selectedItemId={visibleSelectedItemId}
                      onSelectItem={handleSelectItem}
                      filter={filter}
                      onFilterChange={setFilter}
                    />
                  }
                />
                <Route
                  path="/collections"
                  element={
                    <CollectionsPage
                      collections={collections}
                      mediaItems={mediaItems}
                      onCreateCollection={createCollection}
                      onAddMediaToCollection={addMediaToCollection}
                      onRemoveMediaFromCollection={removeMediaFromCollection}
                      onDeleteCollection={deleteCollection}
                    />
                  }
                />
                <Route path="/upload" element={<UploadPage />} />
              </Routes>
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
        onRename={handleOpenRename}
        onDelete={() => setDeleteDialogOpen(true)}
        actionsDisabled={isMediaMutationPending}
      />
      <Dialog
        open={renameDialogOpen}
        onClose={() => !isMediaMutationPending && setRenameDialogOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Изменить название</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Название файла"
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            disabled={isMediaMutationPending}
            error={!renameValue.trim()}
            helperText={!renameValue.trim() ? 'Название не может быть пустым.' : ' '}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameDialogOpen(false)} disabled={isMediaMutationPending}>Отмена</Button>
          <Button
            onClick={() => void handleRename()}
            variant="contained"
            disabled={isMediaMutationPending || !renameValue.trim()}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !isMediaMutationPending && setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Удалить файл?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Файл «{selectedItem?.title}» и его объекты в хранилище будут удалены без возможности восстановления.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={isMediaMutationPending}>Отмена</Button>
          <Button onClick={() => void handleDelete()} color="error" variant="contained" disabled={isMediaMutationPending}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={Boolean(mediaActionMessage)}
        autoHideDuration={6000}
        onClose={() => setMediaActionMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {mediaActionMessage ? (
          <Alert onClose={() => setMediaActionMessage(null)} severity={mediaActionMessage.severity} variant="filled">
            {mediaActionMessage.text}
          </Alert>
        ) : undefined}
      </Snackbar>
    </>
  )
}

export default App
