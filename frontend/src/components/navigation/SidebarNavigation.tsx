import {
  Avatar,
  Box,
  Button,
  Chip,
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
  Settings,
  SmartDisplay,
} from '@mui/icons-material'
import type { AppView } from '../../types/media'

interface SidebarNavigationProps {
  activeView: AppView
  onViewChange: (view: AppView) => void
}

const items: Array<{ label: string; count: string; view: AppView; icon: typeof Image }> = [
  { label: 'Обзор', count: '0', view: 'library', icon: PhotoCamera },
  { label: 'Изображения', count: '12 480', view: 'library', icon: Image },
  { label: 'Музыка', count: '3 214', view: 'library', icon: MusicNote },
  { label: 'Видео', count: '860', view: 'library', icon: SmartDisplay },
  { label: 'Коллекции', count: '24', view: 'collections', icon: Collections },
  { label: 'Настройки', count: '0', view: 'upload', icon: Settings },
]

export function SidebarNavigation({ activeView, onViewChange }: SidebarNavigationProps) {
  return (
    <Stack
      sx={{
        width: { xs: '100%', sm: 250 },
        minHeight: '100vh',
        bgcolor: '#eef1f5',
        borderRight: '1px solid #dde3ea',
        px: 1.5,
        py: 1.25,
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
          <Typography variant="caption" color="text.secondary">
            домашний сервер
          </Typography>
        </Box>
      </Box>

      <List disablePadding sx={{ mt: 1 }}>
        {items.map(({ label, count, view, icon: Icon }) => (
          <ListItemButton
            key={`${label}-${view}`}
            selected={activeView === view && label === 'Коллекции'}
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
                '& .MuiListItemText-primary': { fontSize: 15, fontWeight: 500 },
                '& .MuiListItemText-secondary': { fontSize: 11, color: '#66788c' },
              }}
            />
            {count !== '0' && <Typography variant="caption" color="text.secondary">{count}</Typography>}
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2, borderColor: '#dfe3ea' }} />

      <Typography variant="subtitle2" sx={{ px: 1.2, mb: 1, fontWeight: 700 }}>
        Теги
      </Typography>

      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', px: 1.2, gap: 1 }}>
        {['#Семья', '#Отпуск 2026', '#Раво', '#RAW'].map((tag) => (
          <Chip key={tag} label={tag} size="small" variant="outlined" sx={{ borderRadius: 999, bgcolor: '#f7f8fb' }} />
        ))}
      </Stack>

      <Box sx={{ mt: 2, p: 1.5, borderRadius: 3, bgcolor: '#f5f7fa', border: '1px solid #dde3ea' }}>
        <Typography variant="caption" color="text.secondary">
          Использовано 320 ГБ из 1 ТБ
        </Typography>
        <Box sx={{ mt: 1.5, height: 8, borderRadius: 999, bgcolor: '#dfe6ef', overflow: 'hidden' }}>
          <Box sx={{ width: '31%', height: '100%', bgcolor: '#5c7ef6', borderRadius: 999 }} />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          Осталось 704 ГБ
        </Typography>
        <Button variant="contained" fullWidth sx={{ mt: 1.5, borderRadius: 2, textTransform: 'none' }}>
          Увеличить объём
        </Button>
      </Box>
    </Stack>
  )
}
