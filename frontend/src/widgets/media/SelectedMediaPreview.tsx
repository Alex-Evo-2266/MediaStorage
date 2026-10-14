import { Close, NavigateBefore, NavigateNext, OpenInFull } from '@mui/icons-material'
import { Backdrop, Box, IconButton, Stack, Typography } from '@mui/material'
import type { MediaItem } from '../../types/media'

interface SelectedMediaPreviewProps {
  item: MediaItem | null
  open: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
}

export function SelectedMediaPreview({ item, open, onClose, onNext, onPrevious }: SelectedMediaPreviewProps) {
  if (!item || !open) {
    return null
  }

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 1400,
        bgcolor: 'rgba(7, 12, 18, 0.82)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 },
      }}
      onClick={onClose}
    >
      <Box
        onClick={(event) => event.stopPropagation()}
        sx={{
          position: 'relative',
          width: 'min(92vw, 1200px)',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: '#0d131b',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 28px 80px rgba(0,0,0,0.5)',
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 1.5, px: 2, borderBottom: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(15, 22, 31, 0.9)' }}>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <OpenInFull sx={{ fontSize: 18, color: '#dfe8ff' }} />
            <Typography variant="subtitle1" sx={{ color: '#edf3ff', fontWeight: 700 }}>
              {item.title}
            </Typography>
          </Stack>

          <IconButton onClick={onClose} size="small" sx={{ color: '#edf3ff' }}>
            <Close fontSize="small" />
          </IconButton>
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'stretch', minHeight: 0, overflow: 'hidden' }}>
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f1720', minHeight: 420 }}>
            <Box
              component="img"
              src={item.previewUrl}
              alt={item.title}
              sx={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '76vh',
                width: '100%',
                objectFit: 'contain',
              }}
            />
          </Box>

          <Stack sx={{ width: { xs: 0, md: 260 }, display: { xs: 'none', md: 'flex' }, p: 2, borderLeft: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(13, 19, 27, 0.95)' }}>
            <Typography variant="subtitle2" sx={{ color: '#edf3ff', fontWeight: 700, mb: 1.5 }}>
              Метаданные
            </Typography>
            <Stack spacing={1.2}>
              <Typography variant="body2" color="text.secondary">Тип: {item.type}</Typography>
              <Typography variant="body2" color="text.secondary">Размер: {item.size}</Typography>
              <Typography variant="body2" color="text.secondary">Дата: {item.createdAt}</Typography>
              <Typography variant="body2" color="text.secondary">Теги: {item.tags.join(', ') || '—'}</Typography>
            </Stack>
          </Stack>
        </Box>

        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', p: 1.5, px: 2, borderTop: '1px solid rgba(255,255,255,0.08)', bgcolor: 'rgba(15, 22, 31, 0.9)' }}>
          <IconButton onClick={onPrevious} disabled={!onPrevious} sx={{ color: '#edf3ff', border: '1px solid rgba(255,255,255,0.1)' }}>
            <NavigateBefore />
          </IconButton>

          <Typography variant="caption" sx={{ color: '#c1d0eb' }}>
            Главное содержимое · метаданные вторичны
          </Typography>

          <IconButton onClick={onNext} disabled={!onNext} sx={{ color: '#edf3ff', border: '1px solid rgba(255,255,255,0.1)' }}>
            <NavigateNext />
          </IconButton>
        </Stack>
      </Box>
    </Backdrop>
  )
}
