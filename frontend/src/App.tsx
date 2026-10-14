import { useMemo, useState } from 'react'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { AppLayout } from './components/layout/AppLayout'
import { SidebarNavigation } from './components/navigation/SidebarNavigation'
import { TopBar } from './components/navigation/TopBar'
import { mockCollections, mockMedia } from './data/mockMedia'
import { CollectionsPage } from './pages/CollectionsPage'
import { LibraryPage } from './pages/LibraryPage'
import { UploadPage } from './pages/UploadPage'
import type { AppView } from './types/media'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#8ab4ff' },
    secondary: { main: '#c8b6ff' },
    background: {
      default: '#101418',
      paper: '#1a212a',
    },
    text: {
      primary: '#f3f6fb',
      secondary: '#aab5c2',
    },
  },
  typography: {
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 12px 30px rgba(0,0,0,0.20)',
          border: '1px solid rgba(255,255,255,0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
        },
      },
    },
  },
})

function App() {
  const [activeView, setActiveView] = useState<AppView>('library')
  const [searchValue, setSearchValue] = useState('')

  const filteredMedia = useMemo(() => {
    const query = searchValue.trim().toLowerCase()

    if (!query) {
      return mockMedia
    }

    return mockMedia.filter((item) => item.title.toLowerCase().includes(query))
  }, [searchValue])

  const titleMap: Record<AppView, string> = {
    library: 'Медиатека',
    collections: 'Коллекции',
    upload: 'Добавление файлов',
  }

  const pageContent = (() => {
    switch (activeView) {
      case 'collections':
        return <CollectionsPage collections={mockCollections} />
      case 'upload':
        return <UploadPage />
      case 'library':
      default:
        return <LibraryPage items={filteredMedia} />
    }
  })()

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppLayout
        sidebar={<SidebarNavigation activeView={activeView} onViewChange={setActiveView} />}
        topbar={<TopBar title={titleMap[activeView]} searchValue={searchValue} onSearchChange={setSearchValue} />}
        content={pageContent}
      />
    </ThemeProvider>
  )
}

export default App
