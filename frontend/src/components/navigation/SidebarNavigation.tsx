import {
  Avatar,
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material'
import {
  Collections,
  FolderOpen,
  Image,
  MusicNote,
  PhotoCamera,
  SmartDisplay,
} from '@mui/icons-material'
import type { AppView, StorageSummary } from '../../types/media'

interface SidebarNavigationProps {
  activeView: AppView
  onViewChange: (view: AppView) => void
  storageSummary: StorageSummary | null
  totalCollections: number
  mediaCounts: {
    image: number
    video: number
    audio: number
  }
}

export function SidebarNavigation({
  activeView,
  onViewChange,
  storageSummary,
  totalCollections,
  mediaCounts,
}: SidebarNavigationProps) {
  const items: Array<{ label: string; count?: string; view: AppView; icon: typeof Image }> = [
    { label: 'Обзор', view: 'library', icon: PhotoCamera },
    { label: 'Изображения', count: mediaCounts.image.toLocaleString('ru-RU'), view: 'images', icon: Image },
    { label: 'Музыка', count: mediaCounts.audio.toLocaleString('ru-RU'), view: 'audio', icon: MusicNote },
    { label: 'Видео', count: mediaCounts.video.toLocaleString('ru-RU'), view: 'videos', icon: SmartDisplay },
    { label: 'Коллекции', count: totalCollections.toLocaleString('ru-RU'), view: 'collections', icon: Collections },
  ]

  const formatStorageSize = (gb: number) => {
    if (gb < 1) {
      const mb = gb * 1024
      return mb < 1
        ? `${(gb * 1024 ** 2).toFixed(0)} КБ`
        : `${mb.toFixed(1)} МБ`
    }

    return `${gb.toFixed(2)} ГБ`
  }
  return (
    <Stack
      sx={{
        width: { xs: '100%', lg: 250 },
        height: { xs: 'auto', lg: '100vh' },
        bgcolor: '#eef1f5',
        borderRight: { xs: 'none', lg: '1px solid #dde3ea' },
        borderBottom: { xs: '1px solid #dde3ea', lg: 'none' },
        px: { xs: 1.25, sm: 1.5 },
        py: 1.25,
        overflowY: 'auto',
        overflowX: 'hidden',
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1.25, mb: 1 }}>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: '#dfe9ff',
            color: '#2d5ef5',
            fontSize: 18,
          }}
        >
          <FolderOpen fontSize="small" />
        </Avatar>

        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
            Media Storage
          </Typography>
          <Typography variant="caption" sx={{ color: '#53657a' }}>
            домашний сервер
          </Typography>
        </Box>
      </Box>

      <List disablePadding sx={{ mt: 1 }}>
        {items.map(({ label, count, view, icon: Icon }) => (
          <ListItemButton
            key={`${label}-${view}`}
            selected={activeView === view}
            onClick={() => onViewChange(view)}
            sx={{
              borderRadius: 2,
              px: 1.25,
              py: 0.8,
              mb: 0.35,
              '&.Mui-selected': {
                bgcolor: '#dbe7ff',
                color: '#1d4ed8',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: activeView === view ? '#1d4ed8' : '#52627a' }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={label}
              secondary={count}
              sx={{
                my: 0,
                '& .MuiListItemText-primary': { fontSize: 15, fontWeight: 500, color: '#1d2430' },
                '& .MuiListItemText-secondary': { fontSize: 11, color: '#52627a' },
              }}
            />
            {count !== '0' && <Typography variant="caption" sx={{ color: '#475c74' }}>{count}</Typography>}
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2, borderColor: '#dfe3ea' }} />

     {/**<Typography variant="subtitle2" sx={{ px: 1.2, mb: 1, fontWeight: 700 }}>
        Теги
      </Typography>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', px: 1.2, gap: 1 }}>
        {['#Семья', '#Отпуск 2026', '#Раво', '#RAW'].map((tag) => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            variant="outlined"
            sx={{ borderRadius: 999, bgcolor: '#f7f8fb', color: '#445367', borderColor: '#cfd7e5' }}
          />
        ))}
      </Stack>
**/}
      <Box sx={{ mt: 2, p: 1.5, borderRadius: 3, bgcolor: '#f5f7fa', border: '1px solid #dde3ea' }}>
        <Typography variant="caption" sx={{ color: '#4a5d75' }}>
          {storageSummary
          ? `Использовано ${formatStorageSize(storageSummary.usedGb)} из ${formatStorageSize(storageSummary.totalGb)}`
          : 'Загрузка данных...'}
        </Typography>
        <Box sx={{ mt: 1.5, height: 8, borderRadius: 999, bgcolor: '#dfe6ef', overflow: 'hidden' }}>
          <Box
            sx={{
              width: storageSummary ? `${storageSummary.percentage}%` : '0%',
              height: '100%',
              bgcolor: '#5c7ef6',
              borderRadius: 999,
            }}
          />
        </Box>
        <Typography
          variant="caption"
          sx={{ display: 'block', mt: 1, color: '#4a5d75' }}
        >
          {storageSummary
            ? `Осталось ${formatStorageSize(storageSummary.freeGb)}`
            : 'Подсчёт свободного места...'}
        </Typography>
      </Box>
    </Stack>
  )
}
