import {
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
  Image,
  LibraryMusic,
  UploadFile,
} from '@mui/icons-material'
import type { AppView } from '../../types/media'

interface SidebarNavigationProps {
  activeView: AppView
  onViewChange: (view: AppView) => void
}

const items: Array<{ label: string; view: AppView; icon: typeof Image }> = [
  { label: 'Медиатека', view: 'library', icon: Image },
  { label: 'Коллекции', view: 'collections', icon: Collections },
  { label: 'Добавить файлы', view: 'upload', icon: UploadFile },
]

export function SidebarNavigation({ activeView, onViewChange }: SidebarNavigationProps) {
  return (
    <Stack
      sx={{
        width: { xs: '100%', sm: 240 },
        minHeight: { xs: 'auto', sm: '100%' },
        bgcolor: 'background.paper',
        borderRight: { xs: 'none', sm: '1px solid rgba(255,255,255,0.08)' },
        borderBottom: { xs: '1px solid rgba(255,255,255,0.08)', sm: 'none' },
      }}
    >
      <Stack sx={{ p: 2, gap: 1 }}>
        <Typography variant="overline" color="text.secondary">
          Media Storage
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Панель навигации
        </Typography>
      </Stack>

      <Divider />

      <List disablePadding>
        {items.map(({ label, view, icon: Icon }) => (
          <ListItemButton
            key={view}
            selected={activeView === view}
            onClick={() => onViewChange(view)}
            sx={{ px: 2.5, py: 1.5 }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Icon color={activeView === view ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        ))}
      </List>

      <Stack sx={{ mt: 'auto', p: 2, gap: 0.5 }}>
        <Typography variant="caption" color="text.secondary">
          Поддержка типов:
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          <LibraryMusic fontSize="small" color="action" />
          <Image fontSize="small" color="action" />
          <Collections fontSize="small" color="action" />
        </Stack>
      </Stack>
    </Stack>
  )
}
