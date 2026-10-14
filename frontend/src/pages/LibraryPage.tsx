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
import type { MediaItem } from '../types/media'
import { formatFileSize } from '../utils/media'

interface LibraryPageProps {
  items: MediaItem[]
  loading?: boolean
}

const filterOptions = ['Все файлы', 'Недавно добавленные', 'Избранное', 'Фото', 'Видео', 'Аудио']

export function LibraryPage({ items, loading = false }: LibraryPageProps) {
  if (loading) {
    return (
      <Box sx={{ p: 3, borderRadius: 3, bgcolor: '#f7f9fc', border: '1px solid #e5eaf0' }}>
        <Typography variant="body1" color="text.secondary">Загрузка медиафайлов...</Typography>
      </Box>
    )
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#171d2a' }}>
          Медиатека
        </Typography>
        <Typography variant="caption" color="text.secondary">
          10 354 файла · обновлено сегодня в 09:42
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
            Изображения · 1240 файлов
          </Typography>
          <Button size="small" sx={{ color: '#53657a', textTransform: 'none' }}>
            Открыть раздел
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {items.slice(0, 4).map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#f7f9fc', border: '1px solid #e5eaf0' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia component="img" height="180" image={item.previewUrl} alt={item.title} sx={{ objectFit: 'cover' }} />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', right: 10, top: 10, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 999 }}
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
          ))}
        </Grid>
      </Box>

      <Box>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1f2735' }}>
            Видео · 860 файлов
          </Typography>
          <Button size="small" sx={{ color: '#53657a', textTransform: 'none' }}>
            Открыть раздел
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {items.slice(4, 6).map((item) => (
            <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#f7f9fc', border: '1px solid #e5eaf0' }}>
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
          ))}
        </Grid>
      </Box>

      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#1f2735' }}>
          Аудио · 3 214 треков
        </Typography>

        <Box sx={{ bgcolor: '#f7f9fc', border: '1px solid #e5eaf0', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '32px 1.2fr 1fr 1fr 1fr 30px', px: 2, py: 1.5, borderBottom: '1px solid #e5eaf0' }}>
            <Typography variant="caption" color="text.secondary">#</Typography>
            <Typography variant="caption" color="text.secondary">Название</Typography>
            <Typography variant="caption" color="text.secondary">Исполнитель</Typography>
            <Typography variant="caption" color="text.secondary">Формат</Typography>
            <Typography variant="caption" color="text.secondary">Размер</Typography>
            <Box />
          </Box>

          {['Мелодия рассвета', 'Выше домом', 'Ариадна'].map((track, index) => (
            <Box key={track} sx={{ display: 'grid', gridTemplateColumns: '32px 1.2fr 1fr 1fr 1fr 30px', px: 2, py: 1.3, alignItems: 'center', borderBottom: index === 2 ? 'none' : '1px solid #e5eaf0' }}>
              <Typography variant="body2" color="text.secondary">{String(index + 1).padStart(2, '0')}</Typography>
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <Box sx={{ width: 26, height: 26, borderRadius: 1, bgcolor: '#dde7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <PlayArrow sx={{ fontSize: 14, color: '#1d4ed8' }} />
                </Box>
                <Typography variant="body2">{track}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">{index === 0 ? 'Mujice' : index === 1 ? 'Сироткин' : 'Kedr Livanskiy'}</Typography>
              <Typography variant="body2" color="text.secondary">{index === 0 ? 'FLAC - 32 Бит' : 'MP3 - 9.4 МБ'}</Typography>
              <Typography variant="body2" color="text.secondary">{index === 0 ? '3.4 ГБ' : index === 1 ? '31 МБ' : '2.1 МБ'}</Typography>
              <IconButton size="small" sx={{ color: '#58687d' }}><OpenInNew fontSize="small" /></IconButton>
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  )
}
