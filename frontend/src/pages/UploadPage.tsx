import { Box, Button, Card, CardContent, LinearProgress, Stack, Typography } from '@mui/material'

export function UploadPage() {
  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h2" sx={{ mb: 1 }}>
          Добавить файлы
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Здесь будет интерфейс выбора файлов, drag-and-drop и состояние загрузки.
        </Typography>
      </Box>

      <Card sx={{ bgcolor: 'background.paper' }}>
        <CardContent>
          <Stack spacing={2}>
            <Button variant="contained" size="large" sx={{ alignSelf: 'flex-start' }}>
              Выбрать файлы
            </Button>

            <Typography variant="body2" color="text.secondary">
              Поддерживаются изображения, видео и аудио. Проверка типов и размера будет добавлена на следующем этапе.
            </Typography>

            <Box>
              <Typography variant="caption" color="text.secondary">
                Имитация загрузки
              </Typography>
              <LinearProgress variant="determinate" value={62} sx={{ mt: 1, height: 8, borderRadius: 999 }} />
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  )
}
