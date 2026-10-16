import { Add, DeleteOutlined, LabelImportant } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import type { MediaCollection, MediaItem } from '../types/media'

interface CollectionsPageProps {
  collections: MediaCollection[]
  mediaItems: MediaItem[]
  onCreateCollection: (name: string, description?: string) => Promise<MediaCollection | null>
  onAddMediaToCollection: (collectionId: string, mediaId: string) => Promise<MediaCollection | null>
  onRemoveMediaFromCollection: (collectionId: string, mediaId: string) => Promise<MediaCollection | null>
  onDeleteCollection: (collectionId: string) => Promise<void>
}

export function CollectionsPage({
  collections,
  mediaItems,
  onCreateCollection,
  onAddMediaToCollection,
  onRemoveMediaFromCollection,
  onDeleteCollection,
}: CollectionsPageProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [selectedMediaByCollection, setSelectedMediaByCollection] = useState<Record<string, string>>({})

  const itemsById = useMemo(
    () => new Map(mediaItems.map((item) => [item.id, item])),
    [mediaItems],
  )

  const handleCreateCollection = async () => {
    const trimmedName = name.trim()

    if (!trimmedName) {
      setError('Укажите название коллекции.')
      return
    }

    setError(null)

    const created = await onCreateCollection(trimmedName, description.trim())

    if (created) {
      setName('')
      setDescription('')
    } else {
      setError('Не удалось создать коллекцию. Попробуйте ещё раз.')
    }
  }

  const handleAddMedia = async (collectionId: string) => {
    const mediaId = selectedMediaByCollection[collectionId]

    if (!mediaId) {
      setError('Выберите файл для добавления в коллекцию.')
      return
    }

    setError(null)

    const updatedCollection = await onAddMediaToCollection(collectionId, mediaId)

    if (updatedCollection) {
      setSelectedMediaByCollection((current) => ({
        ...current,
        [collectionId]: '',
      }))
    } else {
      setError('Не удалось добавить файл в коллекцию. Попробуйте ещё раз.')
    }
  }

  const handleRemoveMedia = async (collectionId: string, mediaId: string) => {
    setError(null)

    const updatedCollection = await onRemoveMediaFromCollection(collectionId, mediaId)

    if (!updatedCollection) {
      setError('Не удалось удалить файл из коллекции. Попробуйте ещё раз.')
    }
  }

  const handleDeleteCollection = async (collectionId: string) => {
    setError(null)
    await onDeleteCollection(collectionId)
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h2" sx={{ mb: 1, color: '#1d2430' }}>
          Коллекции
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Создавайте подборки, объединяйте медиафайлы и управляйте своими коллекциями.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card sx={{ bgcolor: '#f7f9fb', border: '1px solid #e5eaf0', borderRadius: 3 }}>
        <CardContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Создать новую коллекцию
            </Typography>

            <TextField
              label="Название коллекции"
              value={name}
              onChange={(event) => setName(event.target.value)}
              fullWidth
              required
              slotProps={{ htmlInput:{ maxLength: 100 }}}
            />

            <TextField
              label="Описание"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              fullWidth
              multiline
              minRows={2}
              slotProps={{ htmlInput:{ maxLength: 500 }}}
            />

            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => void handleCreateCollection()}
              disabled={!name.trim()}
            >
              Создать коллекцию
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        {collections.length === 0 ? (
          <Alert severity="info">
            Коллекций пока нет. Создайте первую подборку.
          </Alert>
        ) : (
          collections.map((collection) => {
            const collectionMedia = collection.mediaIds
              .map((mediaId) => itemsById.get(mediaId))
              .filter((item): item is MediaItem => Boolean(item))

            const availableMedia = mediaItems.filter(
              (item) => !collection.mediaIds.includes(item.id),
            )

            return (
              <Card
                key={collection.id}
                sx={{
                  bgcolor: '#f7f9fb',
                  border: '1px solid #e5eaf0',
                  borderRadius: 3,
                }}
              >
                <CardContent sx={{ p: 2.5 }}>
                  <Stack spacing={2}>
                    <Stack
                      direction={{ xs: 'column', sm: 'row' }}
                      sx={{
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 1.5,
                      }}
                    >
                      <Box sx={{ minWidth: 0 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, color: '#1d2430', overflowWrap: 'anywhere' }}
                        >
                          {collection.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {collection.description || 'Без описания'}
                        </Typography>
                      </Box>

                      <Button
                        color="error"
                        variant="text"
                        startIcon={<DeleteOutlined />}
                        onClick={() => {
                          if (window.confirm(`Удалить коллекцию «${collection.name}»?`)) {
                            void handleDeleteCollection(collection.id)
                          }
                        }}
                      >
                        Удалить
                      </Button>
                    </Stack>

                    <Chip
                      label={`${collectionMedia.length} файлов`}
                      color="primary"
                      variant="outlined"
                      sx={{ alignSelf: 'flex-start' }}
                    />

                    {collectionMedia.length > 0 ? (
                      <Stack spacing={1.2}>
                        {collectionMedia.map((item) => (
                          <Box
                            key={item.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 1.5,
                              borderRadius: 2,
                              bgcolor: '#ffffff',
                              border: '1px solid #e5eaf0',
                              px: 1.5,
                              py: 1,
                              minWidth: 0,
                            }}
                          >
                            <Stack
                              direction="row"
                              spacing={1.25}
                              sx={{ alignItems: 'center', minWidth: 0, flex: 1 }}
                            >
                              {item.previewUrl ? (
                                <Box
                                  component="img"
                                  src={item.previewUrl}
                                  alt={item.title}
                                  sx={{
                                    width: 46,
                                    height: 46,
                                    objectFit: 'cover',
                                    borderRadius: 1.5,
                                    flexShrink: 0,
                                  }}
                                />
                              ) : (
                                <Box
                                  sx={{
                                    width: 46,
                                    height: 46,
                                    borderRadius: 1.5,
                                    bgcolor: '#e5eaf0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                  }}
                                >
                                  <LabelImportant color="action" />
                                </Box>
                              )}

                              <Box sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontWeight: 600,
                                    color: '#1d2430',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                  }}
                                >
                                  {item.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {item.type} · {item.size}
                                </Typography>
                              </Box>
                            </Stack>

                            <Button
                              size="small"
                              color="inherit"
                              onClick={() => void handleRemoveMedia(collection.id, item.id)}
                            >
                              Удалить
                            </Button>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Alert severity="info">
                        В этой коллекции пока нет файлов.
                      </Alert>
                    )}

                    {availableMedia.length > 0 ? (
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={1.5}
                        sx={{
                          alignItems: { xs: 'stretch', sm: 'center' },
                          mt: 1,
                        }}
                      >
                        <FormControl size="small" sx={{ minWidth: 0, flex: 1 }}>
                          <InputLabel id={`collection-${collection.id}-label`}>
                            Добавить файл
                          </InputLabel>
                          <Select
                            labelId={`collection-${collection.id}-label`}
                            value={selectedMediaByCollection[collection.id] ?? ''}
                            label="Добавить файл"
                            onChange={(event) => {
                              const mediaId = event.target.value
                              setSelectedMediaByCollection((current) => ({
                                ...current,
                                [collection.id]: mediaId,
                              }))
                            }}
                          >
                            <MenuItem value="">Выберите файл</MenuItem>
                            {availableMedia.map((item) => (
                              <MenuItem key={item.id} value={item.id}>
                                {item.title}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Button
                          variant="contained"
                          startIcon={<LabelImportant />}
                          disabled={!selectedMediaByCollection[collection.id]}
                          onClick={() => void handleAddMedia(collection.id)}
                        >
                          Добавить в коллекцию
                        </Button>
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Все медиафайлы уже добавлены в эту коллекцию.
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )
          })
        )}
      </Stack>
    </Stack>
  )
}
