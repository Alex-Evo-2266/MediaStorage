import {
  AppBar,
  Avatar,
  Box,
  InputAdornment,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface TopBarProps {
  title: string
  searchValue: string
  onSearchChange: (value: string) => void
}

export function TopBar({ title, searchValue, onSearchChange }: TopBarProps) {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        bgcolor: '#f5f7fa',
        borderBottom: '1px solid #dde3ea',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 2, px: 3, py: 1.4, minHeight: 72 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: '#1c2330' }}>
            {title}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', ml: 'auto' }}>
          <TextField
            size="small"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Поиск по медиатеке"
            sx={{ width: 340, maxWidth: '100%' }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', ml: 1 }}>
            <Typography variant="caption" sx={{ color: '#4c5d74' }}>
              Сортировка: по дате
            </Typography>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#dfe7ff', color: '#1d4ed8', fontSize: 12 }}>А</Avatar>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  )
}
