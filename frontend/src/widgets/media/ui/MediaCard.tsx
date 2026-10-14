import { Card, CardContent, CardMedia, Chip, IconButton, Stack, Typography } from '@mui/material'
import { FavoriteBorder, PlayArrow } from '@mui/icons-material'
import type { MediaItem } from '../../../types/media'
import { formatFileSize } from '../../../utils/media'

interface MediaCardProps {
  item: MediaItem
  variant?: 'image' | 'video'
  onSelect?: (item: MediaItem) => void
}

export function MediaCard({ item, variant = 'image', onSelect }: MediaCardProps) {
  return (
    <Card
      sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: '#f7f9fc', border: '1px solid #e5eaf0', cursor: 'pointer' }}
      onClick={() => onSelect?.(item)}
    >
      <CardMedia component="img" height="180" image={item.previewUrl} alt={item.title} sx={{ objectFit: 'cover' }} />

      {variant === 'video' ? (
        <Stack
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.12)',
            pointerEvents: 'none',
          }}
        >
          <PlayArrow sx={{ fontSize: 38, color: '#fff' }} />
        </Stack>
      ) : null}

      <IconButton
        size="small"
        sx={{ position: 'absolute', right: 10, top: 10, bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 999 }}
        onClick={(event) => event.stopPropagation()}
      >
        <FavoriteBorder fontSize="small" />
      </IconButton>

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
  )
}
