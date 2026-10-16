
import {
  Alert,
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
import {
  PlayArrow,
  OpenInNew,
  SearchOff,
  MusicNote,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import type { MediaFilter } from '../features/media/useLibraryFilters'
import type { MediaItem } from '../types/media'
import { formatFileSize } from '../utils/media'

type LibraryView = 'all' | 'image' | 'video' | 'audio'

interface LibraryPageProps {
  items: MediaItem[]
  view?: LibraryView
  loading?: boolean
  selectedItemId?: string | null
  onSelectItem?: (item: MediaItem) => void
  filter?: MediaFilter
  onFilterChange?: (filter: MediaFilter) => void
}

const filterOptions: Array<{ id: MediaFilter; label: string }> = [
  { id: 'all', label: 'Все файлы' },
  { id: 'image', label: 'Фото' },
  { id: 'video', label: 'Видео' },
  { id: 'audio', label: 'Аудио' },
]

export function LibraryPage({
  items,
  view = 'all',
  loading = false,
  selectedItemId,
  onSelectItem,
  filter = 'all',
  onFilterChange,
}: LibraryPageProps) {
  const navigate = useNavigate()

  const titleByView: Record<LibraryView, string> = {
    all: 'Медиатека',
    image: 'Фото',
    video: 'Видео',
    audio: 'Музыка',
  }

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          bgcolor: '#f7f9fc',
          border: '1px solid #e5eaf0',
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Загрузка медиафайлов...
        </Typography>
      </Box>
    )
  }

  const currentTitle = titleByView[view]
  const isSingleTypeView = view !== 'all'
  const sectionItems = items

  const renderEmptyState = (message: string) => (
    <Alert
      icon={<SearchOff fontSize="inherit" />}
      severity="info"
      sx={{
        borderRadius: 3,
        border: '1px solid #dfe7ff',
        bgcolor: '#f4f7ff',
        color: '#27406d',
        '& .MuiAlert-message': { width: '100%' },
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
        Ничего не найдено
      </Typography>
      <Typography variant="body2">{message}</Typography>
    </Alert>
  )

  if (!items.length) {
    const emptyMessage = isSingleTypeView
      ? `В разделе ${currentTitle.toLowerCase()} пока нет подходящих файлов.`
      : 'Попробуйте изменить запрос или выбрать другой тип медиа.'

    return (
      <Stack spacing={2.5}>
        <Box>
          <Typography
            variant="h5"
            component="h2"
            sx={{ fontWeight: 700, color: '#171d2a' }}
          >
            {currentTitle}
          </Typography>
        </Box>
        {renderEmptyState(emptyMessage)}
      </Stack>
    )
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, color: '#171d2a' }}
        >
          {currentTitle}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {items.length} файлов · обновлено сегодня в 09:42
        </Typography>
      </Box>

      {!isSingleTypeView && (
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          {filterOptions.map((option) => (
            <Button
              key={option.id}
              variant={filter === option.id ? 'contained' : 'text'}
              size="small"
              onClick={() => onFilterChange?.(option.id)}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                bgcolor:
                  filter === option.id ? '#e8eefb' : 'transparent',
                color: filter === option.id ? '#1d4ed8' : '#4c5d73',
                fontWeight: filter === option.id ? 700 : 500,
                px: 1.5,
              }}
            >
              {option.label}
            </Button>
          ))}
        </Stack>
      )}

      {/* Изображения */}
      {(!isSingleTypeView || view === 'image') && (
        <Box>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: '#1f2735' }}
            >
              Изображения ·{' '}
              {items.filter((item) => item.type === 'image').length} файлов
            </Typography>

            {!isSingleTypeView && (
              <Button
                size="small"
                sx={{ color: '#53657a', textTransform: 'none' }}
                onClick={() => navigate('/images')}
              >
                Открыть раздел
              </Button>
            )}
          </Stack>

          <Grid container spacing={2}>
            {(view === 'image'
              ? sectionItems
              : items.filter((item) => item.type === 'image')
            )
              .filter((item) => item.type === 'image')
              .slice(0, isSingleTypeView ? undefined : 4)
              .map((item) => {
                const isSelected = item.id === selectedItemId

                return (
                  <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      onClick={() => onSelectItem?.(item)}
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: '#f7f9fc',
                        border: isSelected
                          ? '2px solid #2d5ef5'
                          : '1px solid #e5eaf0',
                        boxShadow: isSelected
                          ? '0 0 0 3px rgba(45, 94, 245, 0.12)'
                          : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#b7c9ff' },
                      }}
                    >
                      <Box sx={{ position: 'relative' }}>
                        {item.previewUrl ? (
                          <CardMedia
                            component="img"
                            height="180"
                            image={item.previewUrl}
                            alt={item.title}
                            sx={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: 180,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: '#e5eaf0',
                            }}
                          >
                            <SearchOff
                              sx={{ fontSize: 38, color: '#64748b' }}
                            />
                          </Box>
                        )}
                      </Box>

                      <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: '#1d2330',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Chip
                              label={item.type}
                              size="small"
                              variant="outlined"
                              sx={{ height: 22, fontSize: 10 }}
                            />
                          </Stack>

                          <Typography variant="caption" color="text.secondary">
                            {formatFileSize(item.size)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
          </Grid>
        </Box>
      )}

      {/* Видео */}
      {(!isSingleTypeView || view === 'video') && (
        <Box>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: '#1f2735' }}
            >
              Видео · {items.filter((item) => item.type === 'video').length}{' '}
              файлов
            </Typography>

            {!isSingleTypeView && (
              <Button
                size="small"
                sx={{ color: '#53657a', textTransform: 'none' }}
                onClick={() => navigate('/videos')}
              >
                Открыть раздел
              </Button>
            )}
          </Stack>

          <Grid container spacing={2}>
            {(view === 'video'
              ? sectionItems
              : items.filter((item) => item.type === 'video')
            )
              .filter((item) => item.type === 'video')
              .slice(0, isSingleTypeView ? undefined : 4)
              .map((item) => {
                const isSelected = item.id === selectedItemId

                return (
                  <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <Card
                      onClick={() => onSelectItem?.(item)}
                      sx={{
                        borderRadius: 3,
                        overflow: 'hidden',
                        bgcolor: '#f7f9fc',
                        border: isSelected
                          ? '2px solid #2d5ef5'
                          : '1px solid #e5eaf0',
                        boxShadow: isSelected
                          ? '0 0 0 3px rgba(45, 94, 245, 0.12)'
                          : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: '#b7c9ff' },
                      }}
                    >
                      <Box
                        sx={{
                          position: 'relative',
                          height: 180,
                          bgcolor: '#111827',
                          overflow: 'hidden',
                        }}
                      >
                        {item.previewUrl ? (
                          <Box
                            component="video"
                            src={item.previewUrl}
                            preload="metadata"
                            muted
                            playsInline
                            aria-label={item.title}
                            sx={{
                              display: 'block',
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <PlayArrow
                              sx={{ fontSize: 48, color: '#fff' }}
                            />
                          </Box>
                        )}

                        <Box
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
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '50%',
                              bgcolor: 'rgba(0,0,0,0.55)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <PlayArrow
                              sx={{ fontSize: 34, color: '#fff' }}
                            />
                          </Box>
                        </Box>
                      </Box>

                      <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                        <Stack spacing={1}>
                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 600,
                                color: '#1d2330',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.title}
                            </Typography>
                            <Chip
                              label="Видео"
                              size="small"
                              variant="outlined"
                              sx={{ height: 22, fontSize: 10 }}
                            />
                          </Stack>

                          <Typography variant="caption" color="text.secondary">
                            {item.duration ?? 'Длительность неизвестна'} ·{' '}
                            {formatFileSize(item.size)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                )
              })}
          </Grid>
        </Box>
      )}

      {/* Аудио */}
      {(!isSingleTypeView || view === 'audio') && (
        <Box sx={{ mt: 1 }}>
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, color: '#1f2735' }}
            >
              Аудио · {items.filter((item) => item.type === 'audio').length}{' '}
              треков
            </Typography>

            {!isSingleTypeView && (
              <Button
                size="small"
                sx={{ color: '#53657a', textTransform: 'none' }}
                onClick={() => navigate('/audio')}
              >
                Открыть раздел
              </Button>
            )}
          </Stack>

          <Box
            sx={{
              bgcolor: '#f7f9fc',
              border: '1px solid #e5eaf0',
              borderRadius: 3,
              overflowX: 'auto',
            }}
          >
            <Box sx={{ minWidth: 560 }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1.2fr 1fr 1fr 1fr 30px',
                  px: 2,
                  py: 1.5,
                  borderBottom: '1px solid #e5eaf0',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  #
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Название
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Исполнитель
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Формат
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Размер
                </Typography>
                <Box />
              </Box>

                      
              {/* Аудио */}
              {(!isSingleTypeView || view === 'audio') && (
                <Box sx={{ mt: 1 }}>
                  <Stack
                    direction="row"
                    sx={{
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, color: '#1f2735' }}
                    >
                      Аудио · {items.filter((item) => item.type === 'audio').length}{' '}
                      треков
                    </Typography>

                    {!isSingleTypeView && (
                      <Button
                        size="small"
                        sx={{ color: '#53657a', textTransform: 'none' }}
                        onClick={() => navigate('/audio')}
                      >
                        Открыть раздел
                      </Button>
                    )}
                  </Stack>

                  <Grid container spacing={2}>
                    {(view === 'audio'
                      ? sectionItems
                      : items.filter((item) => item.type === 'audio')
                    )
                      .filter((item) => item.type === 'audio')
                      .slice(0, isSingleTypeView ? undefined : 4)
                      .map((item) => {
                        const isSelected = item.id === selectedItemId

                        return (
                          <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <Card
                              onClick={() => onSelectItem?.(item)}
                              sx={{
                                borderRadius: 3,
                                overflow: 'hidden',
                                bgcolor: '#f7f9fc',
                                border: isSelected
                                  ? '2px solid #2d5ef5'
                                  : '1px solid #e5eaf0',
                                boxShadow: isSelected
                                  ? '0 0 0 3px rgba(45, 94, 245, 0.12)'
                                  : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  borderColor: '#b7c9ff',
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  position: 'relative',
                                  height: 180,
                                  bgcolor: '#111827',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  overflow: 'hidden',
                                }}
                              >
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    width: 140,
                                    height: 140,
                                    borderRadius: '50%',
                                    bgcolor: '#1e293b',
                                    border: '1px solid #334155',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <MusicNote
                                    sx={{
                                      fontSize: 76,
                                      color: '#93b4ff',
                                    }}
                                  />
                                </Box>

                                <Box
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
                                  <Box
                                    sx={{
                                      width: 48,
                                      height: 48,
                                      borderRadius: '50%',
                                      bgcolor: 'rgba(0,0,0,0.6)',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}
                                  >
                                    <PlayArrow
                                      sx={{ fontSize: 34, color: '#fff' }}
                                    />
                                  </Box>
                                </Box>
                              </Box>

                              <CardContent sx={{ p: 1.5, pb: '12px !important' }}>
                                <Stack spacing={1}>
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      minWidth: 0,
                                    }}
                                  >
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 600,
                                        color: '#1d2330',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        minWidth: 0,
                                      }}
                                      title={item.title}
                                    >
                                      {item.title}
                                    </Typography>

                                    <Chip
                                      label="Аудио"
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        height: 22,
                                        fontSize: 10,
                                        flexShrink: 0,
                                      }}
                                    />
                                  </Stack>

                                  <Typography variant="caption" color="text.secondary">
                                    {item.duration || 'Длительность неизвестна'} ·{' '}
                                    {formatFileSize(item.size)}
                                  </Typography>
                                </Stack>
                              </CardContent>
                            </Card>
                          </Grid>
                        )
                      })}
                  </Grid>
                </Box>
              )}

            </Box>
          </Box>
        </Box>
      )}
    </Stack>
  )
}

