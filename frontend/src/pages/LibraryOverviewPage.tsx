import {
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import { FolderOutlined, MoreHoriz } from '@mui/icons-material'
import type { MediaFilter } from '../features/media/useLibraryFilters'
import type { MediaCollection, MediaItem } from '../types/media'
import { LibraryPage } from './LibraryPage'
import { SelectedMediaPanel } from '../widgets/media/SelectedMediaPanel'
import { UploadFilesCard } from '../widgets/media/UploadFilesCard'

interface LibraryOverviewPageProps {
  items: MediaItem[]
  loading: boolean
  selectedItemId: string | null
  onSelectItem: (item: MediaItem) => void
  collections: MediaCollection[]
  onOpenPreview: () => void
  filter?: MediaFilter
  onFilterChange?: (filter: MediaFilter) => void
}

export function LibraryOverviewPage({
  items,
  loading,
  selectedItemId,
  onSelectItem,
  collections,
  onOpenPreview,
  filter,
  onFilterChange,
}: LibraryOverviewPageProps) {
  const theme = useTheme()
  const showPreviewPanel = useMediaQuery(theme.breakpoints.up('xl'))
  const selectedItem = items.find((item) => item.id === selectedItemId) ?? null

  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      spacing={3}
      sx={{ minHeight: '100%', alignItems: 'stretch', width: '100%' }}
    >
      <Box sx={{ flex: 1, minWidth: 0, minHeight: 0, width: '100%' }}>
        <LibraryPage
          items={items}
          loading={loading}
          selectedItemId={selectedItemId}
          onSelectItem={onSelectItem}
          filter={filter}
          onFilterChange={onFilterChange}
        />
      </Box>

      <Stack spacing={2.5} sx={{ width: { xs: '100%', xl: 330 }, flexShrink: 0, minHeight: 0 }}>
        {showPreviewPanel ? <SelectedMediaPanel item={selectedItem} onOpenPreview={onOpenPreview} /> : null}
        <UploadFilesCard />

        <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0' }}>
          <CardContent sx={{ p: 2.25 }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Коллекции
              </Typography>
              <Typography variant="caption" color="text.secondary">Все {collections.length}</Typography>
            </Stack>

            {collections.map((collection) => (
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
  )
}
