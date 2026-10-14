import { OpenInFull } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { MediaItem } from '../../types/media'
import { formatFileSize } from '../../utils/media'

interface SelectedMediaPanelProps {
  item: MediaItem | null
  onOpenPreview: () => void
}

function EmptySelectedMedia() {
  return (
    <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0', height: '100%' }}>
      <CardContent sx={{ p: 2.25, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 280 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
          Выбрано
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ничего не выбрано. Нажмите на файл в медиатеке, чтобы открыть его в этом блоке.
        </Typography>
      </CardContent>
    </Card>
  )
}

export function SelectedMediaPanel({ item, onOpenPreview }: SelectedMediaPanelProps) {
  if (!item) {
    return <EmptySelectedMedia />
  }

  const mediaLabel = item.type === 'image' ? 'Фото' : item.type === 'video' ? 'Видео' : 'Аудио'

  return (
    <Card sx={{ borderRadius: 3, bgcolor: '#f7f9fb', border: '1px solid #e5eaf0', overflow: 'hidden', height: '100%' }}>
      <CardContent sx={{ p: 2.25, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Выбрано
          </Typography>
          <Chip label={mediaLabel} size="small" variant="outlined" />
        </Stack>

        <Box
          onClick={onOpenPreview}
          sx={{
            position: 'relative',
            borderRadius: 2,
            overflow: 'hidden',
            border: '1px solid #e5eaf0',
            mb: 2,
            cursor: 'pointer',
            '&:hover .preview-overlay': { opacity: 1 },
          }}
        >
          <Box
            component="img"
            src={item.previewUrl}
            alt={item.title}
            sx={{
              width: '100%',
              height: 200,
              display: 'block',
              objectFit: 'cover',
            }}
          />

          <Box
            className="preview-overlay"
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'rgba(7, 12, 18, 0.28)',
              opacity: 0,
              transition: 'opacity 0.2s ease',
            }}
          >
            <Button
              variant="contained"
              startIcon={<OpenInFull fontSize="small" />}
              sx={{
                bgcolor: 'rgba(255,255,255,0.92)',
                color: '#111827',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' },
              }}
            >
              Открыть
            </Button>
          </Box>
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, lineHeight: 1.3 }}>
          {item.title}
        </Typography>

        <Stack spacing={0.9} sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
            <Typography variant="caption">Формат</Typography>
            <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>
              {item.type.toUpperCase()}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
            <Typography variant="caption">Размер</Typography>
            <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>
              {formatFileSize(item.size)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
            <Typography variant="caption">Добавлен</Typography>
            <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>
              {item.createdAt}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#5d6d82' }}>
            <Typography variant="caption">Теги</Typography>
            <Typography variant="caption" sx={{ color: '#202a39', fontWeight: 600 }}>
              {item.tags.length > 0 ? `#${item.tags.join(', #')}` : 'без меток'}
            </Typography>
          </Box>
        </Stack>

        <Button
          variant="contained"
          fullWidth
          startIcon={<OpenInFull fontSize="small" />}
          onClick={onOpenPreview}
          sx={{ mt: 2, py: 1 }}
        >
          Открыть в увеличенном виде
        </Button>
      </CardContent>
    </Card>
  )
}
