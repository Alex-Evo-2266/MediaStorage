import { Box, Button, Chip, Grid, Stack, Typography } from '@mui/material'
import type { MediaItem } from '../../types/media'
import { MediaCard } from '../../widgets/media/ui/MediaCard'

interface MediaLibraryViewProps {
  items: MediaItem[]
  onSelectItem?: (item: MediaItem) => void
}

const filterOptions = [
  { id: 'all', label: 'Все файлы' },
  { id: 'recent', label: 'Недавно добавленные' },
  { id: 'favorite', label: 'Избранное' },
  { id: 'image', label: 'Фото' },
  { id: 'video', label: 'Видео' },
  { id: 'audio', label: 'Аудио' },
] as const

export function MediaLibraryView({ items, onSelectItem }: MediaLibraryViewProps) {
  return (
    <Stack spacing={2.5}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: '#171d2a' }}>
            Медиатека
          </Typography>
          <Typography variant="caption" color="text.secondary">
            10 354 файла · обновлено сегодня в 09:42
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button variant="contained" sx={{ borderRadius: 2, textTransform: 'none', bgcolor: '#1e5bff' }}>
            Загрузить файлы
          </Button>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {filterOptions.map((option, index) => (
          <Button
            key={option.id}
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
            {option.label}
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
              <MediaCard item={item} onSelect={onSelectItem} />
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
              <MediaCard item={item} variant="video" onSelect={onSelectItem} />
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
                  <Chip label="▶" size="small" sx={{ minWidth: 0, height: 18, fontSize: 10, bgcolor: 'transparent', color: '#1d4ed8', padding: 0 }} />
                </Box>
                <Typography variant="body2">{track}</Typography>
              </Stack>
              <Typography variant="body2" color="text.secondary">{index === 0 ? 'Mujice' : index === 1 ? 'Сироткин' : 'Kedr Livanskiy'}</Typography>
              <Typography variant="body2" color="text.secondary">{index === 0 ? 'FLAC - 32 Бит' : 'MP3 - 9.4 МБ'}</Typography>
              <Typography variant="body2" color="text.secondary">{index === 0 ? '3.4 ГБ' : index === 1 ? '31 МБ' : '2.1 МБ'}</Typography>
              <Button size="small" sx={{ minWidth: 0, color: '#58687d', p: 0 }}>
                ↗
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
    </Stack>
  )
}
