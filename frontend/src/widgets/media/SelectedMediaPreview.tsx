
import {
  Close,
  NavigateBefore,
  NavigateNext,
  OpenInFull,
  PlayArrow,
  AudioFile,
  DeleteOutlined,
  EditOutlined,
} from '@mui/icons-material'
import {
  Backdrop,
  Box,
  Card,
  CardContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import type { MediaItem } from '../../types/media'
import { formatFileSize } from '../../utils/media'

interface SelectedMediaPreviewProps {
  item: MediaItem | null
  open: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  onRename: () => void
  onDelete: () => void
  actionsDisabled: boolean
}

export function SelectedMediaPreview({
  item,
  open,
  onClose,
  onNext,
  onPrevious,
  onRename,
  onDelete,
  actionsDisabled,
}: SelectedMediaPreviewProps) {
  useEffect(() => {
    if (!open) {
      return undefined
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      } else if (event.key === 'ArrowRight') {
        onNext?.()
      } else if (event.key === 'ArrowLeft') {
        onPrevious?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onNext, onPrevious, open])

  if (!item || !open) {
    return null
  }

  const typeLabel =
    item.type === 'image'
      ? 'Фото'
      : item.type === 'video'
        ? 'Видео'
        : 'Аудио'

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal - 1,
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
          overflow: 'auto',
          bgcolor: '#f7f9fb',
          border: '1px solid #e5eaf0',
          boxShadow: '0 28px 80px rgba(0,0,0,0.38)',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Заголовок */}
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              px: 2,
              gap: 1,
              borderBottom: '1px solid #e5eaf0',
              bgcolor: '#f2f5f8',
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: 'center', minWidth: 0 }}
            >
              <OpenInFull sx={{ fontSize: 18, color: '#2d5ef5', flexShrink: 0 }} />
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#1d2430',
                  fontWeight: 700,
                  overflowWrap: 'anywhere',
                }}
              >
                {item.title}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
              <Tooltip title="Изменить название">
                <span>
                  <IconButton
                    onClick={onRename}
                    disabled={actionsDisabled}
                    size="small"
                    aria-label="Изменить название файла"
                    sx={{ color: '#314255' }}
                  >
                    <EditOutlined fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Удалить файл">
                <span>
                  <IconButton
                    onClick={onDelete}
                    disabled={actionsDisabled}
                    size="small"
                    aria-label="Удалить файл"
                    color="error"
                  >
                    <DeleteOutlined fontSize="small" />
                  </IconButton>
                </span>
              </Tooltip>
              <IconButton
                onClick={onClose}
                size="small"
                aria-label="Закрыть просмотр"
                sx={{ color: '#314255' }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          {/* Основное содержимое и метаданные */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'stretch',
              minHeight: 0,
              overflow: 'hidden',
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            <Box
              sx={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#111827',
                minHeight: { xs: 240, md: 360, xl: 420 },
                p: { xs: 1, sm: 2 },
              }}
            >
              {item.type === 'image' && (
                item.previewUrl ? (
                  <Box
                    component="img"
                    src={item.previewUrl}
                    alt={item.title}
                    sx={{
                      display: 'block',
                      maxWidth: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Typography color="white">
                    Изображение недоступно
                  </Typography>
                )
              )}

              {item.type === 'video' && (
                item.previewUrl ? (
                  <Box
                    component="video"
                    key={item.id}
                    src={item.previewUrl}
                    controls
                    autoPlay={false}
                    playsInline
                    preload="metadata"
                    aria-label={item.title}
                    sx={{
                      display: 'block',
                      width: '100%',
                      maxHeight: '70vh',
                      objectFit: 'contain',
                    }}
                  >
                    Ваш браузер не поддерживает воспроизведение видео.
                  </Box>
                ) : (
                  <Stack sx={{ alignItems: 'center', color: 'white', gap: 1 }}>
                    <PlayArrow sx={{ fontSize: 56 }} />
                    <Typography>Видео недоступно</Typography>
                  </Stack>
                )
              )}

              {item.type === 'audio' && (
                <Stack
                  sx={{
                    width: '100%',
                    maxWidth: 560,
                    alignItems: 'center',
                    gap: 3,
                    color: 'white',
                    p: 2,
                  }}
                >
                  <AudioFile sx={{ fontSize: 88 }} />

                  <Typography
                    variant="h6"
                    sx={{ textAlign: 'center', overflowWrap: 'anywhere' }}
                  >
                    {item.title}
                  </Typography>

                  {item.previewUrl ? (
                    <Box
                      component="audio"
                      key={item.id}
                      src={item.previewUrl}
                      controls
                      preload="metadata"
                      aria-label={item.title}
                      sx={{ width: '100%' }}
                    >
                      Ваш браузер не поддерживает воспроизведение аудио.
                    </Box>
                  ) : (
                    <Typography variant="body2">
                      Аудиофайл недоступен
                    </Typography>
                  )}
                </Stack>
              )}
            </Box>

            <Stack
              sx={{
                width: { xs: '100%', md: 260 },
                flexShrink: 0,
                p: 2,
                borderLeft: { xs: 'none', md: '1px solid #e5eaf0' },
                borderTop: { xs: '1px solid #e5eaf0', md: 'none' },
                bgcolor: '#f2f5f8',
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ color: '#1d2430', fontWeight: 700, mb: 1.5 }}
              >
                Метаданные
              </Typography>

              <Stack spacing={1.2}>
                <Typography variant="body2" sx={{ color: '#4d5d73' }}>
                  Тип: {typeLabel}
                </Typography>

                <Typography variant="body2" sx={{ color: '#4d5d73' }}>
                  Размер: {formatFileSize(item.size)}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: '#4d5d73', overflowWrap: 'anywhere' }}
                >
                  Дата: {item.createdAt}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{ color: '#4d5d73', overflowWrap: 'anywhere' }}
                >
                  Теги: {item.tags.join(', ') || '—'}
                </Typography>

                {item.duration && (
                  <Typography variant="body2" sx={{ color: '#4d5d73' }}>
                    Длительность: {item.duration}
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Box>

          {/* Переключение файлов */}
          <Stack
            direction="row"
            sx={{
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 1,
              p: 1.5,
              px: 2,
              borderTop: '1px solid #e5eaf0',
              bgcolor: '#f2f5f8',
            }}
          >
            <IconButton
              onClick={onPrevious}
              disabled={!onPrevious}
              aria-label="Предыдущий файл"
              sx={{
                color: '#1d2430',
                border: '1px solid #dfe5ee',
                bgcolor: '#fff',
              }}
            >
              <NavigateBefore />
            </IconButton>

            <Typography
              variant="caption"
              sx={{ color: '#586f8c', textAlign: 'center' }}
            >
              {typeLabel} · {formatFileSize(item.size)}
            </Typography>

            <IconButton
              onClick={onNext}
              disabled={!onNext}
              aria-label="Следующий файл"
              sx={{
                color: '#1d2430',
                border: '1px solid #dfe5ee',
                bgcolor: '#fff',
              }}
            >
              <NavigateNext />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </Backdrop>
  )
}
