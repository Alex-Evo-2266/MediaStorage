import { Close, NavigateBefore, NavigateNext, OpenInFull } from '@mui/icons-material'
import { Backdrop, Box, Card, CardContent, IconButton, Stack, Typography } from '@mui/material'
import { useEffect } from 'react'
import type { MediaItem } from '../../types/media'
import { formatFileSize } from '../../utils/media'

interface SelectedMediaPreviewProps {
  item: MediaItem | null
  open: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export function SelectedMediaPreview({ item, open, onClose, onNext, onPrevious }: SelectedMediaPreviewProps) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, open])

  if (!item || !open) {
    return null
  }

  const typeLabel = item.type === 'image' ? 'Фото' : item.type === 'video' ? 'Видео' : 'Аудио'

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 1400,
        bgcolor: 'rgba(7, 12, 18, 0.74)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1.5, sm: 2.5 },
      }}
      onClick={onClose}
    >
      <Card
        onClick={(event) => event.stopPropagation()}
        sx={{
          position: 'relative',
          width: 'min(92vw, 1180px)',
          maxHeight: '92vh',
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: '#f7f9fb',
          border: '1px solid #e5eaf0',
          boxShadow: '0 28px 80px rgba(0,0,0,0.38)',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 1.5, px: 2, borderBottom: '1px solid #e5eaf0', bgcolor: '#f2f5f8' }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <OpenInFull sx={{ fontSize: 18, color: '#2d5ef5' }} />
              <Typography variant="subtitle1" sx={{ color: '#1d2430', fontWeight: 700 }}>
                {item.title}
              </Typography>
            </Stack>

            <IconButton onClick={onClose} size="small" sx={{ color: '#314255' }}>
              <Close fontSize="small" />
            </IconButton>
          </Stack>

          <Box sx={{ display: 'flex', alignItems: 'stretch', minHeight: 0, overflow: 'hidden' }}>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#edf2f7', minHeight: { xs: 260, md: 360, xl: 420 } }}>
              <Box
                component="img"
                src={item.previewUrl}
                alt={item.title}
                sx={{
                  display: 'block',
                  maxWidth: '100%',
                  maxHeight: '70vh',
                  width: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>

            <Stack sx={{ width: { xs: 0, md: 260 }, display: { xs: 'none', md: 'flex' }, p: 2, borderLeft: '1px solid #e5eaf0', bgcolor: '#f2f5f8' }}>
              <Typography variant="subtitle2" sx={{ color: '#1d2430', fontWeight: 700, mb: 1.5 }}>
                Метаданные
              </Typography>
              <Stack spacing={1.2}>
                <Typography variant="body2" sx={{ color: '#4d5d73' }}>Тип: {typeLabel}</Typography>
                <Typography variant="body2" sx={{ color: '#4d5d73' }}>Размер: {formatFileSize(item.size)}</Typography>
                <Typography variant="body2" sx={{ color: '#4d5d73' }}>Дата: {item.createdAt}</Typography>
                <Typography variant="body2" sx={{ color: '#4d5d73' }}>Теги: {item.tags.join(', ') || '—'}</Typography>
              </Stack>
            </Stack>
          </Box>

          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 1.5, px: 2, borderTop: '1px solid #e5eaf0', bgcolor: '#f2f5f8' }}>
            <IconButton onClick={onPrevious} disabled={!onPrevious} sx={{ color: '#1d2430', border: '1px solid #dfe5ee', bgcolor: '#fff' }}>
              <NavigateBefore />
            </IconButton>

            <Typography variant="caption" sx={{ color: '#586f8c' }}>
              Главное содержимое · метаданные вторичны
            </Typography>

            <IconButton onClick={onNext} disabled={!onNext} sx={{ color: '#1d2430', border: '1px solid #dfe5ee', bgcolor: '#fff' }}>
              <NavigateNext />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Backdrop>
  )
}
