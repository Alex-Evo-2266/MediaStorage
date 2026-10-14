import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import { FavoriteBorder, PlayArrow, OpenInNew } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import type { MediaItem } from '../types/media'
import { formatFileSize } from '../utils/media'

type LibraryView = 'all' | 'image' | 'video' | 'audio'

interface LibraryPageProps {
  items: MediaItem[]
  view?: LibraryView
  loading?: boolean
  selectedItemId?: string | null
  onSelectItem?: (item: MediaItem) => void
}

const filterOptions = ['Все файлы', 'Недавно добавленные', 'Избранное', 'Фото', 'Видео', 'Аудио']

export function LibraryPage({ items, view = 'all', loading = false, selectedItemId, onSelectItem }: LibraryPageProps) {
  const navigate = useNavigate()

  const titleByView: Record<LibraryView, string> = {
    all: 'Медиатека',
    image: 'Фото',
    video: 'Видео',
    audio: 'Музыка',
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, borderRadius: 3, bgcolor: '#f7f9fc', border: '1px solid #e5eaf0' }}>
        <Typography variant="body1" color="text.secondary">Загрузка медиафайлов...</Typography>
      </Box>
    )
  }

  const currentTitle = titleByView[view]

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#171d2a' }}>
          {currentTitle}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {items.length} файлов · обновлено сегодня в 09:42
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {filterOptions.map((option, index) => (
          <Button
            key={option}
            variant={index === 0 ? 'contained' : 'text'}
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: index === 0 ? '#e8eefb' : 'transparent',
              color: index === 0 ? '#1d4ed8' : '#4c5d73',
              fontWeight: index === 0 ? 700 : 500,
              px: 1.5,
            }}
          >
            {option}
          </Button>
        ))}
      </Stack>

      <Box>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2735' }}>
            Изображения · {items.filter((item) => item.type === 'image').length} файлов
          </Typography>
          <Button
            size="small"
            sx={{ color: '#53657a', textTransform: 'none' }}
            onClick={() => navigate('/images')}
          >
            Открыть раздел
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {(view === 'image' ? items : items.filter((item) => item.type === 'image')).slice(0, 4).map((item) => {
            const isSelected = item.id === selectedItemId

            return (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  onClick={() => onSelectItem?.(item)}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: '#f7f9fc',
                    border: isSelected ? '2px solid #2d5ef5' : '1px solid #e5eaf0',
                    boxShadow: isSelected ? '0 0 0 3px rgba(45, 94, 245, 0.12)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#b7c9ff' },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia component="img" height="180" image={item.previewUrl} alt={item.title} sx={{ objectFit: 'cover' }} />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', right: 10, top: 10, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 999 }}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <FavoriteBorder fontSize="small" />
                    </IconButton>
                  </Box>
                  <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1d2330' }}>
                          {item.title}
                        </Typography>
                        <Chip label={item.type} size="small" variant="outlined" sx={{ height: 22, fontSize: 10 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {item.type === 'video' ? `${item.duration ?? '00:30'} · ${formatFileSize(item.size)}` : formatFileSize(item.size)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>

      <Box>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2735' }}>
            Видео · {items.filter((item) => item.type === 'video').length} файлов
          </Typography>
          <Button
            size="small"
            sx={{ color: '#53657a', textTransform: 'none' }}
            onClick={() => navigate('/videos')}
          >
            Открыть раздел
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {(view === 'video' ? items : items.filter((item) => item.type === 'video')).slice(0, 4).map((item) => {
            const isSelected = item.id === selectedItemId

            return (
              <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card
                  onClick={() => onSelectItem?.(item)}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    bgcolor: '#f7f9fc',
                    border: isSelected ? '2px solid #2d5ef5' : '1px solid #e5eaf0',
                    boxShadow: isSelected ? '0 0 0 3px rgba(45, 94, 245, 0.12)' : 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': { borderColor: '#b7c9ff' },
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia component="img" height="180" image={item.previewUrl} alt={item.title} sx={{ objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.12)' }}>
                      <PlayArrow sx={{ fontSize: 38, color: '#fff' }} />
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1d2330' }}>
                          {item.title}
                        </Typography>
                        <Chip label={item.type} size="small" variant="outlined" sx={{ height: 22, fontSize: 10 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {item.duration ?? '00:45'} · {formatFileSize(item.size)}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2735' }}>
            Аудио · {items.filter((item) => item.type === 'audio').length} треков
          </Typography>
          <Button
            size="small"
            sx={{ color: '#53657a', textTransform: 'none' }}
            onClick={() => navigate('/audio')}
          >
            Открыть раздел
          </Button>
        </Stack>

        <Box sx={{ bgcolor: '#f7f9fc', border: '1px solid #e5eaf0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '32px 1.2fr 1fr 1fr 1fr 30px', px: 2, py: 1.5, borderBottom: '1px solid #e5eaf0' }}>
            <Typography variant="caption" color="text.secondary">#</Typography>
            <Typography variant="caption" color="text.secondary">Название</Typography>
            <Typography variant="caption" color="text.secondary">Исполнитель</Typography>
            <Typography variant="caption" color="text.secondary">Формат</Typography>
            <Typography variant="caption" color="text.secondary">Размер</Typography>
            <Box />
          </Box>

          {(view === 'audio' ? items : items.filter((item) => item.type === 'audio')).slice(0, 3).map((track, index) => (
            <Box key={track.id} sx={{ display: 'grid', gridTemplateColumns: '32px 1.2fr 1fr 1fr 1fr 30px', px: 2, py: 1.3, alignItems: 'center', borderBottom: index === 2 ? 'none' : '1px solid #e5eaf0' }}>
              <Typography variant="body2" color="text.secondary">{String(index + 1).padStart(2, '0')}</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 26, height: 26, borderRadius: 1, bgcolor: '#dde7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlayArrow sx={{ fontSize: 14, color: '#1d4ed8' }} />
                </Box>
                <Typography variant="body2">{track.title}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">{index === 0 ? 'Mujice' : index === 1 ? 'Сироткин' : 'Kedr Livanskiy'}</Typography>
              <Typography variant="body2" color="text.secondary">{index === 0 ? 'FLAC - 32 Бит' : 'MP3 - 9.4 МБ'}</Typography>
              <Typography variant="body2" color="text.secondary">{formatFileSize(track.size)}</Typography>
              <IconButton size="small" sx={{ color: '#58687d' }}><OpenInNew fontSize="small" /></IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  )
}
