import { Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material'
import type { MediaCollection } from '../types/media'

interface CollectionsPageProps {
  collections: MediaCollection[]
}

export function CollectionsPage({ collections }: CollectionsPageProps) {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
          Коллекции
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Здесь будет список пользовательских подборок и их содержимое.
        </Typography>
      </Box>

      <Stack spacing={2}>
        {collections.map((collection) => (
          <Card key={collection.id} sx={{ bgcolor: 'background.paper' }}>
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6">{collection.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {collection.description}
                  </Typography>
                </Box>
                <Chip label={`${collection.mediaIds.length} медиа`} color="primary" variant="outlined" />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
