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
import {
  CloudUploadOutlined,
  DeleteOutlined,
  FileCopyOutlined,
  FolderOutlined,
  MoreHoriz,
} from '@mui/icons-material'
import { SidebarNavigation } from './components/navigation/SidebarNavigation'
import { TopBar } from './components/navigation/TopBar'
import { mockCollections, mockMedia } from './data/mockMedia'
import { LibraryPage } from './pages/LibraryPage'
import type { AppView } from './types/media'

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

  const filteredMedia = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return mockMedia
    return mockMedia.filter((item) => item.title.toLowerCase().includes(query))
  }, [searchValue])

  const selectedItem = mockMedia[4]

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: '#edf1f5', color: '#1d2430', p: { xs: 0, md: 1 } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} sx={{ minHeight: '100vh' }}>
          <SidebarNavigation activeView={activeView} onViewChange={setActiveView} />

          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <TopBar
              title={activeView === 'collections' ? 'Коллекции' : activeView === 'upload' ? 'Добавление файлов' : 'Медиатека'}
              searchValue={searchValue}
              onSearchChange={setSearchValue}
            />

            <Box sx={{ p: { xs: 2, md: 3 }, flex: 1 }}>
              <Stack direction={{ xs: 'column', xl: 'row' }} spacing={3} sx={{ height: '100%' }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <LibraryPage items={filteredMedia} />
                </Box>

                <Stack spacing={2.5} sx={{ width: { xs: '100%', xl: 330 } }}>
                  <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0' }}>
                    <CardContent sx={{ p: 2.25 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Загрузить файлы
                        </Typography>
                        <IconButton size="small"><CloudUploadOutlined fontSize="small" /></IconButton>
                      </Stack>

                      <Button variant="contained" fullWidth sx={{ borderRadius: 2, mb: 1.5, py: 1 }}>
                        Выбрать файлы
                      </Button>

                      <Typography variant="caption" color="text.secondary">
                        Перетащите файлы в окно или выберите вручную.
                      </Typography>

                      <Box sx={{ mt: 2.5, p: 1.5, borderRadius: 2, bgcolor: '#f0f5ff', border: '1px solid #dfeafb' }}>
                        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ width: 28, height: 28, borderRadius: 1.5, bgcolor: '#dbe7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <FileCopyOutlined fontSize="small" sx={{ color: '#2354d7' }} />
                            </Box>
                            <Box>
                              <Typography variant="caption" sx={{ fontWeight: 600 }}>ПВХ 2026.mp4</Typography>
                              <Typography variant="caption" color="text.secondary">248 МБ · 1:42</Typography>
                            </Box>
                          </Box>
                          <IconButton size="small"><DeleteOutlined fontSize="small" /></IconButton>
                        </Stack>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0' }}>
                    <CardContent sx={{ p: 2.25 }}>
                      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Выбрано
                        </Typography>
                        <Chip label="фото" size="small" variant="outlined" />
                      </Stack>

                      <Box sx={{ borderRadius: 2, overflow: 'hidden', border: '1px solid #e5eaf0', mb: 2 }}>
                        <Box component="img" src={selectedItem.previewUrl} sx={{ width: '100%', height: 170, objectFit: 'cover', display: 'block' }} />
                      </Box>

                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Закат над морем
                      </Typography>

                      <Stack spacing={0.8} sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
                          <Typography variant="caption">Формат</Typography>
                          <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>JPG — 6000 × 4000</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
                          <Typography variant="caption">Размер</Typography>
                          <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>8,4 МБ</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
                          <Typography variant="caption">Добавлен</Typography>
                          <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>12 октября 2026</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
                          <Typography variant="caption">Коллекция</Typography>
                          <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>#отпуск</Typography>
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

                      {mockCollections.map((collection) => (
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
