import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material'
import type { MediaItem } from '../types/media'
import { formatFileSize } from '../utils/media'

interface LibraryPageProps {
  items: MediaItem[]
}

export function LibraryPage({ items }: LibraryPageProps) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
          Медиатека
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Здесь будет список изображений, видео и аудиофайлов.
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card sx={{ height: '100%', bgcolor: 'background.paper' }}>
              <CardMedia
                component="img"
                height="180"
                image={item.previewUrl}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Chip
                      label={item.type}
                      size="small"
                      color={item.type === 'video' ? 'secondary' : item.type === 'audio' ? 'info' : 'primary'}
                    />
                  </Stack>

                  <Typography variant="body2" color="text.secondary">
                    {formatFileSize(item.size)}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    {item.tags.map((tag) => (
                      <Chip key={`${item.id}-${tag}`} label={tag} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  )
}
